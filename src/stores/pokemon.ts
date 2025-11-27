import type { EvolutionPokemon, Pokemon, PokemonDetails } from '@/types/Pokemon'
import { defineStore } from 'pinia'
import {
  fetchEvolutions,
  fetchFullPokemonDetails,
  fetchPokemonBatch,
  fetchPokemonByTypes,
  fetchPokemonList,
  fetchPokemonLocations,
} from '@/services/pokemon.service'

interface PokemonState {
  // pokemon list
  pokemons: Pokemon[]
  allPokemonNames: string[]

  // pagination info
  currentPage: number
  itemsPerPage: number
  totalCount: number
  hasNextPage: boolean

  // filters
  selectedTypes: string[]
  searchQuery: string

  // filtered pokemon names
  filteredPokemonNames: string[]

  // loading states
  loading: boolean
  loadingMore: boolean
  error: string | null

  // modal
  selectedPokemon: PokemonDetails | null
  selectedPokemonEvolutions: EvolutionPokemon[]
  selectedPokemonLocations: string[]
  modalLoading: boolean
  modalOpen: boolean
}

export const usePokemonStore = defineStore('pokemon', {
  state: (): PokemonState => ({
    pokemons: [],
    allPokemonNames: [],
    currentPage: 1,
    itemsPerPage: 18,
    totalCount: 0,
    hasNextPage: true,
    selectedTypes: [],
    searchQuery: '',
    filteredPokemonNames: [],
    loading: false,
    loadingMore: false,
    error: null,
    selectedPokemon: null,
    selectedPokemonEvolutions: [],
    selectedPokemonLocations: [],
    modalLoading: false,
    modalOpen: false,
  }),

  getters: {
    displayedPokemonCount: state => state.pokemons.length,
    allPokemonsLoaded: state => !state.hasNextPage && state.pokemons.length > 0,
  },

  actions: {
    // fetch all pokemon names for search
    async initialize () {
      try {
        const response = await fetchPokemonList(100_000, 0)
        this.allPokemonNames = response.results.map(p => p.name)
        this.totalCount = response.count
      } catch (error) {
        console.error('Failed to initialize pokemon names:', error)
      }
    },

    // load initial pokemon or after filter change
    async loadPokemons () {
      this.loading = true
      this.error = null
      this.pokemons = []
      this.currentPage = 1

      try {
        let namesToFetch: string[]

        if (this.selectedTypes.length > 0 || this.searchQuery) {
          // apply filters
          namesToFetch = await this.getFilteredPokemonNames()
          this.filteredPokemonNames = namesToFetch
          this.totalCount = namesToFetch.length
        } else {
          // no filters -> paginated endpoint
          const response = await fetchPokemonList(this.itemsPerPage, 0)
          namesToFetch = response.results.map(p => p.name)
          this.totalCount = response.count
          this.filteredPokemonNames = []
        }

        // details for first page
        const pageNames = namesToFetch.slice(0, this.itemsPerPage)
        const pokemons = await fetchPokemonBatch(pageNames)

        this.pokemons = pokemons.toSorted((a: Pokemon, b: Pokemon) => a.id - b.id)
        this.hasNextPage = this.pokemons.length < this.totalCount
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load Pokemon'
        console.error('Error loading pokemons:', error)
      } finally {
        this.loading = false
      }
    },

    // load more pokemon (pagination)
    async loadMore () {
      if (this.loadingMore || !this.hasNextPage) {
        return
      }

      this.loadingMore = true
      this.error = null
      this.currentPage++

      try {
        const offset = (this.currentPage - 1) * this.itemsPerPage
        let namesToFetch: string[]

        if (this.filteredPokemonNames.length > 0) {
          // using filtered list
          namesToFetch = this.filteredPokemonNames.slice(offset, offset + this.itemsPerPage)
        } else {
          // no filters -> fetch from API
          const response = await fetchPokemonList(this.itemsPerPage, offset)
          namesToFetch = response.results.map(p => p.name)
        }

        if (namesToFetch.length === 0) {
          this.hasNextPage = false
          return
        }

        const newPokemons = await fetchPokemonBatch(namesToFetch)
        this.pokemons = [...this.pokemons, ...newPokemons].toSorted((a: Pokemon, b: Pokemon) => a.id - b.id)
        this.hasNextPage = this.pokemons.length < this.totalCount
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load more Pokemon'
        console.error('Error loading more pokemons:', error)
        this.currentPage-- // revert page on error
      } finally {
        this.loadingMore = false
      }
    },

    // filtered pokemon names based on types and search
    async getFilteredPokemonNames (): Promise<string[]> {
      let names: string[] = [...this.allPokemonNames]

      // filter by types
      if (this.selectedTypes.length > 0) {
        const typeFilteredNames = await fetchPokemonByTypes(this.selectedTypes)
        names = names.filter(name => typeFilteredNames.has(name))
      }

      // filter by search query
      if (this.searchQuery) {
        const lowerQuery = this.searchQuery.toLowerCase()
        names = names.filter(name => name.toLowerCase().includes(lowerQuery))
      }

      return names
    },

    // set type filters
    async setSelectedTypes (types: string[]) {
      this.selectedTypes = types
      await this.loadPokemons()
    },

    // set search query
    async setSearchQuery (query: string) {
      this.searchQuery = query
      await this.loadPokemons()
    },

    // open pokemon detail modal
    async openPokemonModal (pokemonId: number) {
      this.modalOpen = true
      this.modalLoading = true
      this.selectedPokemon = null
      this.selectedPokemonEvolutions = []
      this.selectedPokemonLocations = []

      try {
        const [details, evolutions, locations] = await Promise.all([
          fetchFullPokemonDetails(pokemonId),
          fetchEvolutions(pokemonId),
          fetchPokemonLocations(pokemonId).catch(() => []), // locations might not exist
        ])

        this.selectedPokemon = details
        this.selectedPokemonEvolutions = evolutions
        this.selectedPokemonLocations = locations
      } catch (error) {
        console.error('Error loading pokemon details:', error)
        this.error = 'Failed to load Pokemon details'
      } finally {
        this.modalLoading = false
      }
    },

    // close modal
    closeModal () {
      this.modalOpen = false
      this.selectedPokemon = null
      this.selectedPokemonEvolutions = []
      this.selectedPokemonLocations = []
    },
  },
})
