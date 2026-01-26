import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPets, Pet, PetsResponse } from "../services/petService";
import { CardPet, Button } from "../components";
import { FabButton } from "../components/FabButton";

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [fabOpen, setFabOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <div className="flex flex-1 min-h-[26vh] items-center justify-center">
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
    <div className="flex-1 p-3 pt-4 relative">
      {/* Título e botão de tutores */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-700">{t("pets.title")}</h1>
        <Button
          className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 hover:bg-blue-100 text-blue-700 border border-blue-200"
          onClick={() => navigate("/tutors")}
        >
          <span className="material-icons text-base">group</span>
          {t("tutors.title")}
        </Button>
      </div>
      {/* Campo de busca */}
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder={t("pets.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Listagem de Pets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {pets
          .filter(
            (pet) =>
              search.trim() === "" ||
              pet.name.toLowerCase().includes(search.trim().toLowerCase()),
          )
          .map((pet) => (
            <CardPet key={pet.id} pet={pet} />
          ))}
      </div>
      {/* Paginação */}
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

      <FabButton open={fabOpen} onToggle={() => setFabOpen((open) => !open)}>
        <Button
          className="flex items-center justify-end rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-lg min-w-0 px-3 py-2"
          onClick={() => {
            setFabOpen(false);
            alert("Adicionar Pet (em breve)");
          }}
        >
          <span className="material-icons text-1xl">{t("pets.addPet")}</span>
        </Button>
        <Button
          className="flex items-center justify-end rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg text-lg min-w-0 px-3 py-2"
          onClick={() => {
            setFabOpen(false);
            alert("Adicionar Tutor (em breve)");
          }}
        >
          <span className="material-icons text-1xl">
            {t("tutors.addTutor")}
          </span>
        </Button>
      </FabButton>
    </div>
  );
}
