import { useState } from "react";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { PokemonCard } from "#/components/pokemon-card";

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
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setPokemon(null)

    const result = await searchPokemon(searchQuery)
    setLoading(false)

    if (result) {
      setPokemon(result)
    } else {
      setError(`Pokémon "${searchQuery}" not found. Try another name or ID!`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-2">Pokédex</h1>
          <p className="text-gray-600">Search for your favorite Pokémon</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Pokémon name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {/* Results */}
        <div className="flex justify-center">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Try searching by name (e.g., "pikachu") or by ID (e.g., "25")
              </p>
            </div>
          )}

          {pokemon && !loading && <PokemonCard pokemon={pokemon} />}

          {!pokemon && !loading && !error && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">
                👀 Start searching to see Pokémon details
              </p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        {!pokemon && !loading && !error && (
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-center mb-6">
              Popular Pokémon
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {[
                'pikachu',
                'charizard',
                'blastoise',
                'venusaur',
                'alakazam',
                'arcanine',
              ].map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  onClick={() => {
                    setSearchQuery(name)
                    searchPokemon(name).then((result) => {
                      if (result) setPokemon(result)
                    })
                  }}
                  className="capitalize text-sm"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
