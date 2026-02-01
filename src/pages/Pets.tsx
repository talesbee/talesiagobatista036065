import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPets } from '../services/petService';
import { CardPet, Button, HeaderPage } from '../components';
import { FabButton } from '../components/FabButton';
import { Pet, PetsResponse } from '../types';

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [fabOpen, setFabOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fabRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (!fabOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setFabOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fabOpen]);

  useEffect(() => {
    setLoading(true);
    getPets(page, 10, search)
      .then((res: PetsResponse) => {
        setPets(res.content);
        setPageCount(res.pageCount - 1);
        setLoading(false);
      })
      .catch(() => {
        setError(t('pets.error'));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, t, search]);

  if (loading)
    return (
      <div className="flex flex-1 min-h-[26vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-blue-700 font-medium mt-2">{t('pets.loading')}</span>
        </div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex-1 p-3 pt-4 relative">
      {/* Header reutilizável */}
      <HeaderPage
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={() => {
          setSearch(searchInput);
          setPage(0);
        }}
      />

      {/* Grid de pets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {pets.map((pet) => (
          <CardPet key={pet.id} pet={pet} onClick={() => navigate(`/pets/${pet.id}`)} />
        ))}
      </div>

      {/* Paginação */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-center gap-2 py-3">
        <Button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          {t('pets.prev')}
        </Button>
        <span className="px-2">{t('pets.page', { page: page + 1, pageCount: pageCount + 1 })}</span>
        <Button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          {t('pets.next')}
        </Button>
      </div>

      {/* Botão flutuante */}
      <div ref={fabRef} className="inline-block">
        <FabButton open={fabOpen} onToggle={() => setFabOpen((open) => !open)}>
          <Button
            className="flex items-center justify-end rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-lg min-w-0 px-3 py-2"
            onClick={() => {
              setFabOpen(false);
              navigate('/pets/novo');
            }}
          >
            <span className="material-icons text-1xl">{t('pets.addPet')}</span>
          </Button>
          <Button
            className="flex items-center justify-end rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg text-lg min-w-0 px-3 py-2"
            onClick={() => {
              setFabOpen(false);
              alert('Adicionar Tutor (em breve)');
            }}
          >
            <span className="material-icons text-1xl">{t('tutors.addTutor')}</span>
          </Button>
        </FabButton>
      </div>
    </div>
  );
}
