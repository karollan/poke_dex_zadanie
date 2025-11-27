// API Response types
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonTypeResponse {
  id: number
  name: string
  pokemon: TypePokemonSlot[]
}

export interface TypePokemonSlot {
  pokemon: PokemonListItem
  slot: number
}

export interface PokemonDetailResponse {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  species: {
    name: string
    url: string
  }
  location_area_encounters: string
}

export interface PokemonSprites {
  front_default: string | null
  back_default: string | null
  front_shiny: string | null
  back_shiny: string | null
  front_female: string | null
  back_female: string | null
  front_shiny_female: string | null
  back_shiny_female: string | null
  other?: {
    dream_world?: {
      front_default: string | null
      front_female: string | null
    }
    home?: {
      front_default: string | null
      front_female: string | null
      front_shiny: string | null
      front_shiny_female: string | null
    }
    'official-artwork'?: {
      front_default: string | null
      front_shiny: string | null
    }
  }
}

export interface PokemonTypeSlot {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonSpeciesResponse {
  id: number
  name: string
  evolution_chain: {
    url: string
  }
  flavor_text_entries: FlavorTextEntry[]
  genera: Genus[]
}

export interface FlavorTextEntry {
  flavor_text: string
  language: {
    name: string
    url: string
  }
  version: {
    name: string
    url: string
  }
}

export interface Genus {
  genus: string
  language: {
    name: string
    url: string
  }
}

export interface EvolutionChainResponse {
  id: number
  chain: EvolutionChainLink
}

export interface EvolutionChainLink {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChainLink[]
  evolution_details: EvolutionDetail[]
}

export interface EvolutionDetail {
  min_level: number | null
  trigger: {
    name: string
    url: string
  }
  item: {
    name: string
    url: string
  } | null
}

export interface LocationAreaEncounter {
  location_area: {
    name: string
    url: string
  }
  version_details: VersionEncounterDetail[]
}

export interface VersionEncounterDetail {
  version: {
    name: string
    url: string
  }
  max_chance: number
  encounter_details: EncounterDetail[]
}

export interface EncounterDetail {
  min_level: number
  max_level: number
  chance: number
  method: {
    name: string
    url: string
  }
}

// App types
export interface Pokemon {
  id: number
  name: string
  sprite: string
  types: string[]
}

export interface PokemonDetails extends Pokemon {
  height: number
  weight: number
  baseExperience: number
  sprites: PokemonSprites
  stats: { name: string, value: number }[]
  abilities: { name: string, isHidden: boolean }[]
  description: string
  genus: string
}

export interface EvolutionPokemon {
  name: string
  id: number
  sprite: string
  minLevel: number | null
  trigger: string
}

