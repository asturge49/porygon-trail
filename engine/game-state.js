// Porygon Trail - Game State
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function createNewGame(trainerName, starterId) {
        const seed = Date.now();
        const starterData = PT.Data.Pokemon.find(p => p.id === starterId);
        const starter = createPartyPokemon(starterData, 5);

        return {
            version: 1,
            trainerName: trainerName || 'RED',
            seed: seed,
            rng: PT.Engine.RNG.createRNG(seed),

            // Travel
            currentLocationIndex: 0,
            distanceTraveled: 0,
            daysElapsed: 0,
            pace: 'steady',
            weather: 'clear',
            starvingDays: 0,

            // Resources
            resources: {
                food: 50,
                pokeballs: 15,
                greatballs: 0,
                ultraballs: 0,
                potions: 5,
                superPotions: 0,
                repels: 3,
                rareCandy: 0,
                escapeRope: 1,
                money: 3000
            },

            // Party
            party: [starter],

            // Progress
            badges: [],
            keyItems: [],
            pokedexCaught: [starterId],
            pokedexSeen: [starterId],

            // Tracking
            eventsTriggered: [],
            teamRocketDefeated: 0,
            gymBattlesWon: 0,
            pokemonLost: 0,
            ballsWasted: 0,

            // Log
            log: [],

            // Status
            isGameOver: false,
            gameOverReason: null,
            hasWon: false,

            // Active repel counter
            repelSteps: 0
        };
    }

    function createPartyPokemon(data, level) {
        const maxHp = data.rarity === 'legendary' ? 5 :
                      data.rarity === 'rare' ? 4 : 3;
        const lv = level || data.baseLevel || 5;
        return {
            id: data.id,
            name: data.name,
            types: data.types,
            rarity: data.rarity,
            level: lv,
            xp: 0,
            xpToNext: lv * 20,
            hp: maxHp,
            maxHp: maxHp,
            status: 'healthy',
            travelAbility: data.travelAbility,
            spriteUrl: getSpriteUrl(data.id)
        };
    }

    function getSpriteUrl(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/${id}.png`;
    }

    function addToLog(state, message) {
        state.log.unshift({ day: state.daysElapsed, text: message });
        if (state.log.length > 50) state.log.pop();
    }

    function healPokemon(pokemon, amount) {
        if (pokemon.status === 'fainted') return false;
        pokemon.hp = Math.min(pokemon.hp + amount, pokemon.maxHp);
        if (pokemon.status === 'poisoned' || pokemon.status === 'paralyzed') {
            pokemon.status = 'healthy';
        }
        return true;
    }

    function damagePokemon(pokemon, amount) {
        pokemon.hp = Math.max(0, pokemon.hp - amount);
        if (pokemon.hp <= 0) {
            pokemon.hp = 0;
            pokemon.status = 'fainted';
            return true; // fainted
        }
        return false;
    }

    function getAliveParty(state) {
        return state.party.filter(p => p.status !== 'fainted');
    }

    function hasAbility(state, ability) {
        return getAliveParty(state).some(p => p.travelAbility === ability);
    }

    function hasType(state, type) {
        return getAliveParty(state).some(p => p.types.includes(type));
    }

    function getCurrentRoute(state) {
        return PT.Data.Routes[state.currentLocationIndex];
    }

    function getNextRoute(state) {
        const next = state.currentLocationIndex + 1;
        if (next >= PT.Data.Routes.length) return null;
        return PT.Data.Routes[next];
    }

    // XP System
    function awardXP(pokemon, amount) {
        if (pokemon.status === 'fainted' || amount <= 0) return { leveled: false };
        pokemon.xp += amount;
        if (pokemon.xp >= pokemon.xpToNext) {
            pokemon.xp -= pokemon.xpToNext;
            pokemon.level += 1;
            pokemon.xpToNext = pokemon.level * 20;
            // +1 maxHp every 5 levels, capped at 6
            if (pokemon.level % 5 === 0 && pokemon.maxHp < 6) {
                pokemon.maxHp += 1;
            }
            // Heal 1 HP on level-up
            pokemon.hp = Math.min(pokemon.hp + 1, pokemon.maxHp);
            return { leveled: true, newLevel: pokemon.level, name: pokemon.name };
        }
        return { leveled: false };
    }

    function awardPartyXP(state, totalXP) {
        const alive = getAliveParty(state);
        if (alive.length === 0 || totalXP <= 0) return [];
        const perPokemon = Math.ceil(totalXP / alive.length);
        const results = [];
        alive.forEach(p => {
            const result = awardXP(p, perPokemon);
            if (result.leveled) results.push(result);
        });
        return results;
    }

    function formatLevelUps(levelUps) {
        if (!levelUps || levelUps.length === 0) return '';
        return levelUps.map(r => `${r.name} grew to Lv.${r.newLevel}!`).join(' ');
    }

    PT.Engine.GameState = {
        createNewGame,
        createPartyPokemon,
        getSpriteUrl,
        addToLog,
        healPokemon,
        damagePokemon,
        getAliveParty,
        hasAbility,
        hasType,
        getCurrentRoute,
        getNextRoute,
        awardXP,
        awardPartyXP,
        formatLevelUps
    };
})();
