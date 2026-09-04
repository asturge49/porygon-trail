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
    // victory bonus above. Flat rate per Red Pokemon defeated, so a partial
    // clear still registers as real, proportional progress even on a loss.
    const RED_MON_VALUE = 500;
    function calculateRedCapstoneBonus(redDefeatedCount) {
        const n = Math.max(0, Math.min(6, redDefeatedCount || 0));
        return n * RED_MON_VALUE;
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

    // Johto completion snapshot — same shape and reasoning as Kanto's above,
    // stamped the moment the Johto E4 rematch falls (screens/elite-four-screen.js),
    // so it survives whatever happens against Red afterward. The speed bonus
    // uses days spent IN JOHTO specifically (daysElapsed minus
    // daysElapsedAtJohtoEntry), not the run's total days — Kanto's own ~40-60
    // days are already spent by the time Johto starts, so measuring against
    // total daysElapsed would leave almost no room under the 100-day bar.
    function calculateJohtoSnapshotBonus(state) {
        const johtoDays = (typeof state.daysElapsedAtJohtoEntry === 'number')
            ? Math.max(0, state.daysElapsed - state.daysElapsedAtJohtoEntry)
            : state.daysElapsed;
        return {
            johtoVictoryBonus: 2000,
            johtoSpeedBonus: Math.max(0, (100 - johtoDays) * 50)
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

        // Johto completion snapshot (see calculateJohtoSnapshotBonus above) —
        // same idea as Kanto's, locked in at Johto E4 time so a later Red loss
        // (or simply not finishing Red) can't erase it.
        if (state.johtoScoreSnapshot) {
            breakdown.johtoVictory = state.johtoScoreSnapshot.johtoVictoryBonus;
            score += breakdown.johtoVictory;
            breakdown.johtoSpeed = state.johtoScoreSnapshot.johtoSpeedBonus;
            score += breakdown.johtoSpeed;
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

        // Trail trainers defeated (difficulty level 2+, see engine/trainer-engine.js)
        breakdown.trainersDefeated = (state.trainersDefeated || 0) * 50;
        score += breakdown.trainersDefeated;

        // Distance traveled
        const totalDist = PT.Data.Routes.slice(0, state.currentLocationIndex).reduce((sum, r) => sum + PT.Engine.GameState.getRouteDistance(r, state), 0) + state.distanceTraveled;
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

        // Difficulty level score multiplier (data/difficulty-levels.js) —
        // applied to the running total, after every additive breakdown line.
        // Multipliers like 1.5x/0.75x can leave a fractional point, which has
        // no business showing up on a leaderboard — round to a whole number.
        score = Math.round(score * PT.Data.getLevelConfig(state).scoreMultiplier);

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

        // If won, add the FINAL surviving party as champions + pre-evolutions —
        // the more complete snapshot when a run goes all the way.
        if (state.hasWon) {
            getChampionIdsFromParty(state.party).forEach(id => {
                if (!dex.champions.includes(id)) dex.champions.push(id);
            });
        }

        // Kanto E4 clear snapshot (state.kantoChampionIds, stamped in
        // screens/elite-four-screen.js) — registers champion credit for a run
        // that cleared Kanto but never beat Red, independent of hasWon. Runs
        // through both blocks when hasWon is also true; duplicates are a no-op.
        if (state.kantoChampionIds) {
            state.kantoChampionIds.forEach(id => {
                if (!dex.champions.includes(id)) dex.champions.push(id);
            });
        }

        // Johto E4 clear snapshot (state.johtoChampionIds, stamped in
        // screens/elite-four-screen.js) — same idea as kantoChampionIds
        // above, for a run that clears the Johto rematch but never beats
        // Red on Mt. Silver.
        if (state.johtoChampionIds) {
            state.johtoChampionIds.forEach(id => {
                if (!dex.champions.includes(id)) dex.champions.push(id);
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

    // Pokemon tagged "champion" for a given party snapshot — the surviving
    // members plus their pre-evolutions. Shared by getChampionIds (final party,
    // Red-win gated) and the Kanto-E4-clear snapshot (screens/elite-four-screen.js),
    // which calls this directly on state.party at the moment Kanto's E4 falls so
    // a Kanto-clearing run gets champion credit even without beating Red.
    function getChampionIdsFromParty(party) {
        const preEvoMap = buildPreEvoMap();
        const ids = new Set();
        (party || []).forEach(p => {
            if (p.hp > 0 && p.status !== 'fainted') {
                ids.add(p.id);
                getPreEvolutions(p.id, preEvoMap).forEach(id => ids.add(id));
            }
        });
        return Array.from(ids);
    }

    // Pokemon that would be tagged "champion" by this run's FINAL party — same
    // set updateGlobalPokedex() merges in on a full Red win. Only meaningful
    // once state.hasWon; see getChampionIdsFromParty for the Kanto-E4-time
    // equivalent (screens/gameover-screen.js uses state.kantoChampionIds).
    function getChampionIds(state) {
        if (!state.hasWon) return [];
        return getChampionIdsFromParty(state.party);
    }

    PT.Engine.Scoring = {
        calculateScore, calculateRedCapstoneBonus, calculateKantoSnapshotBonus, calculateJohtoSnapshotBonus,
        saveToLeaderboard, saveRunInProgress, getLeaderboard, clearLeaderboard,
        getGlobalPokedex, updateGlobalPokedex, clearGlobalPokedex, countLegendaries, getLegendaryIds,
        getChampionIds, getChampionIdsFromParty, syncPokedexOnLogin, getJohtoLeaderboardFields, getKantoE4Cleared
    };
})();
