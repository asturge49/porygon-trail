// Porygon Trail - Scoring System
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function calculateScore(state) {
        let score = 0;
        const breakdown = {};

        // Victory bonus
        if (state.hasWon) {
            breakdown.victory = 2000;
            score += 2000;
        }

        // Healthy Pokemon at end
        const healthyCount = state.party.filter(p => p.status === 'healthy' && p.hp > 0).length;
        breakdown.healthyPokemon = healthyCount * 100;
        score += breakdown.healthyPokemon;

        // Speed bonus (fewer days = better)
        breakdown.speedBonus = Math.max(0, 500 - (state.daysElapsed * 10));
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

    function saveToLeaderboard(entry) {
        const leaderboard = getLeaderboard();
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        const top10 = leaderboard.slice(0, 10);
        try {
            localStorage.setItem('porygonTrail_leaderboard', JSON.stringify(top10));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
        return top10;
    }

    function getLeaderboard() {
        try {
            const data = localStorage.getItem('porygonTrail_leaderboard');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function clearLeaderboard() {
        localStorage.removeItem('porygonTrail_leaderboard');
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

        // If won, add surviving party as champions
        if (state.hasWon) {
            state.party.forEach(p => {
                if (p.hp > 0 && p.status !== 'fainted' && !dex.champions.includes(p.id)) {
                    dex.champions.push(p.id);
                }
            });
        }

        saveGlobalPokedex(dex);
        return dex;
    }

    function clearGlobalPokedex() {
        localStorage.removeItem(POKEDEX_KEY);
    }

    PT.Engine.Scoring = {
        calculateScore, saveToLeaderboard, getLeaderboard, clearLeaderboard,
        getGlobalPokedex, updateGlobalPokedex, clearGlobalPokedex
    };
})();
