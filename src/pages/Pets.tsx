import { useEffect, useState } from 'react';
import { getPets, Pet, PetsResponse } from '../services/petService';

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    setLoading(true);
    getPets(page)
      .then((res: PetsResponse) => {
        setPets(res.content);
        setPageCount(res.pageCount);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar pets');
        setLoading(false);
      });
  }, [page]);

  if (loading) return <div className="p-4">Carregando pets...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            {pet.foto && pet.foto.url && (
              <img src={pet.foto.url} alt={pet.nome} className="w-24 h-24 object-cover rounded-full mb-2" />
            )}
            <div className="font-bold text-lg mb-1">{pet.nome}</div>
            <div className="text-gray-600">{pet.raca}</div>
            <div className="text-gray-500 text-sm">Idade: {pet.idade ?? '-'}</div>
          </div>
        ))}
      </div>
      {/* Paginação simples */}
      <div className="flex justify-center gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span className="px-2">Página {page} de {pageCount}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

