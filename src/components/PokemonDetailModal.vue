<template>
  <v-dialog
    max-width="800"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Loading -->
    <v-card v-if="loading" class="pa-8" rounded="xl">
      <div class="d-flex flex-column align-center justify-center" style="min-height: 300px">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        />
        <p class="mt-4 text-medium-emphasis">Loading Pokémon details...</p>
      </div>
    </v-card>

    <!-- Pokemon -->
    <v-card v-else-if="pokemon" class="pokemon-modal" rounded="xl">

      <div
        class="modal-header pa-8"
        :style="{ background: backgroundGradient }"
      >
        <v-btn
          class="close-btn"
          color="white"
          icon="mdi-close"
          variant="text"
          @click="$emit('update:modelValue', false)"
        />

        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-white text-caption opacity-70">#{{ paddedId }}</div>
            <h2 class="text-h4 font-weight-bold text-white text-capitalize">
              {{ pokemon.name }}
            </h2>
            <p class="text-white opacity-80">{{ pokemon.genus }}</p>
          </div>

          <v-img
            class="pokemon-main-sprite"
            contain
            height="150"
            :src="pokemon.sprite"
            width="150"
          />
        </div>

        <div class="d-flex ga-2 mt-2">
          <v-chip
            v-for="type in pokemon.types"
            :key="type"
            class="text-white text-capitalize"
            :style="{ backgroundColor: 'rgba(255,255,255,0.25)' }"
            variant="flat"
          >
            {{ type }}
          </v-chip>
        </div>
      </div>

      <v-card-text class="pa-0">
        <v-tabs v-model="activeTab" bg-color="surface">
          <v-tab value="about">About</v-tab>
          <v-tab value="stats">Stats</v-tab>
          <v-tab value="sprites">Sprites</v-tab>
          <v-tab value="evolution">Evolution</v-tab>
          <v-tab value="locations">Locations</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab" class="pa-6">
          <!-- About -->
          <v-tabs-window-item value="about">
            <p class="mb-4">{{ pokemon.description }}</p>

            <v-row>
              <v-col cols="6">
                <div class="info-item">
                  <span class="text-medium-emphasis">Height</span>
                  <span class="font-weight-bold">{{ (pokemon.height / 10).toFixed(1) }} m</span>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="info-item">
                  <span class="text-medium-emphasis">Weight</span>
                  <span class="font-weight-bold">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="info-item">
                  <span class="text-medium-emphasis">Base Experience</span>
                  <span class="font-weight-bold">{{ pokemon.baseExperience }}</span>
                </div>
              </v-col>
            </v-row>

            <!-- Abilities -->
            <h4 class="mt-4 mb-2">Abilities</h4>
            <div class="d-flex ga-2 flex-wrap">
              <v-chip
                v-for="ability in pokemon.abilities"
                :key="ability.name"
                class="text-capitalize"
                color="primary"
                :variant="ability.isHidden ? 'outlined' : 'tonal'"
              >
                {{ ability.name.replace('-', ' ') }}
                <v-tooltip v-if="ability.isHidden" activator="parent" location="top">
                  Hidden Ability
                </v-tooltip>
              </v-chip>
            </div>
          </v-tabs-window-item>

          <!-- Stats -->
          <v-tabs-window-item value="stats">
            <div v-for="stat in pokemon.stats" :key="stat.name" class="mb-3">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-capitalize">{{ formatStatName(stat.name) }}</span>
                <span class="font-weight-bold">{{ stat.value }}</span>
              </div>
              <v-progress-linear
                :color="getStatColor(stat.value)"
                height="8"
                :model-value="(stat.value / 255) * 100"
                rounded
              />
            </div>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between">
              <span class="font-weight-bold">Total</span>
              <span class="font-weight-bold">{{ totalStats }}</span>
            </div>
          </v-tabs-window-item>

          <!-- Sprites -->
          <v-tabs-window-item value="sprites">
            <v-row>
              <v-col
                v-for="(sprite, key) in filteredSprites"
                :key="key"
                cols="6"
                md="3"
                sm="4"
              >
                <v-card class="pa-2 text-center" variant="outlined">
                  <v-img
                    contain
                    height="96"
                    :src="sprite"
                  />
                  <p class="text-caption text-capitalize mt-1">
                    {{ formatSpriteName(key) }}
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <!-- Evolution -->
          <v-tabs-window-item value="evolution">
            <div v-if="evolutions.length > 0" class="d-flex align-center justify-center flex-wrap ga-4">
              <template v-for="(evo, index) in evolutions" :key="evo.id">
                <div class="text-center evolution-item">
                  <v-avatar color="surface-variant" size="80">
                    <v-img v-if="evo.sprite" :src="evo.sprite" />
                    <v-icon v-else size="40">mdi-pokeball</v-icon>
                  </v-avatar>
                  <p class="text-capitalize font-weight-medium mt-2">{{ evo.name }}</p>
                  <p v-if="evo.minLevel" class="text-caption text-medium-emphasis">
                    Lv. {{ evo.minLevel }}
                  </p>
                </div>

                <v-icon
                  v-if="index < evolutions.length - 1"
                  color="primary"
                  size="32"
                >
                  mdi-arrow-right
                </v-icon>
              </template>
            </div>
            <p v-else class="text-center text-medium-emphasis">
              This Pokémon does not evolve.
            </p>
          </v-tabs-window-item>

          <!-- Locations -->
          <v-tabs-window-item value="locations">
            <v-list v-if="locations.length > 0" density="compact" lines="one">
              <v-list-item
                v-for="location in locations"
                :key="location"
                class="text-capitalize"
                prepend-icon="mdi-map-marker"
                :title="location"
              />
            </v-list>
            <p v-else class="text-center text-medium-emphasis">
              No location data available for this Pokémon.
            </p>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { EvolutionPokemon, PokemonDetails } from '@/types/Pokemon'

  const props = defineProps<{
    modelValue: boolean
    pokemon: PokemonDetails | null
    evolutions: EvolutionPokemon[]
    locations: string[]
    loading: boolean
  }>()

  defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const activeTab = ref('about')

  const paddedId = computed(() =>
    props.pokemon ? String(props.pokemon.id).padStart(3, '0') : '000',
  )

  const backgroundGradient = computed(() => {
    if (!props.pokemon) {
      return ''
    }
    const types = props.pokemon.types
    if (types.length === 1) {
      return `rgb(var(--v-theme-${types[0]}))`
    }
    return `linear-gradient(to right, rgb(var(--v-theme-${types[0]})) 0%, rgb(var(--v-theme-${types[1]})) 100%)`
  })

  const totalStats = computed(() =>
    props.pokemon?.stats.reduce((sum, stat) => sum + stat.value, 0) || 0,
  )

  const filteredSprites = computed(() => {
    if (!props.pokemon) {
      return {}
    }

    const sprites: Record<string, string> = {}
    const rawSprites = props.pokemon.sprites

    if (rawSprites.front_default) sprites.front = rawSprites.front_default
    if (rawSprites.back_default) sprites.back = rawSprites.back_default
    if (rawSprites.front_shiny) sprites['front shiny'] = rawSprites.front_shiny
    if (rawSprites.back_shiny) sprites['back shiny'] = rawSprites.back_shiny
    if (rawSprites.front_female) sprites['front female'] = rawSprites.front_female
    if (rawSprites.back_female) sprites['back female'] = rawSprites.back_female

    if (rawSprites.other?.['official-artwork']?.front_default) {
      sprites['official artwork'] = rawSprites.other['official-artwork'].front_default
    }
    if (rawSprites.other?.['official-artwork']?.front_shiny) {
      sprites['official shiny'] = rawSprites.other['official-artwork'].front_shiny
    }
    if (rawSprites.other?.home?.front_default) {
      sprites.home = rawSprites.other.home.front_default
    }
    if (rawSprites.other?.dream_world?.front_default) {
      sprites['dream world'] = rawSprites.other.dream_world.front_default
    }

    return sprites
  })

  function formatStatName (name: string): string {
    const statNames: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      'speed': 'Speed',
    }
    return statNames[name] || name
  }

  function formatSpriteName (name: string): string {
    return name.replace(/_/g, ' ')
  }

  function getStatColor (value: number): string {
    if (value < 50) {
      return 'error'
    }
    if (value < 80) {
      return 'warning'
    }
    if (value < 100) {
      return 'success'
    }
    return 'primary'
  }
</script>

<style scoped lang="scss">
.pokemon-modal {
  overflow: hidden;
}

.modal-header {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.pokemon-main-sprite {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.evolution-item {
  min-width: 100px;
}
</style>
