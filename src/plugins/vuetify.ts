/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles

// Composables
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'pokemonThemeDark',
    themes: {
      pokemonThemeDark: {
        dark: true,
        colors: {
          primary: '#2563EB',
          title: '#FF8500',
          white: '#fff',
          secondary: '#37474F',
          accent: '#FFB300',
          background: '#121212',
          surface: '#0E0E0E',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          error: '#D32F2F',
          normal: '#A8A77A',
          fire: '#EE8130',
          water: '#6390F0',
          electric: '#F7D02C',
          grass: '#7AC74C',
          ice: '#96D9D6',
          fighting: '#C22E28',
          poison: '#A33EA1',
          ground: '#E2BF65',
          flying: '#A98FF3',
          psychic: '#F95587',
          bug: '#A6B91A',
          rock: '#B6A136',
          ghost: '#735797',
          dragon: '#6F35FC',
          dark: '#705746',
          steel: '#B7B7CE',
          fairy: '#D685AD',
        },
      },
    },
  },
})
