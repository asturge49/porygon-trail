// Porygon Trail - Records System
// Persistent cross-playthrough records stored in localStorage
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const RECORDS_KEY = 'porygonTrail_records';
    const MAX_HALL_OF_FAME = 5;

    function getRecords() {
        try {
            const data = localStorage.getItem(RECORDS_KEY);
            const records = data ? Object.assign(getDefaultRecords(), JSON.parse(data)) : getDefaultRecords();
            return reconcileLegacyWinCounts(records);
        } catch (e) {
            return getDefaultRecords();
        }
    }

    // totalWins predates this session's Johto/Red split: before Johto
    // existed, beating Kanto's E4 WAS the entire game and incremented
    // totalWins directly. Once Johto+Red shipped, totalWins narrowed to mean
    // "beat Red" specifically, but whatever had already accumulated in it
    // was never migrated — so old pre-Johto wins still sit there, now
    // mislabeled "Red Wins."
    //
    // Game mechanics give us a real invariant to self-heal with: totalWins
    // (Red) can never legitimately exceed totalJohtoE4Wins, since beating
    // Red requires clearing Johto's E4 in that same run. Any excess is
    // provably pre-Johto legacy data — fold it into totalKantoE4Wins (every
    // one of those old wins was, at minimum, a Kanto E4 clear) and clamp
    // totalWins down to what's actually verifiable. Idempotent, so it's
    // safe to run on every read rather than needing a one-time migration
    // flag — once corrected, wins <= johto holds and further calls are
    // no-ops.
    function reconcileLegacyWinCounts(records) {
        const johto = records.totalJohtoE4Wins || 0;
        const wins = records.totalWins || 0;
        const kanto = records.totalKantoE4Wins || 0;
        if (wins > johto) {
            records.totalKantoE4Wins = kanto + (wins - johto);
            records.totalWins = johto;
        } else if (kanto < wins) {
            // Defensive: a genuine Red win always increments totalKantoE4Wins
            // in the same call, so this shouldn't happen in practice — but
            // never let the Kanto count read lower than Red's.
            records.totalKantoE4Wins = wins;
        }
        return records;
    }

    function getDefaultRecords() {
        return {
            totalRuns: 0,
            totalWins: 0,           // Red capstone (full game) wins
            winsByLevel: {},        // { level (1-5): Red win count at that difficulty level }
            totalKantoE4Wins: 0,    // Kanto Elite Four clears — separate achievement, always a superset of totalWins
            totalJohtoE4Wins: 0,    // Johto Elite Four (rematch) clears
            highScore: null,           // { value, name, date }
            fastestWin: null,          // { value (days), name, date }
            slowestWin: null,          // { value (days), name, date }
            mostCatches: null,         // { value, name, date }
            fewestCatchesWin: null,    // { value, name, date } — wins only
            richestEnding: null,       // { value (money), name, date }
            catchTally: {},            // { pokemonId: count } — non-starter catches across all runs
            totalLegendaryCatches: 0,  // cumulative legendary catches
            hallOfFame: [],            // most recent 5 winning parties, newest first
        };
    }

    function saveRecords(records) {
        try {
            localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
        } catch (e) {
            console.warn('Could not save records:', e);
        }
    }

    // ===== CLOUD SYNC =====
    async function cloudPushRecords(records) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return false;
        const client = auth.getClient();
        if (!client) return false;
        try {
            const { error } = await client.from('pt_records').upsert({
                user_id: auth.getCurrentUser().id,
                records_data: records,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            return !error;
        } catch (e) {
            console.warn('Cloud records push failed:', e);
            return false;
        }
    }

    async function cloudFetchRecords() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return null;
        const client = auth.getClient();
        if (!client) return null;
        try {
            const { data, error } = await client
                .from('pt_records')
                .select('records_data')
                .eq('user_id', auth.getCurrentUser().id)
                .maybeSingle();
            if (error || !data) return null;
            return data.records_data;
        } catch (e) {
            console.warn('Cloud records fetch failed:', e);
            return null;
        }
    }

    async function clearCloudRecords() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return;
        const client = auth.getClient();
        if (!client) return;
        try {
            await client.from('pt_records').delete().eq('user_id', auth.getCurrentUser().id);
        } catch (e) {
            console.warn('Cloud records clear failed:', e);
        }
    }

    // Keep whichever of two "record" objects ({ value, name, date }) wins by isBetter
    function betterOf(a, b, isBetter) {
        if (!a) return b;
        if (!b) return a;
        return isBetter(a.value, b.value) ? a : b;
    }

    // Combine local (this browser) and cloud (this account) records. Additive
    // counters take cloud + local's excess over cloud rather than a flat sum —
    // this stays a one-time "catch cloud up to local" op (safe to re-run) rather
    // than a running double-count, since updateRecords() pushes to cloud after
    // every run once logged in, so local should only exceed cloud in the
    // pre-login-history case this merge exists to handle.
    function mergeRecords(local, cloud) {
        if (!cloud) return local;

        // Reconcile each side before diffing — otherwise legacy-contaminated
        // totalWins on either side throws off the delta math below.
        local = reconcileLegacyWinCounts(Object.assign({}, local));
        cloud = reconcileLegacyWinCounts(Object.assign({}, cloud));

        const merged = getDefaultRecords();

        const runDelta = Math.max(0, local.totalRuns - cloud.totalRuns);
        const winDelta = Math.max(0, local.totalWins - cloud.totalWins);
        const kantoE4Delta = Math.max(0, (local.totalKantoE4Wins || 0) - (cloud.totalKantoE4Wins || 0));
        const johtoE4Delta = Math.max(0, (local.totalJohtoE4Wins || 0) - (cloud.totalJohtoE4Wins || 0));
        const legDelta = Math.max(0, local.totalLegendaryCatches - cloud.totalLegendaryCatches);
        merged.totalRuns = cloud.totalRuns + runDelta;
        merged.totalWins = cloud.totalWins + winDelta;
        merged.totalKantoE4Wins = (cloud.totalKantoE4Wins || 0) + kantoE4Delta;
        merged.totalJohtoE4Wins = (cloud.totalJohtoE4Wins || 0) + johtoE4Delta;
        merged.totalLegendaryCatches = cloud.totalLegendaryCatches + legDelta;

        // winsByLevel: same delta approach as totalWins/totalRuns above, per level key.
        merged.winsByLevel = {};
        const allLevels = new Set([...Object.keys(local.winsByLevel || {}), ...Object.keys(cloud.winsByLevel || {})]);
        allLevels.forEach(lvl => {
            const localCount = (local.winsByLevel || {})[lvl] || 0;
            const cloudCount = (cloud.winsByLevel || {})[lvl] || 0;
            const delta = Math.max(0, localCount - cloudCount);
            merged.winsByLevel[lvl] = cloudCount + delta;
        });

        // catchTally: per-key max, not sum — safe under repeated merges.
        merged.catchTally = {};
        const allKeys = new Set([...Object.keys(local.catchTally || {}), ...Object.keys(cloud.catchTally || {})]);
        allKeys.forEach(k => {
            merged.catchTally[k] = Math.max(local.catchTally[k] || 0, cloud.catchTally[k] || 0);
        });

        ['highScore', 'mostCatches', 'richestEnding'].forEach(key => {
            merged[key] = betterOf(local[key], cloud[key], (a, b) => a > b);
        });
        ['fastestWin', 'fewestCatchesWin'].forEach(key => {
            merged[key] = betterOf(local[key], cloud[key], (a, b) => a < b);
        });
        merged.slowestWin = betterOf(local.slowestWin, cloud.slowestWin, (a, b) => a > b);

        // hallOfFame: union, dedupe by name+date+team length, sort desc by date, cap 5
        const combined = [...(local.hallOfFame || []), ...(cloud.hallOfFame || [])];
        const seen = new Set();
        merged.hallOfFame = combined
            .filter(entry => {
                const key = `${entry.name}|${entry.date}|${entry.team.length}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, MAX_HALL_OF_FAME);

        return merged;
    }

    // Call once on login (fresh sign-in/up or restored session) to reconcile
    // this browser's local records with the account's cloud records.
    async function syncRecordsOnLogin() {
        const cloud = await cloudFetchRecords();
        const local = getRecords();
        const merged = mergeRecords(local, cloud);
        saveRecords(merged);
        if (JSON.stringify(merged) !== JSON.stringify(cloud)) {
            cloudPushRecords(merged).catch(() => {});
        }
        return merged;
    }

    // Helper: update a "highest is best" record
    function updateMax(records, key, value, name, date) {
        if (records[key] === null || value > records[key].value) {
            records[key] = { value, name, date };
            return true;
        }
        return false;
    }

    // Helper: update a "lowest is best" record
    function updateMin(records, key, value, name, date) {
        if (records[key] === null || value < records[key].value) {
            records[key] = { value, name, date };
            return true;
        }
        return false;
    }

    // Walk forward through evolvesTo links to collect every stage of a Pokemon's line
    function getEvolutionChain(id) {
        const chain = new Set();
        let current = id;
        while (current != null && !chain.has(current)) {
            chain.add(current);
            const data = PT.Data.Pokemon.find(p => p.id === current);
            current = data ? data.evolvesTo : null;
        }
        return chain;
    }

    // Called at end of every run (victory or gameover)
    function updateRecords(state, score) {
        const records = getRecords();
        const name = state.trainerName;
        const date = new Date().toLocaleDateString();
        const won = state.hasWon;
        const kantoWon = PT.Engine.Scoring.getKantoE4Cleared(state);
        const days = state.daysElapsed;
        const caught = state.pokedexCaught.length;
        const money = state.resources.money || 0;

        records.totalRuns++;
        if (won) records.totalWins++;
        if (won) {
            // Difficulty levels (1-5, see data/difficulty-levels.js) — pre-level
            // saves default to 1. Backs the RECORDS screen's L2-L5 WINS rows.
            const level = state.difficultyLevel || 1;
            records.winsByLevel = records.winsByLevel || {};
            records.winsByLevel[level] = (records.winsByLevel[level] || 0) + 1;
        }
        if (kantoWon) records.totalKantoE4Wins++;
        if (state.johtoE4Cleared) records.totalJohtoE4Wins++;

        updateMax(records, 'highScore', score, name, date);

        // Fastest/slowest/fewest-catches "win" records use Kanto E4 clear, not
        // the full Red win — same "Kanto E4 is the win marker" convention as
        // the leaderboard's FASTEST WIN tab, so these aren't stuck at '---'
        // for every trainer who hasn't also beaten Red.
        if (kantoWon) {
            updateMin(records, 'fastestWin', days, name, date);
            updateMax(records, 'slowestWin', days, name, date);
            updateMin(records, 'fewestCatchesWin', caught, name, date);
        }

        updateMax(records, 'mostCatches', caught, name, date);
        updateMax(records, 'richestEnding', money, name, date);

        // Catch tally — every Pokemon caught this run, excluding the starter's whole evolution chain
        const starterChain = getEvolutionChain(state.pokedexCaught[0]);
        state.pokedexCaught.forEach(id => {
            if (starterChain.has(id)) return;
            records.catchTally[id] = (records.catchTally[id] || 0) + 1;
        });

        // Legendary catches
        const legendariesThisRun = state.pokedexCaught.filter(id => {
            const p = PT.Data.Pokemon.find(pk => pk.id === id);
            return p && p.rarity === 'legendary';
        }).length;
        records.totalLegendaryCatches += legendariesThisRun;

        // Hall of Fame — snapshot the party that actually beat Red (see
        // screens/red-capstone-screen.js's redEntryParty), falling back to
        // the Johto E4 entry snapshot or live party for older saves.
        if (won) {
            const team = (state.redEntryParty || state.e4EntryParty || state.party).map(p => ({
                id: p.id,
                name: p.name,
                spriteUrl: p.spriteUrl,
                battleStars: p.battleStars || 0
            }));
            records.hallOfFame.unshift({ name, date, team });
            records.hallOfFame = records.hallOfFame.slice(0, MAX_HALL_OF_FAME);
        }

        saveRecords(records);
        cloudPushRecords(records).catch(() => {});
        return records;
    }

    function clearRecords() {
        localStorage.removeItem(RECORDS_KEY);
        clearCloudRecords().catch(() => {});
    }

    PT.Engine.Records = {
        getRecords,
        updateRecords,
        clearRecords,
        syncRecordsOnLogin,
        reconcileLegacyWinCounts
    };
})();
