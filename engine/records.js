// Porygon Trail - Records System
// Persistent cross-playthrough records stored in localStorage
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const RECORDS_KEY = 'porygonTrail_records';

    function getRecords() {
        try {
            const data = localStorage.getItem(RECORDS_KEY);
            return data ? JSON.parse(data) : getDefaultRecords();
        } catch (e) {
            return getDefaultRecords();
        }
    }

    function getDefaultRecords() {
        return {
            totalRuns: 0,
            totalWins: 0,
            // Score
            highScore: null,           // { value, name, date }
            // Speed (wins only)
            fastestWin: null,          // { value (days), name, date }
            slowestWin: null,          // { value (days), name, date }
            // Catches
            mostCatches: null,         // { value, name, date }
            fewestCatchesWin: null,    // { value, name, date } — wins only
            // Pokemon fate
            mostLosses: null,          // { value, name, date }
            perfectRuns: 0,            // won with 0 pokemon deaths
            fullRosterWins: 0,         // won with 6 alive pokemon
            // Resources
            richestEnding: null,       // { value (money), name, date }
            // Journey
            longestRun: null,          // { value (days), name, date }
            shortestDeath: null,       // { value (days), name, date } — losses only
            furthestDeath: null,       // { value (location name), locationIndex, name, date }
            // Badges
            mostBadges: null,          // { value, name, date }
            // Battle
            mostGymWins: null,         // { value, name, date }
            mostRocketDefeats: null,   // { value, name, date }
            // Stars
            mostStars: null,           // { value (total team stars), name, date }
            // Tallies (frequency maps)
            starterTally: {},          // { pokemonId: count } — tracks starter picks
            catchTally: {},            // { pokemonId: count } — tracks all catches across runs
            totalLegendaryCatches: 0,  // cumulative legendary catches
            deathLocationTally: {},    // { locationName: count } — tracks where runs end
        };
    }

    function saveRecords(records) {
        try {
            localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
        } catch (e) {
            console.warn('Could not save records:', e);
        }
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

    // Called at end of every run (victory or gameover)
    function updateRecords(state, score) {
        const records = getRecords();
        const name = state.trainerName;
        const date = new Date().toLocaleDateString();
        const won = state.hasWon;
        const days = state.daysElapsed;
        const caught = state.pokedexCaught.length;
        const lost = state.pokemonLost || 0;
        const money = state.resources.money || 0;
        const badgeCount = state.badges.length;
        const gymWins = state.gymBattlesWon || 0;
        const rocketDefeats = state.teamRocketDefeated || 0;
        const totalStars = state.party.reduce((sum, p) => sum + (p.battleStars || 0), 0);
        const aliveCount = state.party.filter(p => p.status !== 'fainted' && p.hp > 0).length;

        // Counts
        records.totalRuns++;
        if (won) records.totalWins++;

        // Score
        updateMax(records, 'highScore', score, name, date);

        // Speed (wins only)
        if (won) {
            updateMin(records, 'fastestWin', days, name, date);
            updateMax(records, 'slowestWin', days, name, date);
        }

        // Catches
        updateMax(records, 'mostCatches', caught, name, date);
        if (won) {
            updateMin(records, 'fewestCatchesWin', caught, name, date);
        }

        // Pokemon fate
        updateMax(records, 'mostLosses', lost, name, date);
        if (won && lost === 0) records.perfectRuns++;
        if (won && aliveCount === 6) records.fullRosterWins++;

        // Resources
        updateMax(records, 'richestEnding', money, name, date);

        // Journey
        updateMax(records, 'longestRun', days, name, date);
        if (!won) {
            updateMin(records, 'shortestDeath', days, name, date);
            const route = PT.Engine.GameState.getCurrentRoute(state);
            if (route) {
                const locIdx = state.currentLocationIndex;
                if (records.furthestDeath === null || locIdx > records.furthestDeath.locationIndex) {
                    records.furthestDeath = { value: route.name, locationIndex: locIdx, name, date };
                }
            }
        }

        // Badges
        updateMax(records, 'mostBadges', badgeCount, name, date);

        // Battle
        updateMax(records, 'mostGymWins', gymWins, name, date);
        updateMax(records, 'mostRocketDefeats', rocketDefeats, name, date);

        // Stars
        updateMax(records, 'mostStars', totalStars, name, date);

        // Tallies — ensure they exist (for saves from before this update)
        if (!records.starterTally) records.starterTally = {};
        if (!records.catchTally) records.catchTally = {};
        if (!records.deathLocationTally) records.deathLocationTally = {};
        if (records.totalLegendaryCatches === undefined) records.totalLegendaryCatches = 0;

        // Starter tally — first pokedexCaught entry is always the starter
        const starterId = state.pokedexCaught[0];
        if (starterId !== undefined) {
            records.starterTally[starterId] = (records.starterTally[starterId] || 0) + 1;
        }

        // Catch tally — every Pokemon caught this run
        state.pokedexCaught.forEach(id => {
            records.catchTally[id] = (records.catchTally[id] || 0) + 1;
        });

        // Legendary catches
        const legendariesThisRun = state.pokedexCaught.filter(id => {
            const p = PT.Data.Pokemon.find(pk => pk.id === id);
            return p && p.rarity === 'legendary';
        }).length;
        records.totalLegendaryCatches += legendariesThisRun;

        // Death location tally
        if (!won) {
            const route = PT.Engine.GameState.getCurrentRoute(state);
            if (route) {
                records.deathLocationTally[route.name] = (records.deathLocationTally[route.name] || 0) + 1;
            }
        }

        saveRecords(records);
        return records;
    }

    function clearRecords() {
        localStorage.removeItem(RECORDS_KEY);
    }

    PT.Engine.Records = {
        getRecords,
        updateRecords,
        clearRecords
    };
})();
