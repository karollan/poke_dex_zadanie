import type {
  EvolutionChainResponse,
  EvolutionPokemon,
  LocationAreaEncounter,
  Pokemon,
  PokemonDetailResponse,
  PokemonDetails,
  PokemonListResponse,
  PokemonSpeciesResponse,
  PokemonTypeResponse,
} from '@/types/Pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchPokemonList (limit = 20, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error('Failed to fetch pokemon list')
  }
  return response.json()
}

export async function fetchPokemonDetail (nameOrId: string | number): Promise<PokemonDetailResponse> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon: ${nameOrId}`)
  }
  return response.json()
}

export async function fetchPokemonByType (type: string): Promise<PokemonTypeResponse> {
  const response = await fetch(`${BASE_URL}/type/${type}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch type: ${type}`)
  }
  return response.json()
}

export async function fetchPokemonSpecies (nameOrId: string | number): Promise<PokemonSpeciesResponse> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch species: ${nameOrId}`)
  }
  return response.json()
}

export async function fetchEvolutionChain (url: string): Promise<EvolutionChainResponse> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch evolution chain')
  }
  return response.json()
}

export async function fetchLocationEncounters (pokemonId: number): Promise<LocationAreaEncounter[]> {
  const response = await fetch(`${BASE_URL}/pokemon/${pokemonId}/encounters`)
  if (!response.ok) {
    throw new Error('Failed to fetch location encounters')
  }
  return response.json()
}

// get ID from URL
export function getPokemonIdFromUrl (url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//)
  return matches?.[1] ? Number.parseInt(matches[1], 10) : 0
}

export function getSpeciesIdFromUrl (url: string): number {
  const matches = url.match(/\/pokemon-species\/(\d+)\//)
  return matches?.[1] ? Number.parseInt(matches[1], 10) : 0
}

// response to Pokemon object
export async function fetchAndTransformPokemon (nameOrId: string | number): Promise<Pokemon> {
  const detail = await fetchPokemonDetail(nameOrId)
  return {
    id: detail.id,
    name: detail.name,
    sprite: detail.sprites.other?.['official-artwork']?.front_default
      || detail.sprites.front_default
      || '',
    types: detail.types.map(t => t.type.name),
  }
}

// fetch multiple pokemon details
export async function fetchPokemonBatch (names: string[]): Promise<Pokemon[]> {
  const promises = names.map(name => fetchAndTransformPokemon(name))
  const results = await Promise.allSettled(promises)
  return results
    .filter((r): r is PromiseFulfilledResult<Pokemon> => r.status === 'fulfilled')
    .map(r => r.value)
}

// fetch pokemon by multiple types
export async function fetchPokemonByTypes (types: string[]): Promise<Set<string>> {
  if (types.length === 0) {
    return new Set()
  }

  const typePromises = types.map(type => fetchPokemonByType(type))
  const typeResults = await Promise.all(typePromises)

  // get pokemon names for each type
  const pokemonSets = typeResults.map(
    result => new Set(result.pokemon.map(p => p.pokemon.name)),
  )

  // pokemon that have ANY of the selected types
  const unionSet = new Set<string>()
  for (const set of pokemonSets) {
    for (const name of set) {
      unionSet.add(name)
    }
  }

  return unionSet
}

// full pokemon details for modal
export async function fetchFullPokemonDetails (nameOrId: string | number): Promise<PokemonDetails> {
  const [detail, species] = await Promise.all([
    fetchPokemonDetail(nameOrId),
    fetchPokemonSpecies(nameOrId),
  ])

  const englishDescription = species.flavor_text_entries.find(
    entry => entry.language.name === 'en',
  )?.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') || ''

  const englishGenus = species.genera.find(
    g => g.language.name === 'en',
  )?.genus || ''

  return {
    id: detail.id,
    name: detail.name,
    sprite: detail.sprites.other?.['official-artwork']?.front_default
      || detail.sprites.front_default
      || '',
    types: detail.types.map(t => t.type.name),
    height: detail.height,
    weight: detail.weight,
    baseExperience: detail.base_experience,
    sprites: detail.sprites,
    stats: detail.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    abilities: detail.abilities.map(a => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    description: englishDescription,
    genus: englishGenus,
  }
}

// evolution chain
export async function fetchEvolutions (nameOrId: string | number): Promise<EvolutionPokemon[]> {
  const species = await fetchPokemonSpecies(nameOrId)
  const evolutionChain = await fetchEvolutionChain(species.evolution_chain.url)

  const evolutions: EvolutionPokemon[] = []

  async function processChain (chain: EvolutionChainResponse['chain']): Promise<void> {
    const speciesId = getSpeciesIdFromUrl(chain.species.url)

    try {
      const pokemonDetail = await fetchPokemonDetail(speciesId)
      evolutions.push({
        name: chain.species.name,
        id: speciesId,
        sprite: pokemonDetail.sprites.other?.['official-artwork']?.front_default
          || pokemonDetail.sprites.front_default
          || '',
        minLevel: chain.evolution_details[0]?.min_level || null,
        trigger: chain.evolution_details[0]?.trigger?.name || 'base',
      })
    } catch {
      // pokemon might not exist
      evolutions.push({
        name: chain.species.name,
        id: speciesId,
        sprite: '',
        minLevel: chain.evolution_details[0]?.min_level || null,
        trigger: chain.evolution_details[0]?.trigger?.name || 'base',
      })
    }

    for (const evolution of chain.evolves_to) {
      await processChain(evolution)
    }
  }

  await processChain(evolutionChain.chain)
  return evolutions
}

// locations
export async function fetchPokemonLocations (pokemonId: number): Promise<string[]> {
  const encounters = await fetchLocationEncounters(pokemonId)
  return encounters.map(e =>
    e.location_area.name.replace(/-/g, ' '),
  )
}
