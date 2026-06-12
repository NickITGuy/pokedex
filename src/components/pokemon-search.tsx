import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { PopularPokemonGrid } from "#/components/popular-pokemon-grid";
import { SearchSuggestions } from "#/components/search-suggestions";
import { PokedexHeader } from "#/components/pokedex-header";
import { searchSuggestions } from "#/lib/search";
import type { PokemonSuggestion } from "#/lib/search";

export function PokemonSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
    const pokemon = searchQuery.trim().toLowerCase();
    if (!pokemon) return;

    setShowSuggestions(false);
    navigate({
      to: "/pokemon/$pokemon",
      params: { pokemon },
    });
  };

  const handleRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    setShowSuggestions(false);
    navigate({
      to: "/pokemon/$pokemon",
      params: { pokemon: String(randomId) },
    });
  };

  const handlePokemonSelect = (name: string) => {
    selectedSuggestionRef.current = name;
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchQuery(name);
    navigate({
      to: "/pokemon/$pokemon",
      params: { pokemon: name.toLowerCase() },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <PokedexHeader />

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
              <Button type="submit">
                Search
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={handleRandomPokemon}
            >
              🎲 Random Pokémon
            </Button>
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
        <div className="text-center py-4 mb-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg">👀 Start searching to see Pokémon details</p>
        </div>

        {/* Popular Pokemon Grid */}
        <PopularPokemonGrid onPokemonSelect={handlePokemonSelect} />
      </div>
    </div>
  )
}
