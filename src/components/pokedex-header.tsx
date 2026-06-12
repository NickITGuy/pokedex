import { Link } from "@tanstack/react-router";
import { DarkModeToggle } from "#/components/dark-mode-toggle";

export function PokedexHeader() {
  return (
    <div className="flex justify-between items-start mb-8">
      <Link
        to="/"
        className="flex-1 text-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg"
        aria-label="Go back to the Pokédex home page"
      >
        <h1 className="text-5xl font-bold text-red-600 dark:text-red-500 mb-2">
          Pokédex
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search for your favorite Pokémon
        </p>
      </Link>
      <DarkModeToggle />
    </div>
  );
}