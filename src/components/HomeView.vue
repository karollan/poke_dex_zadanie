<template>
  <v-container class="py-8" max-width="1600">
    <!-- Header -->
    <div class="mb-6 d-flex flex-row align-center justify-center ga-3">
      <v-img
        height="48"
        max-width="48"
        src="/logo.png"
        width="48"
      />
      <div class="text-h4 font-weight-bold text-title">
        Pokémon Explorer
      </div>
    </div>

    <!-- Search -->
    <div class="d-flex justify-center mb-4">
      <v-text-field
        v-model="searchQuery"
        bg-color="background"
        clearable
        density="compact"
        hide-details
        max-width="500"
        placeholder="Search Pokémon..."
        prepend-inner-icon="mdi-magnify"
        rounded
        variant="outlined"
        @update:model-value="debouncedSearch"
      />
    </div>

    <!-- Type filters -->
    <PokemonTypeChipFilter
      class="mb-8"
      :types="pokemonTypes"
      @selected-types-changed="handleSelectedTypesChanged"
    />

    <!-- Loading -->
    <div v-if="pokemonStore.loading" class="d-flex flex-column align-center py-12">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
      <p class="mt-4 text-medium-emphasis">Loading Pokémon...</p>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="pokemonStore.error"
      class="mb-4"
      closable
      type="error"
    >
      {{ pokemonStore.error }}
      <template #append>
        <v-btn
          variant="text"
          @click="pokemonStore.loadPokemons()"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Grid -->
    <template v-else>
      <v-row v-if="pokemonStore.pokemons.length > 0">
        <v-col
          v-for="pokemon in pokemonStore.pokemons"
          :key="pokemon.id"
          cols="12"
          lg="4"
          md="4"
          sm="6"
        >
          <PokemonCard
            :pokemon="pokemon"
            @click="handlePokemonClick"
          />
        </v-col>
      </v-row>

      <div
        v-else
        class="d-flex flex-column align-center py-12"
      >
        <v-icon color="medium-emphasis" size="64">mdi-pokeball</v-icon>
        <p class="mt-4 text-medium-emphasis">No Pokémon found</p>
        <p class="text-caption text-medium-emphasis">Try adjusting your search or filters</p>
      </div>

      <div class="d-flex justify-center mt-8 mb-4">
        <v-btn
          v-if="pokemonStore.hasNextPage && pokemonStore.pokemons.length > 0"
          color="primary"
          :loading="pokemonStore.loadingMore"
          size="large"
          @click="pokemonStore.loadMore()"
        >
          <v-icon start>mdi-plus</v-icon>
          Load More
        </v-btn>

        <v-chip
          v-else-if="pokemonStore.allPokemonsLoaded"
          color="success"
          variant="tonal"
        >
          <v-icon start>mdi-check-circle</v-icon>
          All Pokémon loaded ({{ pokemonStore.displayedPokemonCount }})
        </v-chip>
      </div>
    </template>

    <!-- Modal -->
    <PokemonDetailModal
      v-model="pokemonStore.modalOpen"
      :evolutions="pokemonStore.selectedPokemonEvolutions"
      :loading="pokemonStore.modalLoading"
      :locations="pokemonStore.selectedPokemonLocations"
      :pokemon="pokemonStore.selectedPokemon"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { useDebounceFn } from '@vueuse/core'
  import { usePokemonStore } from '@/stores/pokemon'

  const pokemonStore = usePokemonStore()

  const searchQuery = ref('')

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
  ]

  // Initialize store on mount
  onMounted(async () => {
    await pokemonStore.initialize()
    await pokemonStore.loadPokemons()
  })

  // Debounced search
  const debouncedSearch = useDebounceFn((query: string | null) => {
    pokemonStore.setSearchQuery(query || '')
  }, 500)

  // Handle type filter change
  function handleSelectedTypesChanged (selectedTypes: string[]) {
    pokemonStore.setSelectedTypes(selectedTypes)
  }

  // Handle pokemon card click
  function handlePokemonClick (pokemonId: number) {
    pokemonStore.openPokemonModal(pokemonId)
  }
</script>
