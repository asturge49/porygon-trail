// Porygon Trail - Kanto Routes
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.Routes = [
        {
            id: "pallet_town",
            name: "Pallet Town",
            description: "A quiet town where your journey begins.",
            distanceToNext: 12,
            terrain: "town",
            hasShop: false,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 15,
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
            id: "route_1",
            name: "Route 1",
            description: "A short path through tall grass to Viridian City.",
            distanceToNext: 40,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 16, weight: 40 },  // Pidgey
                { pokemonId: 19, weight: 40 },  // Rattata
                { pokemonId: 10, weight: 10 },  // Caterpie
                { pokemonId: 13, weight: 10 }   // Weedle
            ],
            eventPool: ["prof_oak_advice", "mysterious_package", "joey_rattata", "route1_ledge_shortcut"],
            flavor: "Tall grass rustles in the breeze. Wild Pokemon are everywhere."
        },
        {
            id: "viridian_city",
            name: "Viridian City",
            description: "A small city with a Pokemon Center and Mart.",
            distanceToNext: 12,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 15,
            encounterTable: [
                { pokemonId: 16, weight: 25 },  // Pidgey
                { pokemonId: 19, weight: 25 },  // Rattata
                { pokemonId: 10, weight: 20 },  // Caterpie
                { pokemonId: 13, weight: 20 },  // Weedle
                { pokemonId: 29, weight: 5 },   // Nidoran F
                { pokemonId: 32, weight: 5 }    // Nidoran M
            ],
            eventPool: ["nurse_joy", "old_man_tutorial", "mysterious_package", "old_man_last_lesson", "viridian_pikachu_chase"],
            flavor: "Viridian Forest looms to the north. The local shop has basic supplies."
        },
        {
            id: "viridian_forest",
            name: "Viridian Forest",
            description: "A dense forest crawling with Bug-types.",
            distanceToNext: 50,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 10, weight: 25 },  // Caterpie
                { pokemonId: 11, weight: 10 },  // Metapod
                { pokemonId: 13, weight: 25 },  // Weedle
                { pokemonId: 14, weight: 10 },  // Kakuna
                { pokemonId: 16, weight: 15 },  // Pidgey
                { pokemonId: 25, weight: 5 },   // Pikachu
                { pokemonId: 46, weight: 10 }   // Paras
            ],
            eventPool: ["team_rocket_ambush", "bug_catcher_gauntlet", "forest_samurai"],
            flavor: "Trees block the sunlight. Bug catchers lurk behind every bush."
        },
        {
            id: "pewter_city",
            name: "Pewter City",
            description: "A stone-gray city nestled between cliffs.",
            distanceToNext: 10,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "brock",
            encounterRate: 15,
            encounterTable: [
                { pokemonId: 74, weight: 25 },  // Geodude
                { pokemonId: 27, weight: 20 },  // Sandshrew
                { pokemonId: 21, weight: 20 },  // Spearow
                { pokemonId: 23, weight: 15 },  // Ekans
                { pokemonId: 56, weight: 12 },  // Mankey
                { pokemonId: 39, weight: 8 }    // Jigglypuff
            ],
            eventPool: ["museum_visit", "brock_roadblock", "fossil_merchant", "pewter_museum_heist", "brock_secret_breeder"],
            flavor: "The Pewter Museum stands tall. Brock's Gym awaits challengers."
        },
        {
            id: "mt_moon",
            name: "Mt. Moon",
            description: "A treacherous cave filled with Zubat and mystery.",
            distanceToNext: 57,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
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
            eventPool: ["team_rocket_ambush", "fossil_discovery", "moon_stone_event", "cave_collapse", "clefairy_moon_dance"],
            flavor: "Darkness surrounds you. Strange sounds echo through the cavern."
        },
        {
            id: "cerulean_city",
            name: "Cerulean City",
            description: "A beautiful city with flowing water.",
            distanceToNext: 12,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "misty",
            encounterRate: 15,
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
            id: "route_5",
            name: "Route 5",
            description: "The road south from Cerulean toward the underground passage.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 16, weight: 15 },  // Pidgey
                { pokemonId: 52, weight: 15 },  // Meowth
                { pokemonId: 43, weight: 18 },  // Oddish
                { pokemonId: 69, weight: 18 },  // Bellsprout
                { pokemonId: 39, weight: 12 },  // Jigglypuff
                { pokemonId: 63, weight: 8 },   // Abra
                { pokemonId: 96, weight: 14 }   // Drowzee
            ],
            eventPool: ["daycare_dilemma", "mysterious_package", "underground_path_dealer", "pokemon_fan_club"],
            flavor: "The Daycare sits along the road. Trainers patrol the grass."
        },
        {
            id: "route_6",
            name: "Route 6",
            description: "The underground passage leads out to Vermilion City.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 16, weight: 12 },  // Pidgey
                { pokemonId: 52, weight: 15 },  // Meowth
                { pokemonId: 56, weight: 15 },  // Mankey
                { pokemonId: 69, weight: 12 },  // Bellsprout
                { pokemonId: 43, weight: 12 },  // Oddish
                { pokemonId: 39, weight: 10 },  // Jigglypuff
                { pokemonId: 96, weight: 14 },  // Drowzee
                { pokemonId: 100, weight: 10 }  // Voltorb
            ],
            eventPool: ["mysterious_package", "team_rocket_ambush", "digletts_cave_detour", "vermilion_dock_workers"],
            flavor: "The underground path is dark and damp. Vermilion's port looms ahead."
        },
        {
            id: "vermilion_city",
            name: "Vermilion City",
            description: "A port city buzzing with electric energy.",
            distanceToNext: 10,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "lt_surge",
            encounterRate: 15,
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
            id: "route_8",
            name: "Route 8",
            description: "A well-traveled road east of Saffron City.",
            distanceToNext: 37,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 23, weight: 15 },  // Ekans
                { pokemonId: 37, weight: 12 },  // Vulpix
                { pokemonId: 58, weight: 12 },  // Growlithe
                { pokemonId: 52, weight: 15 },  // Meowth
                { pokemonId: 96, weight: 15 },  // Drowzee
                { pokemonId: 100, weight: 10 }, // Voltorb
                { pokemonId: 81, weight: 10 },  // Magnemite
                { pokemonId: 104, weight: 11 }  // Cubone
            ],
            eventPool: ["team_rocket_ambush", "mysterious_package", "route8_gambler", "route8_ditto_encounter"],
            flavor: "Trainers line the route. The entrance to Rock Tunnel is up ahead."
        },
        {
            id: "rock_tunnel",
            name: "Rock Tunnel",
            description: "A pitch-black cave. Flash is essential.",
            distanceToNext: 47,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 41, weight: 25 },  // Zubat
                { pokemonId: 74, weight: 20 },  // Geodude
                { pokemonId: 95, weight: 8 },   // Onix
                { pokemonId: 66, weight: 12 },  // Machop
                { pokemonId: 104, weight: 12 }, // Cubone
                { pokemonId: 46, weight: 10 },  // Paras
                { pokemonId: 81, weight: 8 },   // Magnemite
                { pokemonId: 35, weight: 5 }    // Clefairy
            ],
            eventPool: ["cave_collapse", "team_rocket_ambush", "rock_tunnel_hiker", "rock_tunnel_fossil_wall"],
            flavor: "Total darkness. Every step echoes through the rock."
        },
        {
            id: "lavender_town",
            name: "Lavender Town",
            description: "A small town haunted by restless spirits.",
            distanceToNext: 10,
            terrain: "town",
            hasShop: true,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 35,
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
            id: "route_8_celadon",
            name: "Route 7",
            description: "A short route connecting Lavender Town to Celadon City.",
            distanceToNext: 40,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 37, weight: 15 },  // Vulpix
                { pokemonId: 58, weight: 15 },  // Growlithe
                { pokemonId: 52, weight: 15 },  // Meowth
                { pokemonId: 21, weight: 15 },  // Spearow
                { pokemonId: 48, weight: 15 },  // Venonat
                { pokemonId: 96, weight: 15 },  // Drowzee
                { pokemonId: 132, weight: 10 }  // Ditto
            ],
            eventPool: ["team_rocket_ambush", "mysterious_package", "route7_snorlax_roadblock", "route8_ditto_encounter"],
            flavor: "The path winds between the hills. Celadon's lights glow on the horizon."
        },
        {
            id: "celadon_city",
            name: "Celadon City",
            description: "The largest city in Kanto. Shopping paradise.",
            distanceToNext: 8,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "erika",
            encounterRate: 15,
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
            distanceToNext: 12,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "sabrina",
            encounterRate: 15,
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
            id: "cycling_road",
            name: "Cycling Road",
            description: "A steep downhill road popular with bikers.",
            distanceToNext: 57,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 84, weight: 20 },  // Doduo
                { pokemonId: 85, weight: 8 },   // Dodrio
                { pokemonId: 109, weight: 15 }, // Koffing
                { pokemonId: 88, weight: 15 },  // Grimer
                { pokemonId: 21, weight: 15 },  // Spearow
                { pokemonId: 22, weight: 8 },   // Fearow
                { pokemonId: 100, weight: 10 }, // Voltorb
                { pokemonId: 56, weight: 9 }    // Mankey
            ],
            eventPool: ["team_rocket_ambush", "biker_gang_standoff", "cycling_road_bikers", "cycling_road_downhill"],
            flavor: "The wind whips past as bikers race downhill. No brakes."
        },
        {
            id: "fuchsia_city",
            name: "Fuchsia City",
            description: "Home of the Safari Zone and a ninja gym.",
            distanceToNext: 12,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "koga",
            encounterRate: 15,
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
            eventPool: ["safari_zone", "koga_invisible_walls", "warden_teeth", "rare_pokemon_sighting", "warden_gold_teeth", "koga_invisible_trial"],
            flavor: "The Safari Zone gates stand open. Koga's gym is full of invisible walls."
        },
        {
            id: "sea_route_19",
            name: "Sea Route 19",
            description: "The first stretch of open ocean south of Fuchsia.",
            distanceToNext: 42,
            terrain: "water",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 72, weight: 30 },  // Tentacool
                { pokemonId: 129, weight: 25 }, // Magikarp
                { pokemonId: 116, weight: 15 }, // Horsea
                { pokemonId: 120, weight: 10 }, // Staryu
                { pokemonId: 98, weight: 12 },  // Krabby
                { pokemonId: 86, weight: 8 }    // Seel
            ],
            eventPool: ["stranded_swimmer", "strong_current", "tentacool_swarm", "sea_route19_swimmers"],
            flavor: "Waves crash against you. The open sea stretches south."
        },
        {
            id: "sea_route_20",
            name: "Sea Route 20",
            description: "Deep ocean waters approaching the Seafoam Islands.",
            distanceToNext: 42,
            terrain: "water",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 72, weight: 25 },  // Tentacool
                { pokemonId: 73, weight: 10 },  // Tentacruel
                { pokemonId: 116, weight: 15 }, // Horsea
                { pokemonId: 117, weight: 5 },  // Seadra
                { pokemonId: 129, weight: 15 }, // Magikarp
                { pokemonId: 120, weight: 10 }, // Staryu
                { pokemonId: 86, weight: 10 },  // Seel
                { pokemonId: 131, weight: 3 },  // Lapras
                { pokemonId: 90, weight: 7 }    // Shellder
            ],
            eventPool: ["stranded_swimmer", "strong_current", "sea_route20_shipwreck", "sea_route20_lapras_pod"],
            flavor: "The currents grow stronger. Seafoam Islands shimmer in the distance."
        },
        {
            id: "seafoam_islands",
            name: "Seafoam Islands",
            description: "Frozen caves surrounded by treacherous seas.",
            distanceToNext: 50,
            terrain: "water",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
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
            eventPool: ["articuno_encounter", "ice_cave_puzzle", "strong_current", "frozen_trainer", "seafoam_frozen_trainer", "seafoam_current_sacrifice"],
            flavor: "Ice crystals shimmer in the dark. The cave grows colder with each step."
        },
        {
            id: "cinnabar_island",
            name: "Cinnabar Island",
            description: "A volcanic island with a research lab.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "blaine",
            encounterRate: 35,
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
            eventPool: ["pokemon_mansion", "mewtwo_journal", "fossil_revival", "blaine_quiz", "cinnabar_experiment", "cinnabar_missingno"],
            flavor: "Volcanic heat rises from the ground. The abandoned Pokemon Mansion hides secrets."
        },
        {
            id: "route_21",
            name: "Route 21",
            description: "A long ocean route back to the mainland.",
            distanceToNext: 57,
            terrain: "water",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 72, weight: 25 },  // Tentacool
                { pokemonId: 73, weight: 10 },  // Tentacruel
                { pokemonId: 116, weight: 15 }, // Horsea
                { pokemonId: 117, weight: 8 },  // Seadra
                { pokemonId: 129, weight: 15 }, // Magikarp
                { pokemonId: 130, weight: 3 },  // Gyarados
                { pokemonId: 90, weight: 12 },  // Shellder
                { pokemonId: 99, weight: 8 },   // Kingler
                { pokemonId: 131, weight: 4 }   // Lapras
            ],
            eventPool: ["stranded_swimmer", "strong_current", "route21_fisherman", "route21_homecoming"],
            flavor: "The mainland comes into view. Almost home."
        },
        {
            id: "viridian_city_return",
            name: "Viridian City",
            description: "The final gym awaits. Giovanni is here.",
            distanceToNext: 12,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "giovanni",
            encounterRate: 15,
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
            eventPool: ["giovanni_reveal", "team_rocket_final", "gary_final_rival", "giovanni_final_offer", "gary_last_stand"],
            flavor: "You've come full circle. The gym that was once locked now opens its doors."
        },
        {
            id: "route_22",
            name: "Route 22",
            description: "The western road from Viridian toward the Pokemon League.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 22, weight: 15 },  // Fearow
                { pokemonId: 20, weight: 15 },  // Raticate
                { pokemonId: 57, weight: 12 },  // Primeape
                { pokemonId: 51, weight: 10 },  // Dugtrio
                { pokemonId: 28, weight: 10 },  // Sandslash
                { pokemonId: 24, weight: 10 },  // Arbok
                { pokemonId: 30, weight: 8 },   // Nidorina
                { pokemonId: 33, weight: 8 },   // Nidorino
                { pokemonId: 85, weight: 5 },   // Dodrio
                { pokemonId: 47, weight: 7 }    // Parasect
            ],
            eventPool: ["gary_final_rival", "gary_last_stand", "route22_rival_ambush", "route22_nidoran_pair"],
            flavor: "The road west of Viridian. Your rival's presence lingers."
        },
        {
            id: "route_23",
            name: "Route 23",
            description: "Badge check gates line the path to Victory Road.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 22, weight: 12 },  // Fearow
                { pokemonId: 20, weight: 12 },  // Raticate
                { pokemonId: 57, weight: 10 },  // Primeape
                { pokemonId: 51, weight: 10 },  // Dugtrio
                { pokemonId: 28, weight: 10 },  // Sandslash
                { pokemonId: 42, weight: 10 },  // Golbat
                { pokemonId: 30, weight: 8 },   // Nidorina
                { pokemonId: 33, weight: 8 },   // Nidorino
                { pokemonId: 85, weight: 8 },   // Dodrio
                { pokemonId: 75, weight: 7 },   // Graveler
                { pokemonId: 105, weight: 5 }   // Marowak
            ],
            eventPool: ["gary_final_rival", "route23_badge_gates", "route23_veteran_advice"],
            flavor: "Badge check gates loom ahead. Only the worthy may pass."
        },
        {
            id: "victory_road",
            name: "Victory Road",
            description: "The most treacherous cave in Kanto. The ultimate test.",
            distanceToNext: 77,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 66, weight: 8 },   // Machop
                { pokemonId: 67, weight: 12 },  // Machoke
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
            eventPool: ["victory_road_cave", "champion_battle", "mewtwo_cave", "victory_road_guardian", "champion_ghost", "vr_fallen_trainer", "vr_underground_stream", "vr_rival_campfire", "vr_cave_in", "vr_veteran_trainer", "vr_fossil_cache", "vr_moltres_shadow", "vr_darkness_maze", "vr_last_chance_merchant"],
            flavor: "The longest, darkest cave in Kanto. Many trainers never emerge."
        },
        {
            id: "indigo_plateau",
            name: "Indigo Plateau",
            description: "The Pokemon League headquarters. Your final stop.",
            distanceToNext: 8,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["indigo_plateau_nurse_joy"],
            flavor: "You've made it. The Pokemon League stands before you."
        },
        {
            id: "pokemon_league",
            name: "Pokemon League",
            description: "The Elite Four and Champion await.",
            distanceToNext: 0,
            terrain: "mountain",
            hasShop: false,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 0,
            encounterTable: [],
            eventPool: [],
            flavor: "The doors to the Pokemon League open. There is no turning back."
        }
    ];
})();
