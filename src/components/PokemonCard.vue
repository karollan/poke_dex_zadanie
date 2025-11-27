<template>
  <v-card
    class="pokemon-card"
    elevation="4"
    rounded="xl"
    :style="{ background: backgroundGradient }"
    @click="$emit('click', pokemon.id)"
  >
    <div class="d-flex justify-center pt-4">
      <v-img
        :alt="pokemon.name"
        class="pokemon-sprite"
        contain
        height="120"
        :src="pokemon.sprite"
        width="120"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="white"
              indeterminate
              size="40"
            />
          </div>
        </template>
      </v-img>
    </div>

    <v-card-text class="text-center pb-2">
      <h3 class="text-h6 font-weight-bold text-white text-capitalize mb-2">
        {{ pokemon.name }}
      </h3>
      <div class="text-white mb-2">#{{ paddedId }}</div>

      <div class="d-flex justify-center ga-2 flex-wrap">
        <v-chip
          v-for="type in pokemon.types"
          :key="type"
          class="text-white text-capitalize mb-2"
          size="small"
          :style="{ backgroundColor: `rgb(var(--v-theme-${type}))` }"
          variant="flat"
        >
          {{ type }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { Pokemon } from '@/types/Pokemon'

  const props = defineProps<{
    pokemon: Pokemon
  }>()

  defineEmits<{
    click: [id: number]
  }>()

  const paddedId = computed(() =>
    String(props.pokemon.id).padStart(3, '0'),
  )

  const backgroundGradient = computed(() => {
    const types = props.pokemon.types
    if (types.length === 1) {
      return `rgb(var(--v-theme-${types[0]}))`
    }
    return `linear-gradient(to right, rgb(var(--v-theme-${types[0]})) 0%, rgb(var(--v-theme-${types[1]})) 100%)`
  })
</script>

<style scoped lang="scss">
.pokemon-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  min-height: 220px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3) !important;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
}

.pokemon-sprite {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;

  .pokemon-card:hover & {
    transform: scale(1.1);
  }
}
</style>
