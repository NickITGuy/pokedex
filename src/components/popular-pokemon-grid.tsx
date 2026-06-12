import { useEffect, useState } from "react";
import { Card, CardContent } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";

interface PokemonGridItem {
  id: number;
  name: string;
  image: string;
  types: string[];
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "bg-gray-400",
    fighting: "bg-red-700",
    flying: "bg-blue-400",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    rock: "bg-yellow-700",
    bug: "bg-green-500",
    ghost: "bg-purple-700",
    steel: "bg-gray-500",
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-400",
    electric: "bg-yellow-400",
    psychic: "bg-pink-500",
    ice: "bg-cyan-400",
    dragon: "bg-indigo-600",
    dark: "bg-gray-800",
    fairy: "bg-pink-400",
  };
  return colors[type.toLowerCase()] || "bg-gray-400";
}

interface PopularPokemonGridProps {
  onPokemonSelect: (name: string) => void;
}

export function PopularPokemonGrid({ onPokemonSelect }: PopularPokemonGridProps) {
  const [pokemon, setPokemon] = useState<PokemonGridItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPokemon = async () => {
      try {
        const ids = Array.from({ length: 12 }, (_, i) => i + 1);
        const data = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const json = await res.json();
            return {
              id: json.id,
              name: json.name,
              image:
                json.sprites.other["official-artwork"].front_default ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json.id}.png`,
              types: json.types.map((t: any) => t.type.name),
            };
          })
        );
        setPokemon(data);
      } catch (error) {
        console.error("Failed to fetch popular pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPokemon();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading popular Pokémon...</p>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        Popular Pokémon
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pokemon.map((p) => (
          <Card
            key={p.id}
            className="cursor-pointer hover:shadow-lg dark:hover:shadow-xl dark:shadow-slate-900 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 hover:scale-105"
            onClick={() => onPokemonSelect(p.name)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-3">
                {/* Image */}
                <div className="w-full h-24 flex items-center justify-center bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                {/* Name */}
                <div className="text-center">
                  <p className="font-semibold text-sm capitalize text-gray-900 dark:text-white">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    #{p.id.toString().padStart(3, "0")}
                  </p>
                </div>

                {/* Types */}
                <div className="flex gap-1 flex-wrap justify-center">
                  {p.types.map((type) => (
                    <Badge
                      key={type}
                      className={`${getTypeColor(
                        type
                      )} text-white text-xs capitalize cursor-default`}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
