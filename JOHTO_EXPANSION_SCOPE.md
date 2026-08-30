# Johto Expansion — Scoping Document

**Status:** v3 — final. All decisions resolved, no open questions remaining. This document is written to become the brief for a future Claude Code build session, structured so that session can hand each numbered section to a dedicated subagent, plus run an automated playtesting pass at the end.

---

## 0. How to use this document

This is not a spec to execute literally top-to-bottom by one agent — it's a **subagent work breakdown**. When this doc goes into a build session, the recommended shape is:

1. A **lead/orchestrator pass** (you + Claude) reads this whole doc, resolves the one remaining flag in §9, and locks the engine-level changes in §5–6 and §8.2 (region-gated evolutions) and §8.5 (roaming legendaries) and §11 (flee/damage mechanic) first — every content subagent depends on these landing before they start, since they all touch the same `region` state and evolution/encounter logic.
2. Independent **content subagents** run in parallel once the schema/mechanics are locked, each scoped to one section below:
   - **World/Routes agent** — §7 (route data, encounter tables, terrain, gym linkage, Victory Road)
   - **Pokédex agent** — §8 (Johto Pokémon entries, abilities, rarity/HP tiers, region-gated evolutions, egg event, Eevee event, roaming beasts, sprite wiring)
   - **Gym/Elite Four/Capstone agent** — §9 (leader rosters, E4 pool, Red capstone battle + scoring, E4 money rewards)
   - **Events agent(s)** — §10 (recommend splitting by theme/region-third, since this is the largest content item — see §10.4)
   - **Art agent** — §4 (GSC-style sprite wiring + Johto location-scene pixel art)
   - **Economy/tension agent** — §12 (Kanto-side item/shop/reward rebalancing, E4 reward-money spend loop)
   - **Backend/leaderboard/telemetry agent** — §13 (Supabase schema + leaderboard UI toggle + telemetry events)
3. An **integration pass** wires the subagents' output together (region flag, save schema migration, post-victory hook, starter event, mid-Johto save/load).
4. An **automated playtesting agent** (§16) runs after integration, before this is called "done" — including simulating a spread of Kanto→Johto carryover states (strong full roster down to a scraped-by 1-2 survivor), per your note.

Each subagent should be hard capped to referencing this doc's numbered section, `CLAUDE.md`, and read access to the existing Kanto data files as **style/shape reference only** — not to be copied wholesale, to avoid Johto reading like a reskin.

---

## 1. Vision & design pillars

- Johto is the game's second act, unlocked only after beating the Kanto Elite Four. It is **not endless** — it's a hard, finite second campaign with its own 8 gyms, its own Elite Four (rematch-flavored), and a final capstone fight, after which the run ends for real.
- **Jeopardy has to reach backward into Kanto.** A player who knows Johto is coming should start making different choices in Kanto — banking transportation-ability buffs, keeping key items instead of selling them, prioritizing battle-star grinding over speed.
- Johto is meaningfully harder than Kanto: tighter money, fiercer battles, scarcer safety nets, longer routes that punish neglecting travel-ability buffs, and most runs arriving under-strength rather than with a full clean roster.
- Winnable, but not easy — target win rate is roughly half of Kanto's (§16).

---

## 2. Decisions — resolved

| Topic | Resolution |
|---|---|
| Region as a first-class concept | **Yes** — build it (§5) |
| Post-victory hook | **Yes, required** (§6) |
| Difficulty scaling | **Gradual/soft**, badge-count-keyed (§11), *plus* a new flee-failure/damage tension mechanic in place of raw encounter-danger stacking |
| Johto Pokémon species mix | **Mixed Gen I + Gen II** — several Gen I species (Onix, Scyther, Poliwag, Horsea, Chansey, etc.) are newly catchable in Johto alongside the 100 new Gen II species (§8.1, §8.4) |
| Johto sprite generation rule | Sprite art follows **catch-region**: anything caught while `state.region === 'johto'` renders with **Crystal** sprites, regardless of whether the species itself is Gen I or Gen II. Anything caught in Kanto keeps Gen I (Red/Blue/Gray) art permanently, even after evolving or crossing regions (§4.1) |
| Elm starter | **Requires an open party slot** — no bonus 7th slot (§6.1) |
| Evolution items | **None required, anywhere** — every evolution (Johto or Kanto) uses the existing abstracted battle-trigger mechanic. Johto's only twist is a **region gate**: evolutions whose *target* species is Gen II cannot fire while `state.region === 'kanto'` (§8.2) |
| Legendary beasts | **True roaming mechanic**, active immediately on entering Johto — not simplified to fixed encounters (§8.5) |
| Johto Elite Four | **Rematch-flavored reuse** of the 4 existing Kanto personas, with an expanded/diversified team pool drawn from the combined Gen I + Gen II roster, final evolutions only (§9.2 — confirmed, no Gen III) |
| Event count target | **150–200 new Johto events**, confirmed (§10.4) |
| Leaderboard schema shape | Boolean-style `johto_completed`/region flag, one row per run with nullable Johto columns — proceeding with original recommendation (§13) |
| Johto win-rate target | **20–25%** for a prepared/proper run — roughly half of an assumed 30–40% non-speedrun Kanto win rate — with most runs entering Johto under-strength, not with a full 6-mon roster (§16) |
| Save migration | **Confirmed required** — legacy saves default to `region: 'kanto'`, `completedRegions: []` on load (§6.2) |
| Telemetry | **Confirmed required** — concrete event/metric list added (§13.3) |
| Mid-Johto save/reload | **Confirmed required**, must match existing Kanto auto-save/reload behavior exactly (§14.1) |
| Carryover variety testing | **Confirmed required** — playtesting must simulate a spread from full strong roster to a scraped-by 1-2-mon entry (§16) |

