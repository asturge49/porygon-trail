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
            return data ? Object.assign(getDefaultRecords(), JSON.parse(data)) : getDefaultRecords();
        } catch (e) {
            return getDefaultRecords();
        }
    }

    function getDefaultRecords() {
        return {
            totalRuns: 0,
            totalWins: 0,
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
        const money = state.resources.money || 0;

        records.totalRuns++;
        if (won) records.totalWins++;

        updateMax(records, 'highScore', score, name, date);

        if (won) {
            updateMin(records, 'fastestWin', days, name, date);
            updateMax(records, 'slowestWin', days, name, date);
            updateMin(records, 'fewestCatchesWin', caught, name, date);
        }

        updateMax(records, 'mostCatches', caught, name, date);
        updateMax(records, 'richestEnding', money, name, date);

        // Catch tally — every Pokemon caught this run, excluding the starter's initial catch
        state.pokedexCaught.slice(1).forEach(id => {
            records.catchTally[id] = (records.catchTally[id] || 0) + 1;
        });

        // Legendary catches
        const legendariesThisRun = state.pokedexCaught.filter(id => {
            const p = PT.Data.Pokemon.find(pk => pk.id === id);
            return p && p.rarity === 'legendary';
        }).length;
        records.totalLegendaryCatches += legendariesThisRun;

        // Hall of Fame — snapshot the party that beat the Elite Four
        if (won) {
            const team = (state.e4EntryParty || state.party).map(p => ({
                id: p.id,
                name: p.name,
                spriteUrl: p.spriteUrl,
                battleStars: p.battleStars || 0
            }));
            records.hallOfFame.unshift({ name, date, team });
            records.hallOfFame = records.hallOfFame.slice(0, MAX_HALL_OF_FAME);
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
