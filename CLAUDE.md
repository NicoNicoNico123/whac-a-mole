# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based Whac-A-Mole game built with vanilla JavaScript and Vite. The game features a 3x3 grid where players click on appearing characters to score points, with real-time leaderboard functionality via Firebase Firestore.

## Development Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production (outputs to /dist)
npm run preview  # Preview production build locally
```

## Architecture

### Core Structure
- **Single Page Application** with ES6 modules
- **Game Loop**: Event-driven with timer-based character spawning
- **State Management**: Global variables in `/src/main.js`
- **Real-time Features**: Firebase Firestore integration for leaderboard

### Key Files
- `/src/main.js` - Game logic, state management, event handlers
- `/src/firebase.js` - Firebase configuration and database operations
- `/index.html` - Main application container
- `/mole.css` - Complete styling including animations and responsive design

### Game Mechanics
- 30-second rounds with fever mode (last 10 seconds, 2x points)
- Two character types: characterG (positive) and characterP (negative)
- Grid-based gameplay with visual state changes
- Real-time leaderboard with Firebase integration

## Environment Configuration

Required Firebase environment variables:
- `VITE_FIREBASE_APIKEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Create `.env.local` for local development. In production, GitHub Actions use repository secrets with `FIREBASE_*` prefix.

## Asset Management

- All static assets in `/public/`
- Use `${import.meta.env.BASE_URL}` for asset paths in code
- Character images: `characterG_*` (positive) and `characterP_*` (negative)
- Custom cursor and UI elements included

## Deployment

- **Target**: GitHub Pages at `https://nico-iarussi.github.io/whac-a-mole/`
- **Trigger**: Push to `master` branch
- **Process**: GitHub Actions build and deploy automatically
- **Vite Config**: Base path set to `/whac-a-mole/` for proper asset resolution

## Code Patterns

- ES6 modules with import/export
- Event listeners for DOM interactions
- Timer-based game loop using `setInterval`
- Firebase operations with error handling
- CSS animations for character states and UI feedback
- Responsive breakpoints: 1200px, 768px, 480px

## Development Notes

- Game gracefully handles missing Firebase configuration
- Vite aliases `@` to `./src` for cleaner imports
- Modern browser support required (ES6+)
- Hot reload enabled in development mode