---

## 3. Current architecture — facts the build session needs (from codebase survey)

*(unchanged from v1 — kept here for build-session context)*

- `data/routes.js` is a single flat array; `state.currentLocationIndex` walks it linearly. Appending Johto after Kanto in the same array makes travel "just work."
- `data/pokemon.js` entries are lightweight: `{ id, name, types, rarity, baseLevel, travelAbility, evolvesTo }`. No stat/moveset system — combat is an abstracted win-chance roll.
- Pokémon art is fetched by URL from the PokeAPI community sprite repo, keyed by national dex ID (`engine/game-state.js:280-285`, `getSpriteUrl`). That repo has `generation-ii/crystal/` for dex IDs 1–251 — confirmed viable for §4.1.
- Location art (`data/location-scenes.js`) is hand-built CSS box-shadow "pixel art" from ASCII grids (`engine/pixel-art.js`), using Game Boy palette CSS variables.
- Gym leaders/Elite Four (`data/gym-leaders.js`) are plain objects/arrays with fixed 3-mon teams. Player-side win-chance debuff scales by badge count (`screens/gym-screen.js`) — no leader-side scaling today.
- Events (`data/events.js`, `engine/event-engine.js`) — 347 events today. Gating is generic; "general" event types fire on any route regardless of region.
- Victory flow (`screens/victory-screen.js`) currently deletes the save on Hall of Fame — must change (§6).
- Leaderboard schema (`supabase/schema.sql`, `pt_leaderboard`) has no region concept today (§13).
- Staging environment is already env-aware by hostname (`engine/config.js`) — natural home for the debug harness (§14).
- Existing Kanto travel-ability vocabulary (`travelAbility` field, confirmed from `data/pokemon.js`): `cut, dig, fire, flash, fly, glitch, guard, heal, intimidate, mimic, miracle, payday, poison, psychic, strength, surf`, plus legendary-unique abilities (`aurora_veil, psychic_dominance, sacred_flame, safeguard, system_restore, thunderclap`) reserved for box-legendary-tier mons. §8.1's table uses this exact vocabulary rather than inventing new ability types.

---

## 4. Art & visual identity

### 4.1 Pokémon sprites

- Add a `spriteGen`/`region` field to `getSpriteUrl(id, source)` in `engine/game-state.js`. Set once, at catch time, on the Pokémon instance — never derived dynamically, so evolving or crossing regions later doesn't retroactively repaint older catches.
- **Rule (confirmed):** art follows **catch-region**, not species-origin. A Gen I species (e.g. Poliwag) caught while `state.region === 'johto'` gets the Crystal sprite; the same species caught back in Kanto keeps Red/Blue/Gray art. This is what makes the "mixed Gen I + Gen II roster" (§8.1) visually legible — your party becomes a visible timeline of when each mon joined, not just what species it is.
- **Sprite set: Crystal**, confirmed.

### 4.2 Location art

Unchanged from v1 — see the full per-location scene brief and the proposed `--gsc-*` palette-shift approach in the original draft; carrying forward as-is. **New note per your route feedback (§7):** Victory Road (Johto) should visually echo Kanto's Victory Road scene (same "ultimate test" cave palette/density) rather than getting a wholly new design — it's meant to feel like a deliberate callback, not a new location type.

**Art asset volume estimate:** ~22 new location scenes (21 original + Victory Road), same effort profile as an existing `location-scenes.js` entry each.

---

## 5. Region as a first-class concept — confirmed, build it

Unchanged from v1 recommendation. Proposed schema:
- `state.region: 'kanto' | 'johto'`
- `route.region` field on every `data/routes.js` entry
- `state.completedRegions: string[]`

This also underpins §8.2's evolution gate, §8.5's roaming mechanic, §11's flee/damage mechanic, and §13's leaderboard toggle — it's the single piece of state everything else in this doc reads.

---

## 6. Post-victory hook

Unchanged mechanically from v1 — recap:

1. On first Kanto E4 win: don't delete the save. Record the Hall of Fame entry as today, push `'kanto'` onto `completedRegions`, then present **Continue to Johto** / **End run here**.
2. Continuing routes into the Professor Elm starter event (§6.1), not straight onto Route 29.
3. Beating the Johto E4 + capstone is the real archive/delete point.

### 6.1 Professor Elm starter event
- One-time, on first entering Johto.
- Reuses the `screens/starter-screen.js` pattern with a Johto pool (Chikorita/Cyndaquil/Totodile) and new narration.
- **Confirmed: requires an open party slot.** If the party is full (6/6), the player must release/box a mon before Elm's offer can be accepted — this is a deliberate tension point, not a papered-over bonus slot. The prompt should make the trade-off explicit ("make room for your Johto starter?") rather than auto-releasing anything.

### 6.2 Save migration (confirmed required)
- On loading any save that predates this feature (no `region` field present), default it to `region: 'kanto'`, `completedRegions: []` before any other logic runs. This should be the very first thing the load path does, ahead of any Johto-aware code touching that state, so a legacy in-progress Kanto save resumes exactly as it did before this feature shipped.
- No other migration is needed for legacy saves — a save that already reached and passed the old (save-deleting) Hall of Fame screen has no state left to migrate; only *in-progress* saves need the default-fill.

