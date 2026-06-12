const API_BASE = "https://pokeapi.co/api/v2/";

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  height: number;
  weight: number;
  stats: Array<{
    stat: {
      name: string;
    };
    base_stat: number;
  }>;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface EvolutionNode {
  id: number;
  name: string;
  evolvesTo: EvolutionNode[];
}

interface PokemonSpeciesResponse {
  evolution_chain: {
    url: string;
  };
  flavor_text_entries?: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

function getPokemonIdFromSpeciesUrl(url: string): number {
  const match = url.match(/\/pokemon-species\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function mapEvolutionLink(link: EvolutionChainLink): EvolutionNode {
  return {
    id: getPokemonIdFromSpeciesUrl(link.species.url),
    name: link.species.name,
    evolvesTo: link.evolves_to.map(mapEvolutionLink),
  };
}

export async function searchPokemon(query: string): Promise<Pokemon | null> {
  if (!query.trim()) return null;

  try {
    const response = await fetch(
      `${API_BASE}pokemon/${query.toLowerCase().trim()}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch pokemon:", error);
    return null;
  }
}

export async function getPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse | null> {
  try {
    const response = await fetch(
      `${API_BASE}pokemon?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch pokemon list:", error);
    return null;
  }
}

export async function getPokemonDetails(
  nameOrId: string
): Promise<Pokemon | null> {
  try {
    const response = await fetch(
      `${API_BASE}pokemon/${nameOrId.toLowerCase()}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch pokemon details:", error);
    return null;
  }
}

export async function getPokemonEvolutionChain(
  nameOrId: string | number
): Promise<EvolutionNode | null> {
  try {
    const speciesResponse = await fetch(`${API_BASE}/pokemon-species/${nameOrId}`);
    if (!speciesResponse.ok) return null;

    const species: PokemonSpeciesResponse = await speciesResponse.json();
    const chainResponse = await fetch(species.evolution_chain.url);
    if (!chainResponse.ok) return null;

    const chain: EvolutionChainResponse = await chainResponse.json();
    return mapEvolutionLink(chain.chain);
  } catch (error) {
    console.error("Failed to fetch pokemon evolution chain:", error);
    return null;
  }
}

export async function getPokemonFlavorText(
  nameOrId: string | number
): Promise<string | null> {
  try {
    const speciesResponse = await fetch(`${API_BASE}pokemon-species/${nameOrId}`);
    if (!speciesResponse.ok) return null;

    const species: PokemonSpeciesResponse = await speciesResponse.json();
    const englishEntry = species.flavor_text_entries?.find(
      (entry) => entry.language.name === "en"
    );

    if (!englishEntry?.flavor_text) return null;

    return englishEntry.flavor_text.replace(/[\n\f]/g, " ").trim();
  } catch (error) {
    console.error("Failed to fetch pokemon flavor text:", error);
    return null;
  }
}

export function getTypeColor(type: string): string {
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
