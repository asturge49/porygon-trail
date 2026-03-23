// Porygon Trail - Kanto Routes
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.Routes = [
        {
            id: "pallet_town",
            name: "Pallet Town",
            description: "A quiet town where your journey begins.",
            distanceToNext: 25,
            terrain: "town",
            hasShop: false,
            hasGym: false,
            gymLeader: null,
            encounterTable: [
                { pokemonId: 16, weight: 35 },  // Pidgey
                { pokemonId: 19, weight: 35 },  // Rattata
                { pokemonId: 43, weight: 15 },  // Oddish
                { pokemonId: 69, weight: 15 }   // Bellsprout
            ],
            eventPool: ["prof_oak_advice", "gary_rival", "ash_pikachu_challenge"],
            flavor: "The smell of fresh grass fills the air. Mom waves goodbye from the doorstep."
        },
        {
            id: "viridian_city",
            name: "Viridian City",
            description: "A small city with a Pokemon Center and Mart.",
            distanceToNext: 40,
            terrain: "city",
            hasShop: true,
            hasGym: false,
            gymLeader: null,
            encounterTable: [
                { pokemonId: 16, weight: 25 },  // Pidgey
                { pokemonId: 19, weight: 25 },  // Rattata
                { pokemonId: 10, weight: 20 },  // Caterpie
                { pokemonId: 13, weight: 20 },  // Weedle
                { pokemonId: 29, weight: 5 },   // Nidoran F
                { pokemonId: 32, weight: 5 }    // Nidoran M
            ],
            eventPool: ["nurse_joy", "old_man_tutorial", "mysterious_package"],
            flavor: "Viridian Forest looms to the north. The local shop has basic supplies."
        },
        {
            id: "pewter_city",
            name: "Pewter City",
            description: "A stone-gray city nestled between cliffs.",
            distanceToNext: 35,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "brock",
            encounterTable: [
                { pokemonId: 74, weight: 25 },  // Geodude
                { pokemonId: 27, weight: 20 },  // Sandshrew
                { pokemonId: 21, weight: 20 },  // Spearow
                { pokemonId: 23, weight: 15 },  // Ekans
                { pokemonId: 56, weight: 12 },  // Mankey
                { pokemonId: 39, weight: 8 }    // Jigglypuff
            ],
            eventPool: ["museum_visit", "brock_roadblock", "fossil_merchant"],
            flavor: "The Pewter Museum stands tall. Brock's Gym awaits challengers."
        },
        {
            id: "mt_moon",
            name: "Mt. Moon",
            description: "A treacherous cave filled with Zubat and mystery.",
            distanceToNext: 30,
            terrain: "cave",
            hasShop: false,
            hasGym: false,
            gymLeader: null,
            encounterTable: [
                { pokemonId: 41, weight: 30 },  // Zubat
                { pokemonId: 74, weight: 20 },  // Geodude
                { pokemonId: 46, weight: 15 },  // Paras
                { pokemonId: 35, weight: 10 },  // Clefairy
                { pokemonId: 27, weight: 8 },   // Sandshrew
                { pokemonId: 95, weight: 5 },   // Onix
                { pokemonId: 104, weight: 5 },  // Cubone
                { pokemonId: 39, weight: 7 }    // Jigglypuff
            ],
            eventPool: ["team_rocket_ambush", "fossil_discovery", "moon_stone_event", "cave_collapse"],
            flavor: "Darkness surrounds you. Strange sounds echo through the cavern."
        },
        {
            id: "cerulean_city",
            name: "Cerulean City",
            description: "A beautiful city with flowing water.",
            distanceToNext: 45,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "misty",
            encounterTable: [
                { pokemonId: 54, weight: 20 },  // Psyduck
                { pokemonId: 118, weight: 15 }, // Goldeen
                { pokemonId: 120, weight: 12 }, // Staryu
                { pokemonId: 129, weight: 18 }, // Magikarp
                { pokemonId: 60, weight: 12 },  // Poliwag
                { pokemonId: 63, weight: 5 },   // Abra
                { pokemonId: 79, weight: 10 },  // Slowpoke
                { pokemonId: 98, weight: 8 }    // Krabby
            ],
            eventPool: ["nugget_bridge", "team_rocket_ambush", "misty_fishing", "bill_event", "nugget_bridge_gauntlet", "power_plant_overload"],
            flavor: "The sound of flowing water fills the air. Nugget Bridge stretches north."
        },
        {
            id: "vermilion_city",
            name: "Vermilion City",
            description: "A port city buzzing with electric energy.",
            distanceToNext: 40,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "lt_surge",
            encounterTable: [
                { pokemonId: 25, weight: 12 },  // Pikachu
                { pokemonId: 50, weight: 18 },  // Diglett
                { pokemonId: 100, weight: 12 }, // Voltorb
                { pokemonId: 81, weight: 12 },  // Magnemite
                { pokemonId: 52, weight: 12 },  // Meowth
                { pokemonId: 21, weight: 8 },   // Spearow
                { pokemonId: 96, weight: 8 },   // Drowzee
                { pokemonId: 83, weight: 3 },   // Farfetch'd
                { pokemonId: 98, weight: 8 },   // Krabby
                { pokemonId: 125, weight: 4 },  // Electabuzz
                { pokemonId: 84, weight: 3 }    // Doduo
            ],
            eventPool: ["ss_anne_event", "lt_surge_trash_cans", "diglett_cave_shortcut", "magikarp_salesman", "surge_minefield"],
            flavor: "The S.S. Anne docks at the harbor. Lt. Surge's gym crackles with electricity."
        },
        {
            id: "lavender_town",
            name: "Lavender Town",
            description: "A small town haunted by restless spirits.",
            distanceToNext: 30,
            terrain: "town",
            hasShop: true,
            hasGym: false,
            gymLeader: null,
            encounterTable: [
                { pokemonId: 92, weight: 30 },  // Gastly
                { pokemonId: 93, weight: 15 },  // Haunter
                { pokemonId: 104, weight: 20 }, // Cubone
                { pokemonId: 41, weight: 15 },  // Zubat
                { pokemonId: 96, weight: 10 },  // Drowzee
                { pokemonId: 48, weight: 10 }   // Venonat
            ],
            eventPool: ["ghost_encounter", "pokemon_tower", "channeler_curse", "mr_fuji_rescue", "cubone_mother", "drowzee_dream", "mr_fuji_blessing", "ghost_rival_past"],
            flavor: "An eerie melody plays somewhere. The Pokemon Tower looms overhead."
        },
        {
            id: "celadon_city",
            name: "Celadon City",
            description: "The largest city in Kanto. Shopping paradise.",
            distanceToNext: 20,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "erika",
            encounterTable: [
                { pokemonId: 43, weight: 18 },  // Oddish
                { pokemonId: 44, weight: 8 },   // Gloom
                { pokemonId: 69, weight: 18 },  // Bellsprout
                { pokemonId: 102, weight: 12 }, // Exeggcute
                { pokemonId: 114, weight: 8 },  // Tangela
                { pokemonId: 133, weight: 5 },  // Eevee
                { pokemonId: 37, weight: 8 },   // Vulpix
                { pokemonId: 58, weight: 8 },   // Growlithe
                { pokemonId: 143, weight: 3 },  // Snorlax
                { pokemonId: 108, weight: 4 },  // Lickitung
                { pokemonId: 84, weight: 8 }    // Doduo
            ],
            eventPool: ["game_corner", "team_rocket_hideout", "dept_store_sale", "eevee_gift", "game_corner_porygon", "eevee_rooftop", "rocket_shakedown"],
            flavor: "Neon lights and the scent of perfume. The Game Corner beckons."
        },
        {
            id: "saffron_city",
            name: "Saffron City",
            description: "Kanto's central metropolis. Silph Co. headquarters.",
            distanceToNext: 50,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "sabrina",
            encounterTable: [
                { pokemonId: 63, weight: 18 },  // Abra
                { pokemonId: 64, weight: 8 },   // Kadabra
                { pokemonId: 96, weight: 18 },  // Drowzee
                { pokemonId: 97, weight: 8 },   // Hypno
                { pokemonId: 122, weight: 5 },  // Mr. Mime
                { pokemonId: 106, weight: 5 },  // Hitmonlee
                { pokemonId: 107, weight: 5 },  // Hitmonchan
                { pokemonId: 132, weight: 8 },  // Ditto
                { pokemonId: 137, weight: 5 },  // Porygon
                { pokemonId: 52, weight: 8 },   // Meowth
                { pokemonId: 143, weight: 3 },  // Snorlax
                { pokemonId: 124, weight: 4 },  // Jynx
                { pokemonId: 108, weight: 5 }   // Lickitung
            ],
            eventPool: ["silph_co_siege", "team_rocket_ambush", "fighting_dojo", "lapras_gift", "copycat_ditto"],
            flavor: "Silph Co. towers over everything. Something sinister is happening inside."
        },
        {
            id: "fuchsia_city",
            name: "Fuchsia City",
            description: "Home of the Safari Zone and a ninja gym.",
            distanceToNext: 55,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "koga",
            encounterTable: [
                { pokemonId: 48, weight: 12 },  // Venonat
                { pokemonId: 49, weight: 8 },   // Venomoth
                { pokemonId: 109, weight: 12 }, // Koffing
                { pokemonId: 88, weight: 12 },  // Grimer
                { pokemonId: 128, weight: 5 },  // Tauros
                { pokemonId: 115, weight: 5 },  // Kangaskhan
                { pokemonId: 123, weight: 5 },  // Scyther
                { pokemonId: 127, weight: 5 },  // Pinsir
                { pokemonId: 113, weight: 5 },  // Chansey
                { pokemonId: 147, weight: 5 },  // Dratini
                { pokemonId: 111, weight: 8 },  // Rhyhorn
                { pokemonId: 84, weight: 8 },   // Doduo
                { pokemonId: 85, weight: 3 },   // Dodrio
                { pokemonId: 108, weight: 4 },  // Lickitung
                { pokemonId: 79, weight: 3 }    // Slowpoke
            ],
            eventPool: ["safari_zone", "koga_invisible_walls", "warden_teeth", "rare_pokemon_sighting"],
            flavor: "The Safari Zone gates stand open. Koga's gym is full of invisible walls."
        },
        {
            id: "seafoam_islands",
            name: "Seafoam Islands",
            description: "Frozen caves surrounded by treacherous seas.",
            distanceToNext: 30,
            terrain: "water",
            hasShop: false,
            hasGym: false,
            gymLeader: null,
            encounterTable: [
                { pokemonId: 86, weight: 18 },  // Seel
                { pokemonId: 87, weight: 8 },   // Dewgong
                { pokemonId: 90, weight: 18 },  // Shellder
                { pokemonId: 116, weight: 12 }, // Horsea
                { pokemonId: 117, weight: 8 },  // Seadra
                { pokemonId: 72, weight: 12 },  // Tentacool
                { pokemonId: 131, weight: 5 },  // Lapras
                { pokemonId: 144, weight: 2 },  // Articuno
                { pokemonId: 120, weight: 3 },  // Staryu
                { pokemonId: 124, weight: 5 },  // Jynx
                { pokemonId: 79, weight: 5 },   // Slowpoke
                { pokemonId: 98, weight: 4 }    // Krabby
            ],
            eventPool: ["articuno_encounter", "ice_cave_puzzle", "strong_current", "frozen_trainer"],
            flavor: "Ice crystals shimmer in the dark. The cave grows colder with each step."
        },
        {
            id: "cinnabar_island",
            name: "Cinnabar Island",
            description: "A volcanic island with a research lab.",
            distanceToNext: 60,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "blaine",
            encounterTable: [
                { pokemonId: 58, weight: 15 },  // Growlithe
                { pokemonId: 77, weight: 15 },  // Ponyta
                { pokemonId: 126, weight: 10 }, // Magmar
                { pokemonId: 37, weight: 15 },  // Vulpix
                { pokemonId: 109, weight: 10 }, // Koffing
                { pokemonId: 88, weight: 10 },  // Grimer
                { pokemonId: 146, weight: 2 },  // Moltres
                { pokemonId: 138, weight: 5 },  // Omanyte
                { pokemonId: 140, weight: 5 },  // Kabuto
                { pokemonId: 142, weight: 3 },  // Aerodactyl
                { pokemonId: 0, weight: 1 }     // MissingNo.
            ],
            eventPool: ["pokemon_mansion", "mewtwo_journal", "fossil_revival", "blaine_quiz", "cinnabar_experiment"],
            flavor: "Volcanic heat rises from the ground. The abandoned Pokemon Mansion hides secrets."
        },
        {
            id: "viridian_city_return",
            name: "Viridian City",
            description: "The final gym awaits. Giovanni is here.",
            distanceToNext: 50,
            terrain: "city",
            hasShop: true,
            hasGym: true,
            gymLeader: "giovanni",
            encounterTable: [
                { pokemonId: 20, weight: 15 },  // Raticate
                { pokemonId: 17, weight: 15 },  // Pidgeotto
                { pokemonId: 22, weight: 10 },  // Fearow
                { pokemonId: 24, weight: 10 },  // Arbok
                { pokemonId: 28, weight: 10 },  // Sandslash
                { pokemonId: 57, weight: 10 },  // Primeape
                { pokemonId: 51, weight: 10 },  // Dugtrio
                { pokemonId: 112, weight: 5 },  // Rhydon
                { pokemonId: 105, weight: 10 }, // Marowak
                { pokemonId: 145, weight: 2 },  // Zapdos
                { pokemonId: 53, weight: 3 }    // Persian
            ],
            eventPool: ["giovanni_reveal", "team_rocket_final", "gary_final_rival"],
            flavor: "You've come full circle. The gym that was once locked now opens its doors."
        },
        {
            id: "indigo_plateau",
            name: "Indigo Plateau",
            description: "Victory Road — the final stretch before the Pokemon League.",
            distanceToNext: 15,
            terrain: "mountain",
            hasShop: true,
            hasGym: false,
            gymLeader: null,
            encounterTable: [
                { pokemonId: 66, weight: 10 },  // Machop
                { pokemonId: 67, weight: 10 },  // Machoke
                { pokemonId: 95, weight: 10 },  // Onix
                { pokemonId: 75, weight: 15 },  // Graveler
                { pokemonId: 42, weight: 15 },  // Golbat
                { pokemonId: 105, weight: 10 }, // Marowak
                { pokemonId: 112, weight: 5 },  // Rhydon
                { pokemonId: 82, weight: 5 },   // Magneton
                { pokemonId: 101, weight: 5 },  // Electrode
                { pokemonId: 149, weight: 2 },  // Dragonite
                { pokemonId: 150, weight: 1 },  // Mewtwo
                { pokemonId: 148, weight: 7 },  // Dragonair
                { pokemonId: 18, weight: 5 }    // Pidgeot
            ],
            eventPool: ["victory_road_cave", "champion_battle", "mewtwo_cave"],
            flavor: "Victory Road stretches before you. Only the strongest trainers make it this far."
        },
        {
            id: "pokemon_league",
            name: "Pokemon League",
            description: "The Elite Four and Champion await.",
            distanceToNext: 0,
            terrain: "mountain",
            hasShop: false,
            hasGym: false,
            gymLeader: null,
            encounterTable: [],
            eventPool: [],
            flavor: "The doors to the Pokemon League open. There is no turning back."
        }
    ];
})();
