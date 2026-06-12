import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PokedexHeader } from "#/components/pokedex-header";
import { PokemonCard } from "#/components/pokemon-card";
import { getPokemonDetails, type Pokemon } from "#/lib/pokemon";

export const Route = createFileRoute("/pokemon/$pokemon")({
  component: PokemonRoute,
});

function PokemonRoute() {
  const { pokemon } = Route.useParams();
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadPokemon() {
      setLoading(true);
      setError(null);
      setPokemonData(null);

      const result = await getPokemonDetails(pokemon);

      if (!isActive) return;

      if (result) {
        setPokemonData(result);
      } else {
        setError(`Pokémon "${pokemon}" not found. Try another name or ID!`);
      }

      setLoading(false);
    }

    loadPokemon();

    return () => {
      isActive = false;
    };
  }, [pokemon]);

  const handlePokemonSelect = (name: string) => {
    navigate({
      to: "/pokemon/$pokemon",
      params: { pokemon: name.toLowerCase() },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <PokedexHeader />

        <div className="flex justify-center">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading Pokémon...</p>
            </div>
          )}

          {error && !loading && (
            <div className="max-w-md w-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-4 text-center">
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Try searching by name (e.g., "pikachu") or by ID (e.g., "25")
              </p>
            </div>
          )}

          {pokemonData && !loading && (
            <PokemonCard
              pokemon={pokemonData}
              onPokemonSelect={handlePokemonSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
