# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Porygon Trail: Kanto Expedition** — a Pokemon-themed roguelike survival game built in vanilla JavaScript with Game Boy aesthetics. No build step, no framework, no bundler. Open `index.html` in a browser to run it.

## Running the Game

Since there's no build tool, just serve the files. For example:

```bash
python3 -m http.server 8080
# or
npx serve .
```

There are no tests, no lint commands, and no npm scripts.

## Architecture

The entire app lives under `window.PorygonTrail` (aliased `PT` in every file). Files use IIFEs to avoid polluting global scope:

```js
(function() {
    const PT = window.PorygonTrail;
    PT.Engine.Something = { ... };
})();
```

All scripts are loaded via `<script>` tags in `index.html` — order matters.

### Namespaces

| Namespace | Purpose |
|-----------|---------|
| `PT.Data` | Static game content — Pokemon, routes, events, items, gym leaders |
| `PT.Engine` | All game logic — state, RNG, travel, encounters, events, scoring, auth, leaderboards |
| `PT.Screens` | 17 UI screens, each with a `render(container, state, params)` function |
| `PT.State` | Current game state singleton (defined in `engine/game-state.js`) |
| `PT.Config` | Supabase credentials (`config.js`, not in source control) |

### Screen Manager (State Machine)

`engine/screen-manager.js` drives navigation:
- `PT.Engine.ScreenManager.goto(name)` — wipes stack, transitions
- `PT.Engine.ScreenManager.push(name)` — push current screen, go to new
- `PT.Engine.ScreenManager.pop()` — return to previous

Screens generate fresh HTML on every render — no DOM caching.

### Key Engine Files

| File | What it does |
|------|-------------|
| `engine/game-state.js` | State schema + `createPokemon()` factory |
| `engine/travel-engine.js` | Daily simulation: pace, food, weather, encounters, legendary abilities |
| `engine/event-engine.js` | ~50 narrative events triggered probabilistically per location |
| `engine/encounter-engine.js` | Catch and battle resolution logic |
| `engine/scoring.js` | Final score calculation |
| `engine/leaderboard-api.js` | Local (localStorage) + global (Supabase) leaderboards |
| `engine/auth.js` | Username + 4-digit PIN auth via Supabase (email: `{user}@porygontrail.app`) |

### Data Files

Put large static content in `data/` — this keeps it out of context when working on logic:
- `data/pokemon.js` — all 151 Gen-I Pokemon with rarity, abilities, evolution chains
- `data/routes.js` — 25 Kanto locations with encounter tables and event pools
- `data/events.js` — narrative event definitions
- `data/items.js` — item definitions with prices

### State Shape

`PT.State` holds everything mid-run: location index, days elapsed, food/balls/potions/money, party array, badges, pokedex, graveyard, battle stars, and game-over/win flags. Mutate state directly — there's no reducer or store abstraction.

### RNG

`engine/rng.js` provides a seeded deterministic RNG initialized from `Date.now()` at game start. Use `PT.Engine.RNG.random()` instead of `Math.random()` for anything that should be reproducible.

## Supabase / Cloud Features

Cloud saves, global leaderboard, auth, and telemetry all require a `config.js` at the root:

```js
window.PorygonTrail.Config = {
    supabaseUrl: '...',
    supabaseKey: '...'
};
```

Without it the game runs in dev mode — local saves and leaderboard still work via localStorage.

## Game Rules Worth Knowing

- **Victory**: reach Indigo Plateau (last entry in `data/routes.js`)
- **Game over**: all party Pokemon faint, or starvation
- **Death is permanent**: fainted Pokemon move to graveyard
- **Battle stars**: veteran Pokemon reduce death risk via ability activations
- **Legendary abilities**: Zapdos (speed), Moltres (food), Articuno (protection), etc. — all handled in `travel-engine.js`