---

## 7. Johto routes — updated per your feedback

Changes from v1: **Victory Road added** (before Indigo Plateau, matched to Kanto's Victory Road length), **all route distances increased** (transportation-buff pressure), **encounter variety expanded per route** while staying habitat-plausible, and a couple of placement fixes (Sudowoodo event pinned right after National Park; Lake of Rage carries the Shiny Gyarados encounter — see §10.4).

Kanto's longest route (Victory Road) runs `distanceToNext: 77`; Johto's route distances below are scaled up from v1's draft (roughly 1.4–1.6x) so the region reads as a longer haul throughout, not just at the finish line.

| # | Location | Terrain | Distance to next | Gym? | Encounters (draft, expanded) |
|---|---|---|---|---|---|
| 1 | New Bark Town | town | 18 | — | (starter event location, no wild encounters) |
| 2 | Route 29 | route | 65 | — | Sentret, Hoothoot, Pidgey, Rattata, Spearow |
| 3 | Cherrygrove City | town | 12 | — | — |
| 4 | Route 30 | route | 58 | — | Hoppip, Caterpie, Weedle, Pidgey, Ledyba, Bellsprout |
| 5 | Route 31 | route | 55 | — | Zubat, Geodude, Bellsprout, Poliwag, Sandshrew |
| 6 | Violet City | city | 15 | **Falkner** | — |
| 7 | Route 32 | route | 65 | — | Rattata, Zubat, Wooper, Slowpoke, Poliwag, Bellsprout |
| 8 | Union Cave | cave | 70 | — | Zubat, Geodude, Onix, Wooper, Rattata, Dunsparce |
| 9 | Route 33 | route | 45 | — | Rattata, Hoothoot, Ledyba, Sentret, Dunsparce |
| 10 | Azalea Town | city | 15 | **Bugsy** | — |
| 11 | Slowpoke Well | cave | 35 | — | Slowpoke, Zubat, Poliwag |
| 12 | Route 34 | route | 60 | — | Ledyba, Spinarak, Drowzee, Abra, Chansey, Wobbuffet |
| 13 | Goldenrod City | city | 18 | **Whitney** | — |
| 14 | Route 35 / National Park | route | 58 | — | Oddish, Bellsprout, Hoppip, Sunkern, Yanma, Scyther, Aipom |
| — | *Sudowoodo event* | — | — | — | Fires as a location event right after National Park, not a wild encounter (§10.4) |
| 15 | Route 36 / 37 | route | 62 | — | Bellsprout, Hoothoot, Pineco, Stantler, Girafarig, Murkrow (night) |
| 16 | Ecruteak City | city | 15 | **Morty** | — |
| 17 | Route 38 / 39 | route | 60 | — | Miltank (farm), Tauros, Magnemite, Chansey, Snubbull |
| 18 | Olivine City | city | 15 | **Jasmine** | — |
| 19 | Route 40 / 41 (ferry) | water | 70 | — | Tentacool, Krabby, Horsea, Chinchou, Remoraid, Qwilfish |
| 20 | Cianwood City | city | 15 | **Chuck** | — |
| 21 | Route 42 / Mt. Mortar | cave/mountain | 75 | — | Marill, Machop, Geodude, Onix, Teddiursa, Slugma |
| 22 | Mahogany Town | town | 20 | **Pryce** | — |
| 23 | Lake of Rage | route | 55 | — | Magikarp (incl. Shiny Gyarados encounter, §10.4), Goldeen, Poliwag |
| 24 | Route 44 / Ice Path | cave | 70 | — | Swinub, Delibird, Seel, Sneasel, Larvitar |
| 25 | Blackthorn City | city | 15 | **Clair** | — |
| 26 | Dragon's Den | cave | 45 | — | Dratini, Dragonair, Horsea |
| 27 | **Victory Road (Johto)** | cave | **77** (matched to Kanto's Victory Road) | — | Machoke, Onix, Larvitar, Skarmory, Houndour, Gligar |
| 28 | Indigo Plateau (Johto E4 rematch) | league | 0 → capstone | Johto Elite Four | — |
| 29 | Route 28 / Mt. Silver | mountain | **~100** | Final capstone (Red) | Large, deliberately varied pool — see §9's Mt. Silver note |

**Notes for the World/Routes agent:**
- Route/cave/mountain distances now sit in the ~55–75 range throughout (vs. Kanto's mixed 8–77), while town connector distances stay short (12–20) — matches the "consistently longer haul, not just a harder finish line" goal. **Route 28/Mt. Silver is the outlier by design: ~100**, deliberately the longest single route in the entire game — it's the last stretch before the capstone and should feel like a genuine slog that tests whether the player restocked properly (§9.5).
- Encounter tables above are widened to 5–6 named entries per route (up from v1's 3–4) while staying habitat-plausible (e.g. Onix in caves/mountains, Poliwag near water routes, Scyther/Yanma/Aipom in the National Park's bug-catching-contest habitat) — the World/Routes and Pokédex agents should true this up against final rarity weights.
- Union Cave and Route 42/Mt. Mortar are the proposed homes for catchable Onix (see §8.4) — both are plausible cave/mountain habitats and let a player without a Kanto-caught Onix still build toward Steelix.
- National Park is the proposed home for catchable Scyther (see §8.4), matching the original games' placement and the bug-catching-contest flavor already implied there.

---

## 8. Johto Pokédex — updated per your feedback

### 8.1 Full table, with abilities added

Same 100-species table as v1, now with a **travel ability** column drawn from the confirmed existing vocabulary (§3), plus corrected placements for Larvitar/Teddiursa/Phanpy (no longer Mt.-Silver-exclusive) and updated sourcing for the egg-event and roaming mons.

| Dex # | Name | Route(s) | Rarity | HP tier | Travel ability |
|---|---|---|---|---|---|
| 152 | Chikorita | Starter (Elm) | starter | 4 | cut |
| 153 | Bayleef | Evolution | — | 5 | cut |
| 154 | Meganium | Evolution | — | 6 | heal |
| 155 | Cyndaquil | Starter (Elm) | starter | 4 | fire |
| 156 | Quilava | Evolution | — | 5 | fire |
| 157 | Typhlosion | Evolution | — | 6 | fire |
| 158 | Totodile | Starter (Elm) | starter | 4 | strength |
| 159 | Croconaw | Evolution | — | 5 | strength |
| 160 | Feraligatr | Evolution | — | 6 | strength |
| 161 | Sentret | Route 29, 33 | common | 2 | dig |
| 162 | Furret | Evolution | — | 3 | dig |
| 163 | Hoothoot | Route 29, 30, 33 | common | 2 | flash |
| 164 | Noctowl | Evolution | — | 4 | flash |
| 165 | Ledyba | Route 30, 33, 34 | common | 2 | cut |
| 166 | Ledian | Evolution | — | 3 | cut |
| 167 | Spinarak | Route 34 | common | 2 | poison |
| 168 | Ariados | Evolution | — | 3 | poison |
| 169 | Crobat | Evolution (Zubat/Golbat) | — | 5 | fly |
| 170 | Chinchou | Route 40/41 | uncommon | 3 | surf |
| 171 | Lanturn | Evolution | — | 4 | flash |
| 172 | Pichu | rare egg event | rare | 2 | flash |
| 173 | Cleffa | rare egg event | rare | 2 | miracle |
| 174 | Igglybuff | rare egg event | rare | 2 | heal |
| 175 | Togepi | rare egg event | rare | 3 | miracle |
| 176 | Togetic | Evolution | — | 4 | miracle |
| 177 | Natu | Route 36/37 | uncommon | 2 | psychic |
| 178 | Xatu | Evolution | — | 4 | psychic |
| 179 | Mareep | Route 31 | uncommon | 3 | flash |
| 180 | Flaaffy | Evolution | — | 4 | flash |
| 181 | Ampharos | Evolution | — | 6 | flash |
| 182 | Bellossom | Evolution — **Johto-region-gated** (§8.2) | — | 5 | heal |
| 183 | Marill | Route 42/Mt. Mortar | uncommon | 2 | surf |
| 184 | Azumarill | Evolution | — | 4 | surf |
| 185 | Sudowoodo | Route 36/37 event (§10.4) | rare | 4 | strength |
| 186 | Politoed | Evolution — **Johto-region-gated** (§8.2) | — | 5 | surf |
| 187 | Hoppip | Route 30, National Park | common | 1 | fly |
| 188 | Skiploom | Evolution | — | 2 | fly |
| 189 | Jumpluff | Evolution | — | 3 | fly |
| 190 | Aipom | National Park | uncommon | 3 | dig |
| 191 | Sunkern | National Park | common | 1 | heal |
| 192 | Sunflora | Evolution — **Johto-region-gated** (§8.2) | — | 4 | heal |
| 193 | Yanma | National Park | uncommon | 3 | fly |
| 194 | Wooper | Route 32, Union Cave | common | 3 | surf |
| 195 | Quagsire | Evolution | — | 5 | surf |
| 196 | Espeon | Eevee event (§8.3), day | — | 6 | psychic |
| 197 | Umbreon | Eevee event (§8.3), night | — | 6 | intimidate |
| 198 | Murkrow | Route 36/37, night | uncommon | 3 | flash |
| 199 | Slowking | Evolution — **Johto-region-gated** (§8.2) | — | 6 | psychic |
| 200 | Misdreavus | Ecruteak (Bell Tower) | rare | 4 | flash |
| 201 | Unown | Ruins side-content | legendary | 2 | mimic |
| 202 | Wobbuffet | Route 34 | uncommon | 5 | guard |
| 203 | Girafarig | Route 36/37 | uncommon | 4 | psychic |
| 204 | Pineco | Route 36/37 | common | 2 | guard |
| 205 | Forretress | Evolution | — | 4 | guard |
| 206 | Dunsparce | Route 33, Union Cave | uncommon | 3 | dig |
| 207 | Gligar | Victory Road | uncommon | 4 | fly |
| 208 | Steelix | Evolution (from Onix) — **Johto-region-gated** (§8.2) | — | 7 | guard |
| 209 | Snubbull | Route 38/39 | uncommon | 3 | intimidate |
| 210 | Granbull | Evolution | — | 5 | intimidate |
| 211 | Qwilfish | Route 40/41 | rare | 4 | poison |
| 212 | Scizor | Evolution (from Scyther) — **Johto-region-gated** (§8.2) | — | 6 | cut |
| 213 | Shuckle | Route 42/Mt. Mortar | rare | 3 | guard |
| 214 | Heracross | Route 36/37 | rare | 6 | strength |
| 215 | Sneasel | Route 44/Ice Path | rare | 4 | flash |
| 216 | Teddiursa | Route 42/Mt. Mortar, Route 44/Ice Path | uncommon | 3 | strength |
| 217 | Ursaring | Evolution | — | 6 | strength |
| 218 | Slugma | Route 42/Mt. Mortar | uncommon | 3 | fire |
| 219 | Magcargo | Evolution | — | 5 | fire |
| 220 | Swinub | Route 44/Ice Path | uncommon | 3 | dig |
| 221 | Piloswine | Evolution | — | 5 | strength |
| 222 | Corsola | Route 40/41 | uncommon | 3 | surf |
| 223 | Remoraid | Route 40/41 | common | 2 | surf |
| 224 | Octillery | Evolution | — | 4 | surf |
| 225 | Delibird | Route 44/Ice Path | rare | 3 | fly |
| 226 | Mantine | Route 40/41 | rare | 4 | surf |
| 227 | Skarmory | Victory Road | rare | 5 | fly |
| 228 | Houndour | Victory Road, Route 42 | uncommon | 3 | intimidate |
| 229 | Houndoom | Evolution | — | 6 | intimidate |
| 230 | Kingdra | Evolution (from Seadra) — **Johto-region-gated** (§8.2) | — | 7 | surf |
| 231 | Phanpy | Route 44/Ice Path, Route 42 | uncommon | 3 | strength |
| 232 | Donphan | Evolution | — | 6 | strength |
| 233 | Porygon2 | Evolution (from Porygon) — **Johto-region-gated** (§8.2) | — | 5 | system_restore |
| 234 | Stantler | Route 36/37 | rare | 4 | psychic |
| 235 | Smeargle | rare event encounter | rare | 2 | mimic |
| 236 | Tyrogue | rare egg event | rare | 3 | strength |
| 237 | Hitmontop / Hitmonlee / Hitmonchan | Evolution (Tyrogue, random — §8.3) | — | 5 | strength |
| 238 | Smoochum | rare egg event | rare | 3 | psychic |
| 239 | Elekid | rare egg event | rare | 3 | flash |
| 240 | Magby | rare egg event | rare | 3 | fire |
| 241 | Miltank | Route 38/39 (Moomoo Farm) | uncommon | 5 | heal |
| 242 | Blissey | Evolution (from Chansey) — **Johto-region-gated** (§8.2) | — | 7 | heal |
| 243 | Raikou | **Roaming**, any Johto route, from region entry (§8.5) | legendary | 8 | thunderclap |
| 244 | Entei | **Roaming**, any Johto route, from region entry (§8.5) | legendary | 8 | sacred_flame |
| 245 | Suicune | **Roaming**, any Johto route, from region entry (§8.5) | legendary | 8 | safeguard |
| 246 | Larvitar | Route 44/Ice Path, Route 42/Mt. Mortar, Victory Road | rare | 4 | strength |
| 247 | Pupitar | Evolution | — | 5 | strength |
| 248 | Tyranitar | Evolution | — | 8 | strength |
| 249 | Lugia | Whirl Islands (side content) | legendary | 9 | psychic_dominance |
| 250 | Ho-Oh | Bell Tower/Tin Tower (postgame) | legendary | 9 | sacred_flame |
| 251 | Celebi | **Out of scope for v1** — no natural acquisition path in this engine | — | — | — |

### 8.2 Region-gated evolutions (new mechanic, generalized from your two examples)

You called out Onix→Steelix and Scyther→Scizor specifically ("if those mons are in your Kanto party, they cannot hit the evolve trigger"). Rather than hardcoding just those two pairs, the cleanest implementation is a **general rule**: *any evolution whose target species is a Gen II Pokémon cannot fire while `state.region === 'kanto'`*, regardless of what the original games required (item, trade, friendship, stone). That covers Onix→Steelix, Scyther→Scizor, Poliwhirl→Politoed, Slowpoke→Slowking, Seadra→Kingdra, Chansey→Blissey, Porygon→Porygon2, Sunkern-line→Sunflora, Gloom→Bellossom, etc. — one rule instead of a growing special-case list, and it reads narratively consistent ("this evolution doesn't exist yet, you haven't been to Johto").

Practically: `evolvesTo` resolution in `engine/game-state.js` needs a check against the target species' generation before allowing the evolve trigger to fire — a straightforward, low-risk addition given evolution is already a single abstracted trigger point, not a stats/moves system to rebalance.

### 8.3 Two new special evolution events

- **Rare Egg Event**: a single event (Johto-tagged, low weight, one-time or low-max-triggers) that hatches one of Elekid / Tyrogue / Smoochum / Magby at random. Structurally this can reuse the existing weighted-outcome event schema (`data/events.js`) — one event, four outcomes, each granting a different mon.
- **Tyrogue's evolution**: same "random among 3" mechanic already used for Eevee in Kanto — evolves at the normal trigger into Hitmonlee, Hitmonchan, or Hitmontop at random. Reuses existing random-evolution branching rather than inventing new logic.
- **Eevee in Johto**: add a Johto encounter/event for Eevee (currently Kanto-only) so players who didn't get/keep one in Kanto have a second chance. Its evolution mechanic (win-by-battle or Rare-Candy-triggered, random outcome) is the same existing Kanto mechanic — **extend the outcome pool** from the current 3 (Vaporeon/Jolteon/Flareon) to include Espeon/Umbreon when the trigger fires while `state.region === 'johto'`. Same integration point as §8.2, just widening a pool rather than gating a single evolution — the engine subagent should confirm exactly where this pool is defined today (likely `evolvesTo` as an array on Eevee's `data/pokemon.js` entry, or special-cased in `game-state.js`'s evolution handler) before extending it.

### 8.4 Gen I species newly catchable in Johto

To support §8.2's region-gated evolutions without requiring a player to have carried the pre-evolution over from Kanto, these existing Gen I dex entries get new Johto route-encounter-table entries (no new Pokédex rows — they already exist in `data/pokemon.js`):

| Species | Proposed Johto route(s) | Rarity |
|---|---|---|
| Onix | Union Cave, Route 42/Mt. Mortar | uncommon |
| Scyther | National Park | rare |
| Poliwag / Poliwhirl | Route 31, 32, Slowpoke Well, Lake of Rage | uncommon |
| Horsea / Seadra | Route 40/41, Dragon's Den | uncommon |
| Chansey | Route 34, Route 38/39 | rare |
| Porygon | *not naturally catchable in either region today — confirm with the World/Routes agent whether it should get a first Johto placement (e.g. Goldenrod, matching the original games' Game Corner placement) or stay prize/event-only* |

This is the concrete mechanism behind your "mix of Gen I and Gen II" note (§2) — Johto's encounter tables aren't purely the 100 new species, they're a genuine blend.

### 8.5 Roaming legendary beasts (new mechanic, confirmed in scope)

You upgraded this from v1's "simplify to fixed encounters" recommendation to a real roaming mechanic. Proposed design, working within the engine's existing daily-tick structure (`engine/travel-engine.js`) rather than building a new simulation layer:

- Raikou, Entei, and Suicune each get a `roaming: true` flag and are **not** tied to any specific route's `encounterTable`.
- From the moment `state.region` becomes `'johto'`, each uncaught beast has a small per-day chance (evaluated in the existing daily-tick, alongside the current encounter roll) to trigger a roam-encounter on whatever Johto route the player is currently on.
- A roam-encounter behaves like a rare/legendary-tier encounter but with a notably higher flee-chance for the *Pokémon* (i.e., it's likely to escape even on a failed catch, not just fail to be caught) — consistent with "roaming" meaning "hard to pin down," without needing to simulate the beast actually moving between locations.
- Once caught, a beast is removed from the roam pool for that save. Uncaught beasts remain roam-eligible for the rest of the run, including after the Johto E4 (they don't vanish at the capstone).
- This is additive to the existing daily-tick and encounter-roll structure — no new subsystem beyond "a second, beast-specific roll checked alongside the normal encounter roll while in Johto."

---

## 9. Gym leaders, Elite Four, and capstone — updated per your feedback

### 9.1 Gym leader gauntlets (your exact rosters, ace listed last)

| Leader | Location | Type | Team (ace last) |
|---|---|---|---|
| Falkner | Violet City | Flying | Noctowl, Crobat, **Pidgeot** |
| Bugsy | Azalea Town | Bug | Ledian, Ariados, **Scyther** |
| Whitney | Goldenrod City | Normal | Clefairy, Stantler, **Miltank** |
| Morty | Ecruteak City | Ghost | Murkrow, Misdreavus, **Gengar** |
| Jasmine | Olivine City | Steel | Magneton, Skarmory, **Steelix** |
| Chuck | Cianwood City | Fighting | Primeape, Hitmontop, **Poliwrath** |
| Pryce | Mahogany Town | Ice | Dewgong, Jynx, **Piloswine** |
| Clair | Blackthorn City | Dragon | Dragonite, Gyarados, **Kingdra** |

Notable: Bugsy's ace (Scyther, uncaught by most players at this point) and Jasmine's ace (Steelix, only obtainable via §8.2's region-gated evolution or a fresh Union Cave/Mt. Mortar catch) both lean on mechanics this doc newly introduces — worth the Gym agent double-checking these are reliably obtainable by the time a player reaches that gym, not just narratively fitting.

### 9.2 Johto Elite Four — pool diversification — **one open question**

You asked to "spice up the proposed teams of each gym leader" (done above) and separately to diversify the **E4's** team pool with "appropriate typings... from the gen 3 selections... final evolutions only."

**Confirmed:** this meant diversifying each E4 member's pool using final-evolution Pokémon drawn from the full Gen I + Gen II roster now available (the combined Kanto + Johto Pokédex) — not a literal Generation III addition. No Gen III content anywhere in this doc's scope.

Proposed pool diversification (final evolutions only, drawn from Gen I + Gen II, typed to each member's existing specialty):

| E4 member | Type focus | Proposed pool (final evolutions) |
|---|---|---|
| Lorelei | Ice/Water | Lapras, Piloswine, Cloyster, Kingdra |
| Bruno | Fighting/Rock | Machamp, Golem, Hitmonchan/Hitmonlee, Steelix |
| Agatha | Ghost/Poison | Gengar, Crobat, Muk, Weezing |
| Lance | Dragon/Flying | Dragonite, Kingdra, Charizard, Aerodactyl |
| Champion (rematch) | Mixed | A capstone-adjacent mixed roster — recommend finalizing after Lance's pool, so the Champion doesn't duplicate Lance's dragon lean |

### 9.3 Final capstone: Red

- Fixed 6-Pokémon roster, **all `ace: true`**, presented in **random order** each run: Charizard, Blastoise, Venusaur, Kingler, Tauros, Pikachu.
- **Scoring, not binary win/lose**: the capstone awards points per Red Pokémon defeated, scaling up per additional win (beating 2 is worth more than proportionally beating 1, not just double) — this needs its own scoring formula in `engine/scoring.js`, separate from the existing binary victory-bonus logic. Reaching and engaging Red at all should register as a real accomplishment even on a partial clear, consistent with "not unbeatable" from §1.
- Because turnaround from the Johto E4 straight into this fight is fast, **Route 28/Mt. Silver needs a genuinely large and varied catchable pool** (not just Larvitar, per the §8.1 fix) so a player arrives with a real chance to patch a depleted roster — recommend this route's `encounterTable` deliberately include a wide spread across rarity tiers rather than being a narrow "final area" table.

### 9.4 E4 victory money rewards (new mechanic)

Both the Kanto E4 win and the Johto E4 win should grant a money reward sized to matter at the following mart (i.e., meaningfully more than a typical mid-run gym reward, since this is explicitly meant to fund pre-capstone/pre-Johto shopping). This is a new reward hook on both E4-clear paths — confirm with the Economy agent (§12) whether Kanto's E4 win currently grants any money today (not confirmed in the codebase survey) so this is additive rather than duplicated.

### 9.5 Post-Johto-E4 restock stop (new, confirmed)

After beating the Johto Elite Four (and before the ~100-distance Route 28/Mt. Silver stretch begins), the player must have access to a shop and Pokémon Center — spending the §9.4 reward money here is the intended use for it. Simplest implementation: give the Indigo Plateau (Johto) location itself `hasShop: true, hasCenter: true` (today's Kanto Indigo Plateau likely doesn't need this since Kanto's run ends there — confirm with the World/Routes agent) so the restock happens as a natural stop between "beat the E4" and "start Mt. Silver," rather than requiring a new screen or detour location. This is the deliberate release valve before the longest, hardest stretch in the game — the World/Routes and Economy agents should treat this stop as load-bearing for §9.3's "arrive at the capstone with a real chance" goal, not optional flavor.

---

## 10. Events — updated per your feedback

### 10.1–10.3 — unchanged from v1
Same schema reuse plan, reuse strategy (general events free, location/story events majority-new), and ~150–200 event category breakdown as v1.

### 10.4 Two specific additions

- **Shiny Gyarados at Lake of Rage**: a special, extra-tough **encounter variant**, not a new Pokédex entry — same species/dex ID as normal Gyarados, but visually distinct (shiny palette) and set to the top HP tier (6, vs. normal Gyarados' tier) as a cosmetic-plus-difficulty flourish. Implementation-wise this is closer to a flagged encounter-table entry with an override (`{ pokemonId: <gyarados>, weight: <low>, shiny: true, hpOverride: 6 }`) than a new mon — cheap, and matches your framing of "cosmetic, not a new catch."
- **Sudowoodo event**, placed immediately after National Park (Route 35), per your note — already reflected in §7's route table as a location-event trigger rather than a wild encounter, matching the original games' "fake tree" puzzle framing.

### 10.5 — unchanged
Recommend splitting the Events agent into 2–3 parallel theme-based subagents given the ~150–200 event volume.

---

## 11. Difficulty scaling — updated per your feedback

You asked to *not* stack raw encounter danger higher, and instead add tension through a **flee mechanic**:

- **No change** to raw wild-encounter danger/injury scaling beyond what §3 already documents (existing badge-count-based gym/event-battle scaling carries forward unchanged, per v1's §11).
- **New mechanic**: in Johto, fleeing a wild encounter is **less likely to succeed**, and **on a failed flee, a random party member takes damage** (rather than the flee simply "not working" with no consequence, as presumably happens today). This directly punishes over-relying on flee-to-avoid-risk as a strategy, which is a more targeted way to raise stakes than blanket-scaling encounter danger — and it's naturally extendable by badge count (flee success rate could still taper down gradually across Johto, using the same shared scaling function from v1's §11 design) without needing a second new system.
- Recommend this lives in `engine/encounter-engine.js`'s existing flee-resolution path — should be a small, contained change given the engine already resolves flee attempts somewhere in that file.

---

## 12. Kanto-side economy & tension changes — updated per your feedback

- **No evolution items, anywhere** — confirmed, removes the "gate evolution items behind Kanto-side acquisition" lever from v1 entirely. The economy/tension mechanism is now carried by §8.2's region gate (evolutions are timing-gated, not item-gated) plus the money-scarcity and travel-ability-buff levers below.
- **Money scarcity** in Johto — unchanged recommendation from v1 (higher shop/entry costs, tuned last).
- **Ability-buff continuity** — reinforced by §7's longer routes: recommend the Economy/tension agent explicitly verify each travel ability (fly/surf/cut/etc.) has a Johto route where it clearly pays off, now that routes are longer and the "don't neglect transportation buffs" pressure is a stated design goal, not just incidental.
- **E4 reward money** (§9.4) is the new lever that lets a prepared player re-stock at the mart between Kanto→Johto and Johto-E4→capstone — this section and §9.4 should be tuned together.

---

## 13. Leaderboard, Pokédex, and telemetry — updated per your feedback

### 13.1–13.2 — proceeding with original recommendations
- Leaderboard schema: boolean-style `johto_completed` flag (simpler, sufficient for 2 regions) rather than an extensible `region` text column.
- One leaderboard row per run, existing columns describe the Kanto result unchanged, new `johto_*` columns nullable until a run continues into Johto.
- Leaderboard/Pokédex screen toggle (Kanto / Johto view) as described in v1.

### 13.3 Telemetry — new, concrete proposal (you asked for trackable Supabase metrics)

The existing `pt_events` table (`event_type text`, `payload jsonb`) is already a generic event-logging table — recommend using it rather than adding new tables, by defining a small set of new `event_type` values with structured payloads:

| `event_type` | Payload contents | What it answers |
|---|---|---|
| `johto_entered` | party size/composition, battle-star count, badge count, days elapsed in Kanto | How under/over-prepared are players on region entry? (directly measures the §1 "Kanto choices matter" pillar) |
| `johto_gym_cleared` | leader id, party state at time of clear, attempt count if retries are tracked | Per-gym difficulty/pass-rate curve — validates §11's gradual scaling |
| `johto_elite_four_cleared` | party state, days elapsed | Funnel: what fraction of Johto entrants reach the second E4? |
| `capstone_result` | number of Red's Pokémon defeated (0–6), final party state | Distribution of capstone outcomes — validates §9.3's partial-credit scoring actually produces a spread, not a cliff |
| `johto_run_ended` | won/lost/quit, location of death if applicable, final party composition | Where do runs actually end, in aggregate — the direct success-rate metric you asked for |
| `legendary_roam_encountered` / `legendary_roam_caught` | which beast, route, day | Whether §8.5's roaming mechanic is actually being encountered at a reasonable rate, or too rare/common |

All of these are aggregable directly via Supabase SQL against `pt_events` (filter by `event_type`, unpack `payload`) without new tables — recommend this as the v1 telemetry scope, with a note that if query performance on `payload` JSON filtering becomes a problem at scale, dedicated columns/tables can follow later.

---

## 14. Staging test harness — updated per your feedback

### 14.1 Mid-Johto save/reload — confirmed required
The existing Kanto auto-save/reload path (`engine/game-state.js`) must work identically once `state.region === 'johto'` — no separate save mechanism. This is largely a verification item for the integration pass (confirm the save payload round-trips all new Johto-specific fields — party sprite-gen tags, roaming-beast-caught flags, region/completedRegions) rather than new code, since the save system itself isn't region-aware today by omission, not by design.

### 14.2 — otherwise unchanged from v1
Debug entry point (staging-only, hostname-gated) that drops a save directly into Johto with a curated party/items/buffs, for reproducible playtesting. **New addition**: per §16, this harness should support **multiple preset carryover profiles** (e.g. `full-strong`, `mid-attrition`, `scraped-by`) rather than a single fixed loadout, so the playtesting agent can exercise the full spread of realistic Kanto outcomes rather than just a best-case one.

---

## 15. Content volume summary

| Item | Kanto (existing) | Johto (proposed, v2) |
|---|---|---|
| Locations | 29 | ~22 (21 + Victory Road) |
| Pokémon (new Pokédex entries) | 152 (incl. MissingNo) | 100 (#152–251), plus several existing Gen I species newly catchable in Johto (§8.4) |
| Gym leaders | 8 | 8 |
| Elite Four | 5 (fixed) | 4 rematch (diversified pool, pending §9.2 confirmation) + Champion + Red capstone |
| Events | 347 | ~150–200 |
| Location art scenes | 29 | ~22 |
| New engine mechanics | — | region flag, post-victory branch, region-gated evolutions (§8.2), roaming legendaries (§8.5), flee-failure/damage tension (§11), capstone partial-credit scoring (§9.3), E4 reward money (§9.4), leaderboard region toggle, telemetry event set |

This is a genuinely large build, now with a longer new-mechanics list than v1 (roaming beasts and region-gated evolutions in particular are real subsystems, not data entries). Sequencing still matters most: §5/§6/§8.2/§8.5/§11's mechanics need to land before content subagents can produce anything that integrates cleanly.

---

## 16. Automated playtesting — updated per your feedback

Unchanged static-validation list from v1 (route/event/gym data integrity, evolution-chain acyclicity, schema regression checks), **plus**:

- **Carryover variety matrix (confirmed required)**: simulated Johto entries should span the realistic spread of Kanto outcomes, not just a best-case loadout — at minimum: (a) full 6-mon roster, strong/starred, (b) mid-attrition (3–4 mons, mixed star levels), (c) scraped-by (1–2 mons, minimal stars). §14.2's debug harness presets should map directly to this matrix.
- **Win-rate target: 20–25%** for a *prepared and proper* run (roughly half of an assumed 30–40% non-speedrun Kanto win rate) — but this should be measured **per carryover profile**, not as one blended number, since a "scraped-by" entry is expected to have a meaningfully lower win rate than a "full-strong" one by design (that gap *is* the thing being validated — it's the mechanical proof that Kanto play style actually mattered).
- **Roaming-beast encounter rate check** (§8.5): confirm beasts are actually being encountered/caught at a reasonable rate across simulated runs, not so rare they're effectively absent or so common they trivialize the "rare legendary" framing.
- **Capstone score distribution check** (§9.3): confirm simulated runs produce a real spread across 0–6 Red-Pokémon-defeated outcomes, not a cliff at 0 or 6.
- Everything else (soft-lock/trivial-gym detection, save/reload round-trip, difficulty-curve-across-gyms plotting, manual spot-check) — unchanged from v1.

---

## 17. Status

All decisions are resolved. This document is ready to hand to a build session.
