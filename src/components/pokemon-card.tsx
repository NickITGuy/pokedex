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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="capitalize flex items-center justify-between">
          <span>{pokemon.name}</span>
          <span className="text-sm font-normal text-gray-500">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image */}
        <div className="flex justify-center bg-gray-50 rounded-lg p-4">
          <img
            src={imageUrl}
            alt={pokemon.name}
            className="h-48 w-48 object-contain"
          />
        </div>

        {/* Types */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Types</h3>
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
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600">Height</p>
            <p className="text-lg font-semibold">
              {(pokemon.height / 10).toFixed(1)} m
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600">Weight</p>
            <p className="text-lg font-semibold">
              {(pokemon.weight / 10).toFixed(1)} kg
            </p>
          </div>
        </div>

        {/* Base Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Base Stats</h3>
          <div className="space-y-2">
            {pokemon.stats.map((stat) => {
              const percentage = (stat.base_stat / 150) * 100
              return (
                <div key={stat.stat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-gray-700">
                      {stat.stat.name}
                    </span>
                    <span className="font-semibold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
