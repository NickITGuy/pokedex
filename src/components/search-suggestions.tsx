import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import type { PokemonSuggestion } from "#/lib/search";

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

interface SearchSuggestionsProps {
  suggestions: PokemonSuggestion[];
  isLoading: boolean;
  onSelect: (name: string) => void;
}

export function SearchSuggestions({
  suggestions,
  isLoading,
  onSelect,
}: SearchSuggestionsProps) {
  if (!suggestions.length && !isLoading) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
      {isLoading && suggestions.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 dark:border-red-500"></div>
          <p className="mt-2 text-sm">Searching...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="max-h-96 overflow-y-auto">
          {suggestions.map((pokemon) => (
            <button
              key={pokemon.name}
              onClick={() => onSelect(pokemon.name)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors flex items-center gap-3"
            >
              <div className="h-12 w-12 flex-shrink-0 bg-gray-50 dark:bg-slate-700 rounded flex items-center justify-center">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium capitalize text-gray-900 dark:text-white">
                  {pokemon.name}
                </p>
                <div className="flex gap-1 flex-wrap mt-1">
                  {pokemon.types.map((type) => (
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
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                #{pokemon.id.toString().padStart(3, "0")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
