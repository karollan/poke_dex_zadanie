<template>
  <v-chip-group
    v-model="selectedIndices"
    content-class="align-center justify-center ga-2 ga-sm-3"
    mobile-breakpoint="md"
    multiple
    selected-class="selected-chip"
  >
    <v-chip
      v-for="type in types"
      :key="type"
      class="type-chip"
      :style="{ backgroundColor: `rgb(var(--v-theme-${type}))`, color: `rgb(var(--v-theme-white))`, textTransform: 'capitalize', border: `2px solid rgb(var(--v-theme-${type}))` }"
      :text="type"
      :value="type"
      variant="flat"
    />
  </v-chip-group>
</template>

<script setup lang="ts">
  defineProps<{
    types: Array<string>
  }>()

  const selectedIndices = ref<Array<string>>([])
  const emit = defineEmits<{
    'selected-types-changed': [value: Array<string>]
  }>()

  watch(selectedIndices, value => {
    emit('selected-types-changed', value)
  })
</script>

<style scoped lang="scss">
:deep(.v-slide-group__content) {
  justify-content: center;
  flex-wrap: wrap;
}

.type-chip {
  transition: all 0.2s ease;
  font-size: 12px;
  height: 28px !important;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    filter: brightness(1.1);
  }

}

.selected-chip {
  border: 2px solid rgb(var(--v-theme-white)) !important;

  &:hover {
    transform: translateY(-2px) scale(1.1);
  }
}
</style>
