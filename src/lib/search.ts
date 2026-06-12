export function fuzzyMatch(query: string, target: string): number {
  query = query.toLowerCase();
  target = target.toLowerCase();

  if (!query) return 0;
  if (target === query) return 1000;
  if (target.startsWith(query)) return 500;
  if (target.includes(query)) return 250;

  let queryIndex = 0;
  let targetIndex = 0;
  let score = 0;

  while (queryIndex < query.length && targetIndex < target.length) {
    if (query[queryIndex] === target[targetIndex]) {
      score += 1;
      queryIndex++;
    }
    targetIndex++;
  }

  return queryIndex === query.length ? score : 0;
}

export type PokemonSuggestion = {
  id: number;
  name: string;
  image: string;
  types: string[];
  score: number;
};

const pokemonCache: Map<string, PokemonSuggestion> = new Map();
let allPokemonList: Array<{ name: string; url: string }> = [];
let pokemonListFetched = false;

async function fetchAllPokemonNames(): Promise<
  Array<{ name: string; url: string }>
> {
  if (pokemonListFetched && allPokemonList.length > 0) {
    return allPokemonList;
  }

  try {
    let allResults: Array<{ name: string; url: string }> = [];
    let nextUrl: string | null =
      "https://pokeapi.co/api/v2/pokemon?limit=1000";

    while (nextUrl) {
      const response = await fetch(nextUrl);
      const data = await response.json();
      allResults = allResults.concat(data.results);
      nextUrl = data.next;
    }

    allPokemonList = allResults;
    pokemonListFetched = true;
    return allResults;
  } catch (error) {
    console.error("Failed to fetch pokemon list:", error);
    return [];
  }
}

async function fetchPokemonDetails(
  name: string
): Promise<PokemonSuggestion | null> {
  if (pokemonCache.has(name)) {
    return pokemonCache.get(name) || null;
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    const suggestion: PokemonSuggestion = {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other["official-artwork"].front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
      types: data.types.map((t: any) => t.type.name),
      score: 0,
    };

    pokemonCache.set(name, suggestion);
    return suggestion;
  } catch (error) {
    console.error(`Failed to fetch pokemon ${name}:`, error);
    return null;
  }
}

export async function searchSuggestions(
  query: string,
  limit: number = 8
): Promise<PokemonSuggestion[]> {
  if (!query.trim()) return [];

  const allPokemon = await fetchAllPokemonNames();

  const scored = allPokemon
    .map((p) => ({
      name: p.name,
      score: fuzzyMatch(query, p.name),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const suggestions = await Promise.all(
    scored.map(async (p) => {
      const details = await fetchPokemonDetails(p.name);
      return details ? { ...details, score: p.score } : null;
    })
  );

  return suggestions.filter((s) => s !== null) as PokemonSuggestion[];
}
