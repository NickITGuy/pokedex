import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

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
  pokemon: any;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

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
