import { createFileRoute } from '@tanstack/react-router'
import { PokemonSearch } from '#/components/pokemon-search'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <PokemonSearch />
}
