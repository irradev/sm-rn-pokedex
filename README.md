# Pokedex

A feature-rich Pokedex app built with React Native (Expo) to practice mobile development and explore the [OpenCode](https://opencode.ai) AI coding assistant.

## What I learned

- **React Native & Expo** — Navigation with expo-router, stack & tab layouts, transparent modals, file-based routing
- **React Query** — Infinite queries for paginated lists, data fetching patterns
- **Reanimated** — Enter animations (`FadeIn`, `FadeInDown`, `ZoomIn`), layout transitions (`LinearTransition`), parallax scroll effects, skeleton pulsing
- **Context API** — Sharing state across screens via `FavoritesContext` with AsyncStorage persistence
- **OpenCode** — Using AI pair-programming to iterate quickly, refactor safely, and explore the codebase with natural language prompts
- **PokeAPI** — Consuming a REST API with typed responses

## Features

- Infinite-scroll pokedex (30 per page) with local search + API fallback
- Favorites with persistent storage, shared state across tabs
- Detail view with collapsible advanced stats, type colors, stat bars
- Centered transparent modal for quick pokemon lookup
- Skeleton loading states, staggered entry animations, parallax header

## Setup

```bash
npm install
npx expo start
```

## Stack

Expo, expo-router, react-native-reanimated, @tanstack/react-query, AsyncStorage, PokeAPI
