// Porygon Trail - Trainer Classes
// Flat roster of trainer classes a run can encounter on the trail once
// difficulty level 2+ enables trainer battles (see engine/trainer-engine.js,
// which rolls one of these per route visit). `pokemonPool` entries are
// national-dex ids matching data/pokemon.js's numeric `id` convention (the
// same convention data/gym-leaders.js uses for its rosters) — NOT lowercase
// name keys.
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.Trainers = [
        // ===== KANTO (tiered — see engine/trainer-engine.js#getCurrentTier) =====
        {
            id: 'youngster_kanto', name: 'Youngster', region: 'kanto',
            tierMin: 1, tierMax: 1,
            terrain: ['route'], routeIds: [],
            pokemonPool: [19, 16], // Rattata, Pidgey
            spriteKey: 'youngster',
            rewardMoney: 250
        },
        {
            id: 'bug_catcher_kanto', name: 'Bug Catcher', region: 'kanto',
            tierMin: 1, tierMax: 1,
            terrain: [], routeIds: ['viridian_forest'],
            pokemonPool: [10, 13], // Caterpie, Weedle
            spriteKey: 'bug_catcher',
            rewardMoney: 250
        },
        {
            id: 'lass_kanto', name: 'Lass', region: 'kanto',
            tierMin: 1, tierMax: 1,
            terrain: ['town', 'city'], routeIds: [],
            pokemonPool: [29, 52], // Nidoran F, Meowth
            spriteKey: 'lass',
            rewardMoney: 250
        },
        {
            id: 'hiker_kanto', name: 'Hiker', region: 'kanto',
            tierMin: 2, tierMax: 2,
            terrain: ['cave'], routeIds: [],
            pokemonPool: [74, 41], // Geodude, Zubat
            spriteKey: 'hiker',
            rewardMoney: 300
        },
        {
            id: 'sailor_kanto', name: 'Sailor', region: 'kanto',
            tierMin: 2, tierMax: 2,
            terrain: [], routeIds: ['vermilion_city', 'route_8'],
            pokemonPool: [66, 72], // Machop, Tentacool
            spriteKey: 'sailor',
            rewardMoney: 300
        },
        {
            id: 'channeler_kanto', name: 'Channeler', region: 'kanto',
            tierMin: 2, tierMax: 2,
            terrain: [], routeIds: ['lavender_town'],
            pokemonPool: [92, 104], // Gastly, Cubone
            spriteKey: 'channeler',
            rewardMoney: 300
        },
        {
            id: 'psychic_kanto', name: 'Psychic', region: 'kanto',
            tierMin: 3, tierMax: 3,
            terrain: [], routeIds: ['saffron_city'],
            pokemonPool: [63, 96], // Abra, Drowzee
            spriteKey: 'psychic',
            rewardMoney: 350
        },
        {
            id: 'biker_kanto', name: 'Biker', region: 'kanto',
            tierMin: 3, tierMax: 3,
            terrain: [], routeIds: ['cycling_road'],
            pokemonPool: [109, 88], // Koffing, Grimer
            spriteKey: 'biker',
            rewardMoney: 350
        },
        {
            id: 'swimmer_kanto', name: 'Swimmer', region: 'kanto',
            tierMin: 3, tierMax: 3,
            terrain: ['water'], routeIds: [],
            pokemonPool: [116, 90], // Horsea, Shellder
            spriteKey: 'swimmer_kanto',
            rewardMoney: 350
        },
        {
            id: 'poke_maniac_kanto', name: 'Poke Maniac', region: 'kanto',
            tierMin: 3, tierMax: 3,
            terrain: [], routeIds: ['cinnabar_island'],
            pokemonPool: [140, 138], // Kabuto, Omanyte
            spriteKey: 'poke_maniac',
            rewardMoney: 350
        },
        {
            id: 'cooltrainer_kanto', name: 'Cooltrainer', region: 'kanto',
            tierMin: 4, tierMax: 4,
            terrain: ['route'], routeIds: [],
            pokemonPool: [58, 77], // Growlithe, Ponyta
            spriteKey: 'cooltrainer',
            rewardMoney: 400
        },
        {
            id: 'blackbelt_kanto', name: 'Blackbelt', region: 'kanto',
            tierMin: 4, tierMax: 4,
            terrain: ['cave'], routeIds: [],
            pokemonPool: [95, 75], // Onix, Graveler
            spriteKey: 'blackbelt',
            rewardMoney: 400
        },

        // ===== JOHTO (no tiering — flat reward) =====
        {
            id: 'bug_catcher_johto', name: 'Bug Catcher', region: 'johto',
            terrain: [], routeIds: ['national_park'],
            pokemonPool: [165, 167], // Ledyba, Spinarak
            spriteKey: 'bug_catcher',
            rewardMoney: 400
        },
        {
            id: 'hiker_johto', name: 'Hiker', region: 'johto',
            terrain: [], routeIds: ['union_cave', 'mt_mortar', 'ice_path'],
            pokemonPool: [95, 75], // Onix, Graveler
            spriteKey: 'hiker',
            rewardMoney: 400
        },
        {
            id: 'bird_keeper_johto', name: 'Bird Keeper', region: 'johto',
            terrain: [], routeIds: ['violet_city', 'route_32', 'route_33'],
            pokemonPool: [17, 163], // Pidgeotto, Hoothoot
            spriteKey: 'bird_keeper',
            rewardMoney: 400
        },
        {
            id: 'picnicker_johto', name: 'Picnicker', region: 'johto',
            terrain: ['route'], routeIds: [],
            pokemonPool: [69, 177], // Bellsprout, Natu
            spriteKey: 'picnicker',
            rewardMoney: 400
        },
        {
            id: 'sage_johto', name: 'Sage', region: 'johto',
            terrain: [], routeIds: ['ecruteak_city'],
            pokemonPool: [92, 93], // Gastly, Haunter
            spriteKey: 'sage',
            rewardMoney: 400
        },
        {
            id: 'swimmer_johto', name: 'Swimmer', region: 'johto',
            terrain: ['water'], routeIds: ['cianwood_city'],
            pokemonPool: [183, 211], // Marill, Qwilfish
            spriteKey: 'swimmer_johto',
            rewardMoney: 400
        },
        {
            id: 'dragon_tamer_johto', name: 'Dragon Tamer', region: 'johto',
            terrain: [], routeIds: ['blackthorn_city', 'dragons_den'],
            pokemonPool: [147, 116], // Dratini, Horsea
            spriteKey: 'dragon_tamer',
            rewardMoney: 400
        }
    ];
})();
