// Porygon Trail - Scoring System
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function getLegendaryIds(state) {
        return state.pokedexCaught.filter(id => {
            const p = PT.Data.Pokemon.find(pk => pk.id === id);
            return p && p.rarity === 'legendary';
        });
    }

    function countLegendaries(state) {
        return getLegendaryIds(state).length;
    }

    // §9.3 — Red capstone partial-credit scoring, separate from the binary
    // victory bonus above. Non-linear on purpose: beating 2 of Red's 6
    // Pokemon is worth more than proportionally beating 1, so a partial
    // clear still feels like real, escalating progress rather than a flat
    // per-mon rate. Triangular-number scaling (1, 3, 6, 10, 15, 21 "units")
    // times a per-unit value.
    const RED_CAPSTONE_UNIT = 200;
    function calculateRedCapstoneBonus(redDefeatedCount) {
        const n = Math.max(0, Math.min(6, redDefeatedCount || 0));
        const triangular = (n * (n + 1)) / 2;
        return Math.floor(triangular * RED_CAPSTONE_UNIT);
    }

    // Kanto completion snapshot — beating the Kanto E4 used to be the entire
    // game's victory condition, worth the 2000 victory bonus plus a speed
    // bonus for a fast clear. Now that Kanto is just the first leg, those two
    // bonuses stay gated behind state.hasWon (full Red capstone win), so a
    // run that clears Kanto and then dies anywhere in Johto got neither —
    // Johto's own difficulty was erasing credit already earned in Kanto.
    // Stamped once onto state.kantoScoreSnapshot the moment Kanto's E4 falls
    // (screens/elite-four-screen.js), using state as it stands at that exact
    // instant, so it survives whatever happens afterward. calculateScore adds
    // it back in unconditionally below — Johto's own hasWon-gated victory/
    // speed bonuses then layer additively on top of it for a full clear.
    function calculateKantoSnapshotBonus(state) {
        return {
            kantoVictoryBonus: 2000,
            kantoSpeedBonus: Math.max(0, (100 - state.daysElapsed) * 50)
        };
    }

    function calculateScore(state) {
        let score = 0;
        const breakdown = {};

        // Victory bonus
        if (state.hasWon) {
            breakdown.victory = 2000;
            score += 2000;
        }

        // Kanto completion snapshot (see calculateKantoSnapshotBonus above) —
        // locked in at Kanto E4 time, added regardless of hasWon so a later
        // Johto death can't erase it. A full Red-capstone win still also gets
        // the full-game victory/speed bonuses above on top of this.
        if (state.kantoScoreSnapshot) {
            breakdown.kantoVictory = state.kantoScoreSnapshot.kantoVictoryBonus;
            score += breakdown.kantoVictory;
            breakdown.kantoSpeed = state.kantoScoreSnapshot.kantoSpeedBonus;
            score += breakdown.kantoSpeed;
        }

        // Red capstone partial-credit bonus (§9.3) — only relevant once a
        // run has actually engaged the capstone; 0 for runs that never got
        // there. Kept separate from the flat victory bonus above so even a
        // partial Red clear registers as a real accomplishment.
        if (state.redMonsDefeated) {
            breakdown.redCapstone = calculateRedCapstoneBonus(state.redMonsDefeated);
            score += breakdown.redCapstone;
        }

        // Healthy Pokemon at end
        const healthyCount = state.party.filter(p => p.status === 'healthy' && p.hp > 0).length;
        breakdown.healthyPokemon = healthyCount * 100;
        score += breakdown.healthyPokemon;

        // Speed bonus (50 points per day under the 100-day threshold) — only rewards finishing fast, not dying fast
        breakdown.speedBonus = state.hasWon ? Math.max(0, (100 - state.daysElapsed) * 50) : 0;
        score += breakdown.speedBonus;

        // Pokedex entries (tripled)
        breakdown.pokedexCaught = state.pokedexCaught.length * 30;
        score += breakdown.pokedexCaught;

        // Rare catches (tripled)
        const rareCaught = state.pokedexCaught.filter(id => {
            const p = PT.Data.Pokemon.find(pk => pk.id === id);
            return p && p.rarity === 'rare';
        }).length;
        breakdown.rarePokemon = rareCaught * 75;
        score += breakdown.rarePokemon;

        // Legendary catches
        const legendaryCaught = state.pokedexCaught.filter(id => {
            const p = PT.Data.Pokemon.find(pk => pk.id === id);
            return p && p.rarity === 'legendary';
        }).length;
        breakdown.legendaryPokemon = legendaryCaught * 200;
        score += breakdown.legendaryPokemon;

        // Gym badges
        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        breakdown.badges = badgeCount * 150;
        score += breakdown.badges;

        // Champion bonus
        if (state.badges.includes('champion')) {
            breakdown.champion = 500;
            score += 500;
        }

        // Team Rocket defeated
        breakdown.teamRocket = state.teamRocketDefeated * 50;
        score += breakdown.teamRocket;

        // Distance traveled
        const totalDist = PT.Data.Routes.slice(0, state.currentLocationIndex).reduce((sum, r) => sum + r.distanceToNext, 0) + state.distanceTraveled;
        breakdown.distance = Math.floor(totalDist / 5) * 5;
        score += breakdown.distance;

        // Resource efficiency
        breakdown.resources = Math.floor(state.resources.money / 100) * 5 +
            state.resources.food * 2 +
            state.resources.pokeballs * 5 +
            state.resources.rareCandy * 30;
        score += breakdown.resources;

        // Penalties
        const faintedCount = state.party.filter(p => p.status === 'fainted').length;
        breakdown.penalties = -(faintedCount * 50 + (state.ballsWasted || 0) * 3);
        score += breakdown.penalties;

        score = Math.max(0, score);
        return { score, breakdown };
    }

    // Leaderboard save/get/clear now delegated to LeaderboardAPI
    function saveToLeaderboard(entry) {
        return PT.Engine.LeaderboardAPI.saveToLeaderboard(entry);
    }

    // Kanto E4 clear indicator, for the "E4 WINS" leaderboard's Kanto count —
    // a totally separate accomplishment from beating Red (state.hasWon):
    // screens/postvictory-screen.js forces every Kanto E4 winner straight into
    // Johto with no "stop here" option, so `won` (the full-game/Red-capstone
    // flag) massively undercounts real Kanto E4 clears if used as its proxy.
    // state.completedRegions gets 'kanto' pushed the instant Kanto's E4 falls
    // (screens/elite-four-screen.js) and never gets cleared afterward, so this
    // stays true for the rest of the run regardless of what happens in Johto
    // or against Red — independent of johtoE4Cleared and hasWon.
    function getKantoE4Cleared(state) {
        return !!(state && state.completedRegions && state.completedRegions.includes('kanto'));
    }

    // Johto leaderboard fields (§13.1-13.2 of JOHTO_EXPANSION_SCOPE.md) — only
    // populated once state.region has become 'johto' at some point in the run;
    // a Kanto-only run gets nulls so the existing Kanto columns/leaderboards are
    // completely unaffected. Called from screens/victory-screen.js and
    // screens/gameover-screen.js and from saveRunInProgress below.
    //
    // johtoCompleted feeds the "E4 WINS" leaderboard's Johto count (via
    // pt_e4_wins_leaderboard's `count(*) filter (where johto_completed)`), so
    // it must mean "this trainer beat the Johto Elite Four" — NOT "this
    // Johto run has ended." It used to be `!!isFinal` (true on ANY
    // game-over/victory save, including dying before ever reaching Falkner),
    // which silently counted every Johto death as an E4 win. Use
    // state.johtoE4Cleared instead — set only in the Johto-E4-rematch win
    // branch of screens/elite-four-screen.js — so an in-progress save
    // (isFinal:false) also reports it correctly rather than always false.
    function getJohtoLeaderboardFields(state, score) {
        if (!state || state.region !== 'johto') {
            return { johtoCompleted: false, johtoBadges: null, johtoDaysElapsed: null, johtoScore: null, johtoPokedexCount: null };
        }
        // Kanto always awards exactly 8 gym badges before Johto opens up (see
        // screens/postvictory-screen.js), so anything beyond that count on a
        // Johto-region run is a Johto badge.
        const totalBadges = state.badges.filter(b => b !== 'champion').length;
        const johtoBadges = Math.max(0, totalBadges - 8);
        // state.daysElapsedAtJohtoEntry is stamped once, on first entering Johto
        // (screens/johto-starter-screen.js's enterJohto) — absent on saves that
        // reached Johto before that stamp existed.
        const johtoDaysElapsed = (typeof state.daysElapsedAtJohtoEntry === 'number')
            ? Math.max(0, state.daysElapsed - state.daysElapsedAtJohtoEntry)
            : null;
        return {
            johtoCompleted: !!state.johtoE4Cleared,
            johtoBadges,
            johtoDaysElapsed,
            johtoScore: score,
            johtoPokedexCount: state.pokedexCaught.length
        };
    }

    // Pushes the current (unfinished) run's score to the global leaderboard,
    // so runs that get abandoned mid-game still show up.
    function saveRunInProgress(state) {
        if (!state || !state.runId) return;
        const { score } = calculateScore(state);
        PT.Engine.LeaderboardAPI.saveInProgress(Object.assign({
            runId: state.runId,
            name: state.trainerName,
            score: score,
            pokedexCount: state.pokedexCaught.length,
            pokedexIds: state.pokedexCaught,
            legendaryIds: getLegendaryIds(state),
            badges: state.badges.filter(b => b !== 'champion').length,
            daysElapsed: state.daysElapsed,
            date: new Date().toLocaleDateString(),
            won: false,
            legendaryCount: countLegendaries(state),
            kantoE4Cleared: getKantoE4Cleared(state)
        }, getJohtoLeaderboardFields(state, score)));
    }

    function getLeaderboard() {
        return PT.Engine.LeaderboardAPI.getLocalLeaderboard();
    }

    function clearLeaderboard() {
        PT.Engine.LeaderboardAPI.clearLocal();
    }

    // ===== PERSISTENT POKÉDEX (cross-playthrough) =====
    const POKEDEX_KEY = 'porygonTrail_pokedex';

    function getGlobalPokedex() {
        try {
            const data = localStorage.getItem(POKEDEX_KEY);
            return data ? JSON.parse(data) : { seen: [], caught: [], champions: [] };
        } catch (e) {
            return { seen: [], caught: [], champions: [] };
        }
    }

    function saveGlobalPokedex(dex) {
        try {
            localStorage.setItem(POKEDEX_KEY, JSON.stringify(dex));
        } catch (e) {
            console.warn('Could not save pokedex:', e);
        }
    }

    // ===== CLOUD SYNC =====
    // Mirrors the pt_records sync in engine/records.js. Requires a Supabase
    // migration this codebase can't apply on its own:
    //   create table if not exists pt_pokedex (
    //     user_id uuid primary key references auth.users(id),
    //     pokedex_data jsonb not null,
    //     updated_at timestamptz not null default now()
    //   );
    async function cloudPushPokedex(dex) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return false;
        const client = auth.getClient();
        if (!client) return false;
        try {
            const { error } = await client.from('pt_pokedex').upsert({
                user_id: auth.getCurrentUser().id,
                pokedex_data: dex,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            return !error;
        } catch (e) {
            console.warn('Cloud pokedex push failed:', e);
            return false;
        }
    }

    async function cloudFetchPokedex() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return null;
        const client = auth.getClient();
        if (!client) return null;
        try {
            const { data, error } = await client
                .from('pt_pokedex')
                .select('pokedex_data')
                .eq('user_id', auth.getCurrentUser().id)
                .maybeSingle();
            if (error || !data) return null;
            return data.pokedex_data;
        } catch (e) {
            console.warn('Cloud pokedex fetch failed:', e);
            return null;
        }
    }

    async function clearCloudPokedex() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return;
        const client = auth.getClient();
        if (!client) return;
        try {
            await client.from('pt_pokedex').delete().eq('user_id', auth.getCurrentUser().id);
        } catch (e) {
            console.warn('Cloud pokedex clear failed:', e);
        }
    }

    // Union of id lists — unlike records' counters, seen/caught/champions are
    // just sets, so merging local (this browser) with cloud (this account) is
    // a plain dedupe, safe to re-run.
    function mergePokedex(local, cloud) {
        if (!cloud) return local;
        const merge = (a, b) => Array.from(new Set([...(a || []), ...(b || [])]));
        return {
            seen: merge(local.seen, cloud.seen),
            caught: merge(local.caught, cloud.caught),
            champions: merge(local.champions, cloud.champions)
        };
    }

    // Call once on login (fresh sign-in/up or restored session) to reconcile
    // this browser's local pokedex with the account's cloud pokedex.
    async function syncPokedexOnLogin() {
        const cloud = await cloudFetchPokedex();
        const local = getGlobalPokedex();
        const merged = mergePokedex(local, cloud);
        saveGlobalPokedex(merged);
        if (JSON.stringify(merged) !== JSON.stringify(cloud)) {
            cloudPushPokedex(merged).catch(() => {});
        }
        return merged;
    }

    // Build reverse evolution map: { evolvedId -> preEvoId }
    // e.g. { 9: 8, 8: 7 } means Blastoise(9) <- Wartortle(8) <- Squirtle(7)
    function buildPreEvoMap() {
        const map = {};
        PT.Data.Pokemon.forEach(p => {
            if (p.evolvesTo) {
                const targets = Array.isArray(p.evolvesTo) ? p.evolvesTo : [p.evolvesTo];
                targets.forEach(evoId => {
                    map[evoId] = p.id;
                });
            }
        });
        return map;
    }

    // Get all pre-evolutions of a Pokemon (walking the chain backwards)
    function getPreEvolutions(pokemonId, preEvoMap) {
        const preEvos = [];
        let current = preEvoMap[pokemonId];
        while (current !== undefined) {
            preEvos.push(current);
            current = preEvoMap[current];
        }
        return preEvos;
    }

    // Merge a completed run's data into the global Pokedex
    function updateGlobalPokedex(state) {
        const dex = getGlobalPokedex();

        // Add all seen Pokemon
        (state.pokedexSeen || []).forEach(id => {
            if (!dex.seen.includes(id)) dex.seen.push(id);
        });

        // Add all caught Pokemon
        (state.pokedexCaught || []).forEach(id => {
            if (!dex.caught.includes(id)) dex.caught.push(id);
        });

        // If won, add surviving party as champions + their pre-evolutions
        if (state.hasWon) {
            const preEvoMap = buildPreEvoMap();
            state.party.forEach(p => {
                if (p.hp > 0 && p.status !== 'fainted') {
                    // Register the champion itself
                    if (!dex.champions.includes(p.id)) {
                        dex.champions.push(p.id);
                    }
                    // Register all pre-evolutions as champions too
                    getPreEvolutions(p.id, preEvoMap).forEach(preEvoId => {
                        if (!dex.champions.includes(preEvoId)) {
                            dex.champions.push(preEvoId);
                        }
                    });
                }
            });
        }

        saveGlobalPokedex(dex);
        cloudPushPokedex(dex).catch(() => {});
        return dex;
    }

    function clearGlobalPokedex() {
        localStorage.removeItem(POKEDEX_KEY);
        clearCloudPokedex().catch(() => {});
    }

    // Pokemon that would be tagged "champion" by this run — the surviving party
    // plus their pre-evolutions, same set updateGlobalPokedex() merges in on a win.
    function getChampionIds(state) {
        if (!state.hasWon) return [];
        const preEvoMap = buildPreEvoMap();
        const ids = new Set();
        state.party.forEach(p => {
            if (p.hp > 0 && p.status !== 'fainted') {
                ids.add(p.id);
                getPreEvolutions(p.id, preEvoMap).forEach(id => ids.add(id));
            }
        });
        return Array.from(ids);
    }

    PT.Engine.Scoring = {
        calculateScore, calculateRedCapstoneBonus, calculateKantoSnapshotBonus, saveToLeaderboard, saveRunInProgress, getLeaderboard, clearLeaderboard,
        getGlobalPokedex, updateGlobalPokedex, clearGlobalPokedex, countLegendaries, getLegendaryIds,
        getChampionIds, syncPokedexOnLogin, getJohtoLeaderboardFields, getKantoE4Cleared
    };
})();
