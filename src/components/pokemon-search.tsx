import { useState, useEffect, useRef } from "react";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { PokemonCard } from "#/components/pokemon-card";
import { DarkModeToggle } from "#/components/dark-mode-toggle";
import { PopularPokemonGrid } from "#/components/popular-pokemon-grid";
import { SearchSuggestions } from "#/components/search-suggestions";
import { searchSuggestions } from "#/lib/search";
import type { PokemonSuggestion } from "#/lib/search";

const API_BASE = "https://pokeapi.co/api/v2";

async function searchPokemon(query: string) {
  if (!query.trim()) return null;

  try {
    const response = await fetch(
      `${API_BASE}/pokemon/${query.toLowerCase().trim()}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch pokemon:", error);
    return null;
  }
}

export function PokemonSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedSuggestionRef = useRef<string | null>(null);

  // Fetch suggestions as user types
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      selectedSuggestionRef.current = null;
      return;
    }

    if (selectedSuggestionRef.current === searchQuery) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      const results = await searchSuggestions(searchQuery, 8);
      setSuggestions(results);
      setSuggestionsLoading(false);
      setShowSuggestions(true);
    }, 300); // Debounce for 300ms
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setPokemon(null);
    setShowSuggestions(false);

    const result = await searchPokemon(searchQuery);
    setLoading(false);

    if (result) {
      setPokemon(result);
    } else {
      setError(`Pokémon "${searchQuery}" not found. Try another name or ID!`);
    }
  };

  const handlePokemonSelect = (name: string) => {
    selectedSuggestionRef.current = name;
    setSearchQuery(name);
    setSuggestions([]);
    setSuggestionsLoading(false);
    setShowSuggestions(false);
    searchPokemon(name).then((result) => {
      if (result) {
        setPokemon(result);
      } else {
        setError(`Pokémon "${name}" not found!`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Toggle */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1 text-center">
            <h1 className="text-5xl font-bold text-red-600 dark:text-red-500 mb-2">Pokédex</h1>
            <p className="text-gray-600 dark:text-gray-400">Search for your favorite Pokémon</p>
          </div>
          <DarkModeToggle />
        </div>

        {/* Search Form with Suggestions */}
        <div className="max-w-md mx-auto mb-8 relative">
          <form onSubmit={handleSearch} className="">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Pokémon name or ID..."
                value={searchQuery}
                onChange={(e) => {
                  selectedSuggestionRef.current = null;
                  setSearchQuery(e.target.value);
                }}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
          {showSuggestions && (
            <SearchSuggestions
              suggestions={suggestions}
              isLoading={suggestionsLoading}
              onSelect={handlePokemonSelect}
            />
          )}
        </div>

        {/* Prompt Message - Show when no search results */}
        {!pokemon && !loading && !error && (
          <div className="text-center py-4 mb-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg">
              👀 Start searching to see Pokémon details
            </p>
          </div>
        )}

        {/* Popular Pokemon Grid - Only show when no search results */}
        {!pokemon && !loading && !error && (
          <PopularPokemonGrid onPokemonSelect={handlePokemonSelect} />
        )}

        {/* Results */}
        <div className="flex justify-center">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md w-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-4 text-center">
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Try searching by name (e.g., "pikachu") or by ID (e.g., "25")
              </p>
            </div>
          )}

          {pokemon && !loading && <PokemonCard pokemon={pokemon} />}
        </div>
      </div>
    </div>
  )
}
