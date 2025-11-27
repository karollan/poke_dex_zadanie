# Pokémon Explorer - zadanie rekrutacyjne

Aplikacja do przeglądania Pokémonów, zbudowana z wykorzystaniem Vue 3, Vuetify 3 i PokeAPI.

## Spis treści

- [Wymagania](#-wymagania)
- [Instalacja](#-instalacja)
- [Uruchomienie](#-uruchomienie)
- [Opis aplikacji](#-opis-aplikacji)
- [Funkcjonalności](#-funkcjonalności)
- [Struktura projektu](#-struktura-projektu)
- [Technologie](#-technologie)
- [API](#-api)

## Wymagania

Przed uruchomieniem aplikacji upewnij się, że masz zainstalowane:

- **Node.js** (wersja 18 lub nowsza)
- **npm** (wersja 9 lub nowsza) lub **yarn**

## Instalacja

1. **Sklonuj repozytorium** (lub rozpakuj archiwum):

```bash
git clone <url-repozytorium>
cd poke_dex_zadanie
```

2. **Zainstaluj zależności**:

```bash
npm install
```

## Uruchomienie

### Tryb deweloperski

Uruchom serwer deweloperski z hot-reload:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000/poke_dex_zadanie/**

### Budowanie produkcyjne

Zbuduj aplikację do wdrożenia:

```bash
npm run build
```

Pliki produkcyjne znajdziesz w folderze `dist/`.

### Podgląd wersji produkcyjnej

```bash
npm run preview
```

### Sprawdzanie typów TypeScript

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Opis aplikacji

**Pokémon Explorer** to aplikacja webowa umożliwiająca przeglądanie i wyszukiwanie Pokémonów z wykorzystaniem danych z [PokeAPI](https://pokeapi.co/)

### Główne cechy:

- **Kolorowe karty** z gradientami odpowiadającymi typom Pokémonów
- **Wyszukiwanie** po nazwie Pokémona
- **Filtrowanie** według typów
- **Dynamiczne ładowanie** (przycisk "Load More")
- **Responsywny design** dostosowany do urządzeń mobilnych
- **Modal szczegółów** z galerią sprite'ów, ewolucjami i lokacjami

## Funkcjonalności

### 1. Lista Pokémonów

Pokémony wyświetlane są w formie kart zawierających:
- Miniaturkę (oficjalny artwork)
- Nazwę
- Numer porządkowy (np. #001)
- Chipy z typami
- Kolorowe tło odpowiadające typom (gradient dla Pokémonów dwutypowych)

### 2. Filtrowanie po typach

- 18 dostępnych typów Pokémonów (Normal, Fire, Water, itd.)
- Możliwość zaznaczenia wielu typów jednocześnie
- Chipy z efektami hover
- Filtrowanie odbywa się po stronie API

### 3. Wyszukiwanie

- Pole wyszukiwania z debounce (500ms)
- Wyszukiwanie po nazwie Pokémona
- Możliwość łączenia z filtrami typów

### 4. Dynamiczne ładowanie

- Początkowe ładowanie 18 Pokémonów
- Przycisk "Load More" do doładowania kolejnych
- Komunikat "All Pokémon loaded" po załadowaniu wszystkich
- Obsługa stanów ładowania i błędów

### 5. Modal szczegółów Pokémona

Po kliknięciu na kartę Pokémona otwiera się modal z zakładkami:

| Zakładka | Zawartość |
|----------|-----------|
| **About** | Opis, wzrost, waga, doświadczenie bazowe, umiejętności |
| **Stats** | Statystyki bazowe z paskami postępu (HP, Attack, Defense, itd.) |
| **Sprites** | Galeria wszystkich dostępnych sprite'ów |
| **Evolution** | Łańcuch ewolucji z miniaturkami i poziomami |
| **Locations** | Lista lokacji, w których można spotkać Pokémona |

## Struktura projektu

```
poke_dex_zadanie/
├── public/                 # Pliki statyczne
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── components/         # Komponenty Vue
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   ├── HomeView.vue           # Główny widok
│   │   ├── PokemonCard.vue        # Karta Pokémona
│   │   ├── PokemonDetailModal.vue # Modal szczegółów
│   │   └── PokemonTypeChipFilter.vue # Filtry typów
│   ├── layouts/            # Layouty
│   │   └── default.vue
│   ├── pages/              # Strony (auto-routing)
│   │   └── index.vue
│   ├── plugins/            # Pluginy Vue
│   │   ├── index.ts
│   │   └── vuetify.ts      # Konfiguracja Vuetify + kolory typów
│   ├── services/           # Serwisy API
│   │   └── pokemon.service.ts
│   ├── stores/             # Store Pinia
│   │   ├── app.ts
│   │   ├── index.ts
│   │   └── pokemon.ts      # Store Pokémonów
│   ├── styles/             # Style globalne
│   │   └── settings.scss
│   ├── types/              # Typy TypeScript
│   │   └── Pokemon.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.mts
```

## Technologie

| Technologia | Wersja | Opis |
|-------------|--------|------|
| **Vue.js** | 3.5 | Framework JavaScript |
| **Vuetify** | 3.10 | Biblioteka komponentów UI |
| **Pinia** | 3.0 | Zarządzanie stanem |
| **Vue Router** | 4.5 | Routing |
| **TypeScript** | 5.9 | Typowanie statyczne |
| **Vite** | 7.1 | Bundler i dev server |

## API

Aplikacja korzysta z **PokeAPI** - darmowego, otwartego API z danymi o Pokémonach.

### Używane endpointy:

| Endpoint | Opis |
|----------|------|
| `GET /pokemon` | Lista Pokémonów z paginacją |
| `GET /pokemon/{id}` | Szczegóły Pokémona |
| `GET /type/{type}` | Pokémony danego typu |
| `GET /pokemon-species/{id}` | Dane gatunku (opis, ewolucje) |
| `GET /evolution-chain/{id}` | Łańcuch ewolucji |
| `GET /pokemon/{id}/encounters` | Lokacje spotkań |

### Dokumentacja API:
- Strona główna: https://pokeapi.co/
- Dokumentacja: https://pokeapi.co/docs/v2

## Kolory typów

Aplikacja używa niestandardowych kolorów dla każdego typu Pokémona, zdefiniowanych w motywie Vuetify:

| Typ | Kolor |
|-----|-------|
| Normal | `#A8A77A` |
| Fire | `#EE8130` |
| Water | `#6390F0` |
| Electric | `#F7D02C` |
| Grass | `#7AC74C` |
| Ice | `#96D9D6` |
| Fighting | `#C22E28` |
| Poison | `#A33EA1` |
| Ground | `#E2BF65` |
| Flying | `#A98FF3` |
| Psychic | `#F95587` |
| Bug | `#A6B91A` |
| Rock | `#B6A136` |
| Ghost | `#735797` |
| Dragon | `#6F35FC` |
| Dark | `#705746` |
| Steel | `#B7B7CE` |
| Fairy | `#D685AD` |

## Autor

Projekt wykonany jako zadanie rekrutacyjne.

---