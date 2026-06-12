import { useEffect, useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  getPokemonEvolutionChain,
  type EvolutionNode,
  type Pokemon,
} from "#/lib/pokemon";

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

interface PokemonCardProps {
  pokemon: Pokemon;
  onPokemonSelect: (name: string) => void;
}

function getPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function EvolutionBranch({
  node,
  currentPokemonName,
  onPokemonSelect,
}: {
  node: EvolutionNode;
  currentPokemonName: string;
  onPokemonSelect: (name: string) => void;
}) {
  const isCurrentPokemon = node.name === currentPokemonName;
  const evolutionCardClasses = `flex min-w-24 flex-col items-center rounded-lg border p-2 transition-colors ${
    isCurrentPokemon
      ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40"
      : "border-gray-200 bg-gray-50 hover:border-red-300 hover:bg-red-50 focus-visible:border-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-red-700 dark:hover:bg-red-950/30 dark:focus-visible:border-red-600 dark:focus-visible:ring-red-800"
  }`;
  const content = (
    <>
      <div className="flex h-14 w-14 items-center justify-center">
        {node.id > 0 && (
          <img
            src={getPokemonImageUrl(node.id)}
            alt={node.name}
            className="h-14 w-14 object-contain"
          />
        )}
      </div>
      <p className="mt-1 text-xs font-semibold capitalize text-gray-900 dark:text-white">
        {node.name}
      </p>
      {isCurrentPokemon && (
        <span className="mt-1 text-[10px] font-medium uppercase text-red-600 dark:text-red-400">
          Current
        </span>
      )}
    </>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {isCurrentPokemon ? (
        <div className={evolutionCardClasses}>{content}</div>
      ) : (
        <button
          type="button"
          className={`${evolutionCardClasses} cursor-pointer`}
          onClick={() => onPokemonSelect(node.name)}
        >
          {content}
        </button>
      )}

      {node.evolvesTo.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg leading-none text-gray-400 dark:text-gray-500">
            |
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {node.evolvesTo.map((evolution) => (
              <EvolutionBranch
                key={evolution.name}
                node={evolution}
                currentPokemonName={currentPokemonName}
                onPokemonSelect={onPokemonSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PokemonCard({ pokemon, onPokemonSelect }: PokemonCardProps) {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionNode | null>(
    null
  );
  const [evolutionLoading, setEvolutionLoading] = useState(false);

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    getPokemonImageUrl(pokemon.id);

  useEffect(() => {
    let isActive = true;

    async function fetchEvolutionChain() {
      setEvolutionLoading(true);
      setEvolutionChain(null);

      const chain = await getPokemonEvolutionChain(pokemon.id);
      if (isActive) {
        setEvolutionChain(chain);
        setEvolutionLoading(false);
      }
    }

    fetchEvolutionChain();

    return () => {
      isActive = false;
    };
  }, [pokemon.id]);

  return (
    <Card className="w-full max-w-md mx-auto dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="capitalize flex items-center justify-between dark:text-white">
          <span>{pokemon.name}</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image */}
        <div className="flex justify-center bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <img
            src={imageUrl}
            alt={pokemon.name}
            className="h-48 w-48 object-contain"
          />
        </div>

        {/* Types */}
        <div>
          <h3 className="text-sm font-semibold mb-2 dark:text-white">Types</h3>
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                className={`${getTypeColor(
                  type.type.name
                )} capitalize text-white cursor-default`}
              >
                {type.type.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Evolution Chain */}
        <div>
          <h3 className="text-sm font-semibold mb-3 dark:text-white">
            Evolution Chain
          </h3>
          {evolutionLoading && (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-slate-700 dark:text-gray-300">
              Loading evolution chain...
            </div>
          )}
          {!evolutionLoading && evolutionChain && (
            <div className="overflow-x-auto rounded-lg bg-white p-3 dark:bg-slate-800">
              {evolutionChain.evolvesTo.length > 0 ? (
                <EvolutionBranch
                  node={evolutionChain}
                  currentPokemonName={pokemon.name}
                  onPokemonSelect={onPokemonSelect}
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This Pokemon does not evolve.
                </p>
              )}
            </div>
          )}
          {!evolutionLoading && !evolutionChain && (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-slate-700 dark:text-gray-300">
              Evolution chain unavailable.
            </div>
          )}
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">Height</p>
            <p className="text-lg font-semibold dark:text-white">
              {(pokemon.height / 10).toFixed(1)} m
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">Weight</p>
            <p className="text-lg font-semibold dark:text-white">
              {(pokemon.weight / 10).toFixed(1)} kg
            </p>
          </div>
        </div>

        {/* Base Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-3 dark:text-white">Base Stats</h3>
          <div className="space-y-2">
            {pokemon.stats.map((stat) => {
              const percentage = (stat.base_stat / 150) * 100
              return (
                <div key={stat.stat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {stat.stat.name}
                    </span>
                    <span className="font-semibold dark:text-gray-300">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
