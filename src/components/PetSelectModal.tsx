import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pet } from '../types';
import { Button, PetListItem } from '../components';
import { useTranslation } from 'react-i18next';
import { linkTutorPet } from '../services/tutorService';
import { getPets } from '../services/petService';
import { Close } from '../assets/icons';

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ isOpen, onClose, title, children }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative z-10 max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            aria-label={t('modal.close')}
            className="px-2 py-1 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            <Close className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

interface PetSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: number;
  onLinked: () => void;
  petsLinked?: Pet[] | null;
}

const PAGE_SIZE = 10;

const PetSelectModal: React.FC<PetSelectModalProps> = ({
  isOpen,
  onClose,
  tutorId,
  onLinked,
  petsLinked,
}) => {
  const { t } = useTranslation();
  const labels = {
    title: t('petSelect.title'),
    placeholder: t('pets.search'),
    loading: t('pets.loading'),
    noneFound: t('pets.notFound'),
    prev: t('pets.prev'),
    next: t('pets.next'),
    page: (p: number, pc: number) => t('pets.page', { page: p, pageCount: pc }),
    confirmTitle: t('petSelect.confirmTitle'),
    confirmMessage: (name: string) => t('petSelect.confirmMessage', { name }),
    back: t('petDetails.back'),
    confirm: t('petSelect.confirm'),
    linking: t('petSelect.linking'),
  };
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getPets(page - 1, PAGE_SIZE, search)
      .then((res) => {
        let available = res.content;
        if (typeof petsLinked !== 'undefined' && petsLinked && petsLinked.length > 0) {
          const linkedIds = new Set(petsLinked.map((p) => p.id));
          available = res.content.filter((p) => !linkedIds.has(p.id));
        } else {
          available = res.content.filter(
            (p) => !p.tutores || !p.tutores.some((t) => t.id === tutorId),
          );
        }
        setPets(available);
        setPageCount(res.pageCount - 1);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(() => {
        setPets([]);
        setTotal(0);
        setLoading(false);
      });
  }, [isOpen, search, page]);

  const handleLink = async () => {
    if (!selectedPet) return;
    setLoading(false);
    try {
      await linkTutorPet(tutorId, selectedPet.id);
      onLinked();
      onClose();
    } catch {
    } finally {
      setLoading(false);
      setSearch('');
      setPage(1);
      setSelectedPet(null);
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose} title={labels.title}>
      <div className="mb-4">
        {!selectedPet ? (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder={labels.placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="max-h-64 overflow-y-auto mb-2">
              {loading ? (
                <div className="flex justify-center items-center p-4 text-gray-500">
                  {labels.loading}
                </div>
              ) : (
                <div>
                  {pets.length === 0 ? (
                    <div className="p-2 text-gray-500">{labels.noneFound}</div>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {pets.map((pet) => (
                        <PetListItem
                          key={pet.id}
                          pet={pet}
                          onClick={() => setSelectedPet(pet)}
                          showRemove={false}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 items-center mt-4">
              <Button
                variant="confirm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {labels.prev}
              </Button>
              <span className="px-2">{labels.page(page, pageCount + 1)}</span>
              <Button
                variant="confirm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * PAGE_SIZE >= total}
              >
                {labels.next}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <div className="font-semibold text-lg text-brand-blue">{labels.confirmTitle}</div>
              <div className="text-sm text-gray-600">{labels.confirmMessage(selectedPet.nome)}</div>
            </div>
            <div className="w-full max-w-md">
              <PetListItem pet={selectedPet} showRemove={false} onClick={() => {}} />
            </div>
            <div className="flex gap-2">
              <Button variant="warning" onClick={() => setSelectedPet(null)}>
                {labels.back}
              </Button>
              <Button variant="confirm" onClick={handleLink} disabled={loading}>
                {loading ? labels.linking : labels.confirm}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModalPortal>
  );
};

export default PetSelectModal;
