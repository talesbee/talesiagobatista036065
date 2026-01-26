import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPets, Pet, PetsResponse } from "../services/petService";
import { CardPet, Button } from "../components";

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    getPets(page)
      .then((res: PetsResponse) => {
        setPets(res.content);
        setPageCount(res.pageCount - 1);
        setLoading(false);
      })
      .catch(() => {
        setError(t("pets.error"));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, t]);

  if (loading)
    return (
      <div className="flex flex-1 min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-blue-700 font-medium mt-2">
            {t("pets.loading")}
          </span>
        </div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex-1 p-4 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {pets.map((pet) => (
          <CardPet key={pet.id} pet={pet} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          {t("pets.prev")}
        </Button>
        <span className="px-2">{t("pets.page", { page, pageCount })}</span>
        <Button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          {t("pets.next")}
        </Button>
      </div>
    </div>
  );
}
