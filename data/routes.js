// Porygon Trail - Kanto Routes
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.Routes = [
        {
            id: "pallet_town",
            region: "kanto",
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
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["nurse_joy", "mysterious_package", "old_man_last_lesson", "viridian_pikachu_chase"],
            flavor: "Viridian Forest looms to the north. The local shop has basic supplies."
        },
        {
            id: "viridian_forest",
            region: "kanto",
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
            eventPool: ["team_rocket_ambush", "forest_samurai"],
            flavor: "Trees block the sunlight. Bug catchers lurk behind every bush."
        },
        {
            id: "pewter_city",
            region: "kanto",
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
            eventPool: ["pewter_museum_heist", "brock_secret_breeder"],
            flavor: "The Pewter Museum stands tall. Brock's Gym awaits challengers."
        },
        {
            id: "mt_moon",
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["team_rocket_ambush", "nugget_bridge_gauntlet", "power_plant_overload"],
            flavor: "The sound of flowing water fills the air. Nugget Bridge stretches north."
        },
        {
            id: "route_5",
            region: "kanto",
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
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["ss_anne_event", "magikarp_salesman", "surge_minefield"],
            flavor: "The S.S. Anne docks at the harbor. Lt. Surge's gym crackles with electricity."
        },
        {
            id: "route_8",
            region: "kanto",
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
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["ghost_encounter", "cubone_mother", "drowzee_dream", "mr_fuji_blessing", "ghost_rival_past"],
            flavor: "An eerie melody plays somewhere. The Pokemon Tower looms overhead."
        },
        {
            id: "route_8_celadon",
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["team_rocket_hideout", "game_corner_porygon", "eevee_rooftop", "rocket_shakedown"],
            flavor: "Neon lights and the scent of perfume. The Game Corner beckons."
        },
        {
            id: "saffron_city",
            region: "kanto",
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
            eventPool: ["silph_co_siege", "team_rocket_ambush", "copycat_ditto"],
            flavor: "Silph Co. towers over everything. Something sinister is happening inside."
        },
        {
            id: "cycling_road",
            region: "kanto",
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
            eventPool: ["team_rocket_ambush", "cycling_road_bikers", "cycling_road_downhill"],
            flavor: "The wind whips past as bikers race downhill. No brakes."
        },
        {
            id: "fuchsia_city",
            region: "kanto",
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
            eventPool: ["safari_zone", "warden_gold_teeth", "koga_invisible_trial"],
            flavor: "The Safari Zone gates stand open. Koga's gym is full of invisible walls."
        },
        {
            id: "sea_route_19",
            region: "kanto",
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
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["articuno_encounter", "strong_current", "seafoam_frozen_trainer", "seafoam_current_sacrifice"],
            flavor: "Ice crystals shimmer in the dark. The cave grows colder with each step."
        },
        {
            id: "cinnabar_island",
            region: "kanto",
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
            eventPool: ["cinnabar_experiment", "cinnabar_missingno"],
            flavor: "Volcanic heat rises from the ground. The abandoned Pokemon Mansion hides secrets."
        },
        {
            id: "route_21",
            region: "kanto",
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
            region: "kanto",
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
            eventPool: ["team_rocket_final", "giovanni_final_offer", "gary_last_stand"],
            flavor: "You've come full circle. The gym that was once locked now opens its doors."
        },
        {
            id: "route_22",
            region: "kanto",
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
            eventPool: ["gary_last_stand", "route22_rival_ambush", "route22_nidoran_pair"],
            flavor: "The road west of Viridian. Your rival's presence lingers."
        },
        {
            id: "route_23",
            region: "kanto",
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
            eventPool: ["route23_badge_gates", "route23_veteran_advice"],
            flavor: "Badge check gates loom ahead. Only the worthy may pass."
        },
        {
            id: "victory_road",
            region: "kanto",
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
            eventPool: ["victory_road_cave", "mewtwo_cave", "victory_road_guardian", "champion_ghost", "vr_fallen_trainer", "vr_underground_stream", "vr_rival_campfire", "vr_cave_in", "vr_veteran_trainer", "vr_fossil_cache", "vr_moltres_shadow", "vr_darkness_maze", "vr_last_chance_merchant"],
            flavor: "The longest, darkest cave in Kanto. Many trainers never emerge."
        },
        {
            id: "indigo_plateau",
            region: "kanto",
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
            region: "kanto",
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
        },
        {
            id: "new_bark_town",
            region: "johto",
            name: "New Bark Town",
            description: "A small town where the winds of a new adventure begin.",
            distanceToNext: 18,
            terrain: "town",
            hasShop: false,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["new_bark_elm_lab_visit", "new_bark_rival_intro", "new_bark_elm_assistant_errand"],
            flavor: "Professor Elm's lab hums with quiet excitement. Your Johto journey starts here."
        },
        {
            id: "route_29",
            region: "johto",
            name: "Route 29",
            description: "A winding grassy path east out of New Bark Town.",
            distanceToNext: 65,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 161, weight: 8 },  // Sentret
                { pokemonId: 162, weight: 24 }, // Furret
                { pokemonId: 163, weight: 6 },  // Hoothoot
                { pokemonId: 164, weight: 20 }, // Noctowl
                { pokemonId: 16, weight: 5 },   // Pidgey
                { pokemonId: 18, weight: 16 },  // Pidgeot
                { pokemonId: 19, weight: 5 },   // Rattata
                { pokemonId: 20, weight: 14 },  // Raticate
                { pokemonId: 21, weight: 2 },   // Spearow
                { pokemonId: 22, weight: 6 }    // Fearow
            ],
            eventPool: ["route29_general", "route29_rival_encounter", "route29_bird_watcher", "route29_silver_taunt"],
            flavor: "Tall grass sways beside the road. Sentret peek out and vanish again."
        },
        {
            id: "cherrygrove_city",
            region: "johto",
            name: "Cherrygrove City",
            description: "A tranquil coastal town famous for its friendly guide.",
            distanceToNext: 12,
            terrain: "town",
            hasShop: true,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["cherrygrove_guide_tour", "cherrygrove_general", "cherrygrove_town_map_gift"],
            flavor: "A guide offers to show you around town. The sea breeze smells like home."
        },
        {
            id: "route_30",
            region: "johto",
            name: "Route 30",
            description: "A grassy trail leading toward Violet City.",
            distanceToNext: 58,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 187, weight: 8 },  // Hoppip
                { pokemonId: 189, weight: 22 }, // Jumpluff
                { pokemonId: 10, weight: 6 },   // Caterpie
                { pokemonId: 12, weight: 16 },  // Butterfree
                { pokemonId: 13, weight: 6 },   // Weedle
                { pokemonId: 15, weight: 16 },  // Beedrill
                { pokemonId: 16, weight: 4 },   // Pidgey
                { pokemonId: 18, weight: 12 },  // Pidgeot
                { pokemonId: 165, weight: 4 },  // Ledyba
                { pokemonId: 166, weight: 10 }, // Ledian
                { pokemonId: 69, weight: 3 },   // Bellsprout
                { pokemonId: 71, weight: 8 }    // Victreebel
            ],
            eventPool: ["route30_general", "route30_mr_pokemon_errand", "route30_bug_catcher", "route30_bellsprout_grove"],
            flavor: "Hoppip drift lazily on the breeze. A famous researcher's house sits nearby."
        },
        {
            id: "route_31",
            region: "johto",
            name: "Route 31",
            description: "A rocky path leading up to Violet City's gates.",
            distanceToNext: 55,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 41, weight: 6 },   // Zubat
                { pokemonId: 169, weight: 20 }, // Crobat
                { pokemonId: 74, weight: 5 },   // Geodude
                { pokemonId: 76, weight: 18 },  // Golem
                { pokemonId: 69, weight: 4 },   // Bellsprout
                { pokemonId: 71, weight: 14 },  // Victreebel
                { pokemonId: 60, weight: 4 },   // Poliwag
                { pokemonId: 62, weight: 7 },   // Poliwrath
                { pokemonId: 186, weight: 7 },  // Politoed
                { pokemonId: 27, weight: 4 },   // Sandshrew
                { pokemonId: 28, weight: 13 },  // Sandslash
                { pokemonId: 179, weight: 2 },  // Mareep
                { pokemonId: 181, weight: 7 }   // Ampharos
            ],
            eventPool: ["route31_general", "route31_dark_cave_warning", "route31_violet_gate", "route31_dark_cave_explorer"],
            flavor: "Dark Cave yawns off the path. Violet City's tower is visible ahead."
        },
        {
            id: "violet_city",
            region: "johto",
            name: "Violet City",
            description: "A quiet city built around an ancient tower, home to the Flying-type gym.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "falkner",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["violet_city_gym_intro", "violet_city_sprout_tower", "violet_city_falkner_challenge", "violet_city_sprout_tower_trial"],
            flavor: "Sprout Tower rises above the rooftops. Falkner's gym awaits challengers."
        },
        {
            id: "route_32",
            region: "johto",
            name: "Route 32",
            description: "A muddy trail south of Violet City toward Union Cave.",
            distanceToNext: 65,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 19, weight: 5 },   // Rattata
                { pokemonId: 20, weight: 13 },  // Raticate
                { pokemonId: 41, weight: 5 },   // Zubat
                { pokemonId: 169, weight: 15 }, // Crobat
                { pokemonId: 194, weight: 4 },  // Wooper
                { pokemonId: 195, weight: 13 }, // Quagsire
                { pokemonId: 79, weight: 4 },   // Slowpoke
                { pokemonId: 80, weight: 6 },   // Slowbro
                { pokemonId: 199, weight: 6 },  // Slowking
                { pokemonId: 60, weight: 4 },   // Poliwag
                { pokemonId: 62, weight: 6 },   // Poliwrath
                { pokemonId: 186, weight: 6 },  // Politoed
                { pokemonId: 69, weight: 4 },   // Bellsprout
                { pokemonId: 71, weight: 12 }   // Victreebel
            ],
            eventPool: ["route32_general", "route32_fishing_guru", "route32_union_cave_entrance", "route32_wilton_fisherman"],
            flavor: "The ground grows soft and muddy. A cave mouth opens up ahead."
        },
        {
            id: "union_cave",
            region: "johto",
            name: "Union Cave",
            description: "A sprawling cave system connecting three routes.",
            distanceToNext: 70,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 41, weight: 6 },   // Zubat
                { pokemonId: 169, weight: 22 }, // Crobat
                { pokemonId: 74, weight: 5 },   // Geodude
                { pokemonId: 76, weight: 19 },  // Golem
                { pokemonId: 194, weight: 4 },  // Wooper
                { pokemonId: 195, weight: 15 }, // Quagsire
                { pokemonId: 19, weight: 4 },   // Rattata
                { pokemonId: 20, weight: 13 },  // Raticate
                { pokemonId: 206, weight: 10 }, // Dunsparce
                { pokemonId: 95, weight: 3 },   // Onix
                { pokemonId: 208, weight: 8 }   // Steelix
            ],
            eventPool: ["union_cave_general", "union_cave_lost_hiker", "union_cave_onix_rumble", "union_cave_fossil_hunter"],
            flavor: "Water drips endlessly. The cave stretches on in every direction."
        },
        {
            id: "route_33",
            region: "johto",
            name: "Route 33",
            description: "A short forested path connecting Union Cave to Azalea Town.",
            distanceToNext: 45,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 42,
            encounterTable: [
                { pokemonId: 19, weight: 5 },   // Rattata
                { pokemonId: 20, weight: 16 },  // Raticate
                { pokemonId: 163, weight: 5 },  // Hoothoot
                { pokemonId: 164, weight: 15 }, // Noctowl
                { pokemonId: 165, weight: 4 },  // Ledyba
                { pokemonId: 166, weight: 14 }, // Ledian
                { pokemonId: 161, weight: 5 },  // Sentret
                { pokemonId: 162, weight: 15 }, // Furret
                { pokemonId: 206, weight: 12 }  // Dunsparce
            ],
            eventPool: ["route33_general", "route33_azalea_approach", "route33_apricorn_gathering"],
            flavor: "The trees thin out. Azalea Town's roofs peek over the hill."
        },
        {
            id: "azalea_town",
            region: "johto",
            name: "Azalea Town",
            description: "A small town shadowed by a forest, home to the Bug-type gym.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "bugsy",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["azalea_town_gym_intro", "azalea_town_slowpoke_tail", "azalea_town_bugsy_challenge", "azalea_town_kurt_apricorn_balls"],
            flavor: "Slowpoke nap in the middle of the road. Bugsy's gym buzzes nearby."
        },
        {
            id: "slowpoke_well",
            region: "johto",
            name: "Slowpoke Well",
            description: "A deep well beneath Azalea Town, home to a colony of Slowpoke.",
            distanceToNext: 35,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 40,
            encounterTable: [
                { pokemonId: 79, weight: 8 },   // Slowpoke
                { pokemonId: 80, weight: 12 },  // Slowbro
                { pokemonId: 199, weight: 12 }, // Slowking
                { pokemonId: 41, weight: 5 },   // Zubat
                { pokemonId: 169, weight: 18 }, // Crobat
                { pokemonId: 60, weight: 4 },   // Poliwag
                { pokemonId: 62, weight: 8 },   // Poliwrath
                { pokemonId: 186, weight: 8 },  // Politoed
                { pokemonId: 74, weight: 3 },   // Geodude
                { pokemonId: 76, weight: 11 },  // Golem
                { pokemonId: 19, weight: 3 },   // Rattata
                { pokemonId: 20, weight: 8 }    // Raticate
            ],
            eventPool: ["slowpoke_well_general", "slowpoke_well_team_rocket", "slowpoke_well_aftermath"],
            flavor: "Slowpoke tails drip into the dark water below. Something feels wrong down here."
        },
        {
            id: "route_34",
            region: "johto",
            name: "Route 34",
            description: "A suburban route leading into Goldenrod City.",
            distanceToNext: 60,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 48,
            encounterTable: [
                { pokemonId: 165, weight: 5 },  // Ledyba
                { pokemonId: 166, weight: 18 }, // Ledian
                { pokemonId: 167, weight: 4 },  // Spinarak
                { pokemonId: 168, weight: 15 }, // Ariados
                { pokemonId: 96, weight: 4 },   // Drowzee
                { pokemonId: 97, weight: 13 },  // Hypno
                { pokemonId: 63, weight: 3 },   // Abra
                { pokemonId: 65, weight: 10 },  // Alakazam
                { pokemonId: 202, weight: 16 }, // Wobbuffet
                { pokemonId: 113, weight: 3 },  // Chansey
                { pokemonId: 242, weight: 9 }   // Blissey
            ],
            eventPool: ["route34_general", "route34_daycare_couple", "route34_goldenrod_approach", "route34_marys_cousin"],
            flavor: "A Day Care sits along the road. Goldenrod's skyline glows in the distance."
        },
        {
            id: "goldenrod_city",
            region: "johto",
            name: "Goldenrod City",
            description: "Johto's largest city, home to a department store and the Normal-type gym.",
            distanceToNext: 18,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "whitney",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["goldenrod_city_department_store", "goldenrod_city_game_corner", "goldenrod_city_whitney_challenge", "goldenrod_city_bike_shop", "goldenrod_city_radio_tower_rocket", "goldenrod_city_underground_path"],
            flavor: "Escalators hum inside the department store. Whitney's gym is packed with fans."
        },
        {
            id: "route_35",
            region: "johto",
            name: "Route 35",
            description: "An open grassy corridor leading from Goldenrod toward the National Park.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 191, weight: 10 }, // Sunkern
                { pokemonId: 192, weight: 30 }, // Sunflora
                { pokemonId: 187, weight: 10 }, // Hoppip
                { pokemonId: 189, weight: 26 }  // Jumpluff
            ],
            eventPool: [],
            flavor: "Sunkern and Hoppip drift through open fields on the way to the park gates."
        },
        {
            id: "national_park",
            region: "johto",
            name: "National Park",
            description: "A manicured park route famous for its annual bug-catching contest.",
            distanceToNext: 45,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 43, weight: 6 },   // Oddish
                { pokemonId: 45, weight: 12 },  // Vileplume
                { pokemonId: 182, weight: 12 }, // Bellossom
                { pokemonId: 193, weight: 22 }, // Yanma
                { pokemonId: 190, weight: 18 }, // Aipom
                { pokemonId: 123, weight: 6 },  // Scyther
                { pokemonId: 212, weight: 8 }   // Scizor
            ],
            eventPool: ["national_park_bug_catching_contest", "national_park_general", "national_park_flower_show", "national_park_sudowoodo_copycat"],
            flavor: "Manicured flowerbeds line the path. Bug catchers compare nets and jars."
        },
        {
            id: "route_36",
            region: "johto",
            name: "Route 36",
            description: "A quiet forest path out of the National Park, blocked by an oddly convincing tree.",
            distanceToNext: 44,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 48,
            encounterTable: [
                { pokemonId: 163, weight: 8 },  // Hoothoot
                { pokemonId: 164, weight: 26 }, // Noctowl
                { pokemonId: 204, weight: 8 },  // Pineco
                { pokemonId: 205, weight: 24 }  // Forretress
            ],
            eventPool: ["sudowoodo_event", "route36_37_stantler_illusion"],
            flavor: "A strange tree stands motionless at the roadside, oddly still even in the wind."
        },
        {
            id: "route_37",
            region: "johto",
            name: "Route 37",
            description: "The hills climb steadily toward the mysterious city of Ecruteak.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 48,
            encounterTable: [
                { pokemonId: 203, weight: 22 }, // Girafarig
                { pokemonId: 198, weight: 24 }, // Murkrow (night)
                { pokemonId: 234, weight: 20 }, // Stantler
                { pokemonId: 214, weight: 12 }  // Heracross
            ],
            eventPool: ["route36_37_general", "route36_37_ecruteak_legend"],
            flavor: "The hills climb steadily. Ecruteak's twin towers rise in the distance."
        },
        {
            id: "ecruteak_city",
            region: "johto",
            name: "Ecruteak City",
            description: "A city steeped in legend, home to two ancient towers and the Ghost-type gym.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "morty",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["ecruteak_city_burned_tower", "ecruteak_city_bell_tower", "ecruteak_city_morty_challenge", "ecruteak_city_kimono_girls", "ecruteak_city_eusine_suicune"],
            flavor: "The Burned Tower's charred beams still stand. Morty reads the fog like a book."
        },
        {
            id: "route_38",
            region: "johto",
            name: "Route 38",
            description: "A pastoral road out of Ecruteak, dotted with grazing Pokemon.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 241, weight: 34 }, // Miltank
                { pokemonId: 128, weight: 30 }  // Tauros
            ],
            eventPool: ["route38_39_general"],
            flavor: "Miltank low contentedly in the pasture. The road smells of fresh hay."
        },
        {
            id: "route_39",
            region: "johto",
            name: "Route 39",
            description: "The road past Moomoo Farm on the way to Olivine City.",
            distanceToNext: 46,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 81, weight: 8 },   // Magnemite
                { pokemonId: 82, weight: 22 },  // Magneton
                { pokemonId: 209, weight: 8 },  // Snubbull
                { pokemonId: 210, weight: 24 }, // Granbull
                { pokemonId: 113, weight: 5 },  // Chansey
                { pokemonId: 242, weight: 11 }  // Blissey
            ],
            eventPool: ["route38_39_moomoo_farm", "route38_39_runaway_miltank"],
            flavor: "Snubbull trot along the fences. Olivine's harbor lights glimmer ahead."
        },
        {
            id: "olivine_city",
            region: "johto",
            name: "Olivine City",
            description: "A harbor city with a lighthouse, home to the Steel-type gym.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "jasmine",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["olivine_city_lighthouse", "olivine_city_ferry_dock", "olivine_city_jasmine_challenge"],
            flavor: "The lighthouse beam sweeps across the harbor. Ferries creak against the dock."
        },
        {
            id: "route_40",
            region: "johto",
            name: "Route 40",
            description: "The harbor waters just south of Olivine, crossed by ferry.",
            distanceToNext: 48,
            terrain: "water",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 72, weight: 10 },  // Tentacool
                { pokemonId: 73, weight: 30 },  // Tentacruel
                { pokemonId: 98, weight: 8 },   // Krabby
                { pokemonId: 99, weight: 22 }   // Kingler
            ],
            eventPool: ["route40_41_general", "route40_41_jasmine_errand"],
            flavor: "Ferries creak at the dock as the harbor gives way to open water."
        },
        {
            id: "route_41",
            region: "johto",
            name: "Route 41",
            description: "An open sea route teeming with aquatic life, stretching on to Cianwood.",
            distanceToNext: 52,
            terrain: "water",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 116, weight: 6 },  // Horsea
                { pokemonId: 117, weight: 14 }, // Seadra
                { pokemonId: 230, weight: 4 },  // Kingdra
                { pokemonId: 170, weight: 6 },  // Chinchou
                { pokemonId: 171, weight: 18 }, // Lanturn
                { pokemonId: 223, weight: 6 },  // Remoraid
                { pokemonId: 224, weight: 18 }, // Octillery
                { pokemonId: 211, weight: 8 }   // Qwilfish
            ],
            eventPool: ["route40_41_ferry_crossing", "route40_41_mantine_sighting", "route40_41_whirl_islands_lugia"],
            flavor: "Salt spray coats the deck. Something large glides beneath the waves."
        },
        {
            id: "cianwood_city",
            region: "johto",
            name: "Cianwood City",
            description: "An isolated island city reachable only by sea, home to the Fighting-type gym.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "chuck",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["cianwood_city_pharmacy", "cianwood_city_chuck_challenge", "cianwood_city_rough_crossing"],
            flavor: "Waves crash against the cliffs. Chuck trains alone on the beach at dawn."
        },
        {
            id: "route_42",
            region: "johto",
            name: "Route 42",
            description: "The trail climbs sharply out of Cianwood toward a steep, cave-riddled mountain.",
            distanceToNext: 45,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 66, weight: 8 },   // Machop
                { pokemonId: 68, weight: 28 },  // Machamp
                { pokemonId: 183, weight: 8 },  // Marill
                { pokemonId: 184, weight: 24 }  // Azumarill
            ],
            eventPool: [],
            flavor: "The trail climbs sharply. A steep mountain looms ahead, riddled with caves."
        },
        {
            id: "mt_mortar",
            region: "johto",
            name: "Mt. Mortar",
            description: "A steep mountain riddled with caves and hidden hot springs.",
            distanceToNext: 50,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 74, weight: 6 },   // Geodude
                { pokemonId: 76, weight: 22 },  // Golem
                { pokemonId: 216, weight: 6 },  // Teddiursa
                { pokemonId: 217, weight: 18 }, // Ursaring
                { pokemonId: 218, weight: 6 },  // Slugma
                { pokemonId: 219, weight: 18 }, // Magcargo
                { pokemonId: 95, weight: 4 },   // Onix
                { pokemonId: 208, weight: 12 }  // Steelix
            ],
            eventPool: ["mt_mortar_general", "mt_mortar_hermit_master", "mt_mortar_waterfall_training", "mt_mortar_hot_spring_healing"],
            flavor: "Steam rises from hidden hot springs. Somewhere above, a waterfall roars."
        },
        {
            id: "mahogany_town",
            region: "johto",
            name: "Mahogany Town",
            description: "A remote mountain town shrouded in secrecy, home to the Ice-type gym.",
            distanceToNext: 20,
            terrain: "town",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "pryce",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["mahogany_town_team_rocket_hideout", "mahogany_town_pryce_challenge", "mahogany_town_vending_machine_scam"],
            flavor: "A chill hangs in the air. Something suspicious hides beneath the town."
        },
        {
            id: "lake_of_rage",
            region: "johto",
            name: "Lake of Rage",
            description: "A misty lake where fishermen swap rumors of a monstrous Gyarados.",
            distanceToNext: 55,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 129, weight: 6 },  // Magikarp
                { pokemonId: 130, weight: 22 }, // Gyarados
                { pokemonId: 118, weight: 4 },  // Goldeen
                { pokemonId: 119, weight: 16 }, // Seaking
                { pokemonId: 60, weight: 4 },   // Poliwag
                { pokemonId: 61, weight: 6 },   // Poliwhirl
                { pokemonId: 62, weight: 6 },   // Poliwrath
                { pokemonId: 186, weight: 6 },  // Politoed
                { pokemonId: 98, weight: 4 },   // Krabby
                { pokemonId: 99, weight: 12 },  // Kingler
                { pokemonId: 130, weight: 4, shiny: true, hpOverride: 6 } // Gyarados - Red Gyarados (flagged, §10.4) — halved back down from weight 8 (8.5% -> ~4.4% of table) after real-run reports of it showing up too often; now also a one-time catch per run (see redGyaradosCaught in engine/game-state.js / engine/encounter-engine.js), so the drop only ever matters until it's actually caught once
            ],
            eventPool: ["lake_of_rage_red_gyarados_rumor", "lake_of_rage_general", "lake_of_rage_team_rocket_scheme", "lake_of_rage_magikarp_salesman"],
            flavor: "Fog clings to the water's surface. Fishermen speak in hushed tones of a red Gyarados."
        },
        {
            id: "route_44",
            region: "johto",
            name: "Route 44",
            description: "The road out of Mahogany Town, snow deepening underfoot.",
            distanceToNext: 42,
            terrain: "route",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 220, weight: 10 }, // Swinub
                { pokemonId: 221, weight: 32 }, // Piloswine
                { pokemonId: 86, weight: 10 },  // Seel
                { pokemonId: 87, weight: 28 }   // Dewgong
            ],
            eventPool: [],
            flavor: "Snow deepens underfoot. Ahead, the path vanishes into solid ice."
        },
        {
            id: "ice_path",
            region: "johto",
            name: "Ice Path",
            description: "A frozen, slippery cave leading toward Blackthorn City.",
            distanceToNext: 50,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 216, weight: 6 },  // Teddiursa
                { pokemonId: 217, weight: 20 }, // Ursaring
                { pokemonId: 215, weight: 14 }, // Sneasel
                { pokemonId: 225, weight: 14 }, // Delibird
                { pokemonId: 246, weight: 8 },  // Larvitar
                { pokemonId: 247, weight: 16 }  // Pupitar
            ],
            eventPool: ["ice_path_general", "ice_path_slippery_puzzle", "ice_path_frozen_hiker", "ice_path_delibird_gift"],
            flavor: "Your footing slides with every step. Ice groans deep beneath the frozen floor."
        },
        {
            id: "blackthorn_city",
            region: "johto",
            name: "Blackthorn City",
            description: "A mountain city guarding the entrance to the Dragon's Den, home to the Dragon-type gym.",
            distanceToNext: 15,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: true,
            gymLeader: "clair",
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["blackthorn_city_dragons_den_gate", "blackthorn_city_clair_challenge", "blackthorn_city_dragon_tamer_rival"],
            flavor: "Snow dusts the rooftops. Clair's gym looms at the base of the mountains."
        },
        {
            id: "dragons_den",
            region: "johto",
            name: "Dragon's Den",
            description: "A sacred waterfall shrine where Dragon-type Pokemon are said to bless worthy trainers.",
            distanceToNext: 45,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 147, weight: 8 },  // Dratini
                { pokemonId: 148, weight: 22 }, // Dragonair
                { pokemonId: 149, weight: 4 },  // Dragonite (rare capstone cameo)
                { pokemonId: 116, weight: 6 },  // Horsea
                { pokemonId: 117, weight: 16 }, // Seadra
                { pokemonId: 230, weight: 4 },  // Kingdra
                { pokemonId: 129, weight: 8 },  // Magikarp
                { pokemonId: 130, weight: 12 }  // Gyarados
            ],
            eventPool: ["dragons_den_elder_trial", "dragons_den_general", "dragons_den_ceremonial_dance"],
            flavor: "Water tumbles over ancient stone. The air itself feels watched."
        },
        {
            id: "victory_road_johto",
            region: "johto",
            name: "Victory Road",
            description: "A grueling final cave, its walls scarred by countless trainers who came before.",
            distanceToNext: 77,
            terrain: "cave",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 50,
            encounterTable: [
                { pokemonId: 95, weight: 4 },   // Onix
                { pokemonId: 208, weight: 18 }, // Steelix
                { pokemonId: 67, weight: 4 },   // Machoke
                { pokemonId: 68, weight: 16 },  // Machamp
                { pokemonId: 228, weight: 6 },  // Houndour
                { pokemonId: 229, weight: 14 }, // Houndoom
                { pokemonId: 207, weight: 14 }, // Gligar
                { pokemonId: 246, weight: 4 },  // Larvitar
                { pokemonId: 247, weight: 8 },  // Pupitar
                { pokemonId: 248, weight: 4 },  // Tyranitar
                { pokemonId: 227, weight: 10 }  // Skarmory
            ],
            eventPool: ["victory_road_johto_general", "victory_road_johto_fallen_trainer", "victory_road_johto_veteran_gauntlet", "victory_road_johto_league_hopefuls"],
            flavor: "The longest, darkest cave in Johto. The ultimate test, once again."
        },
        {
            id: "indigo_plateau_johto",
            region: "johto",
            name: "Indigo Plateau",
            description: "The Pokemon League headquarters, revisited for the Johto Elite Four rematch.",
            distanceToNext: 5,
            terrain: "city",
            hasShop: true,
            hasCenter: true,
            hasGym: false,
            gymLeader: null,
            encounterRate: 0,
            encounterTable: [],
            eventPool: ["indigo_plateau_johto_nurse_joy", "indigo_plateau_johto_e4_rematch_intro", "indigo_plateau_johto_red_rumor"],
            flavor: "The Johto Elite Four await a rematch. Stock up here — Mt. Silver shows no mercy."
        },
        {
            id: "route_28_mt_silver",
            region: "johto",
            name: "Route 28 / Mt. Silver",
            description: "A brutal, wind-scoured mountain trek and the final stretch of the journey.",
            distanceToNext: 100,
            terrain: "mountain",
            hasShop: false,
            hasCenter: false,
            hasGym: false,
            gymLeader: null,
            encounterRate: 45,
            encounterTable: [
                { pokemonId: 19, weight: 4 },   // Rattata
                { pokemonId: 20, weight: 16 },  // Raticate
                { pokemonId: 41, weight: 4 },   // Zubat
                { pokemonId: 169, weight: 16 }, // Crobat
                { pokemonId: 74, weight: 4 },   // Geodude
                { pokemonId: 76, weight: 14 },  // Golem
                { pokemonId: 217, weight: 14 }, // Ursaring
                { pokemonId: 215, weight: 10 }, // Sneasel
                { pokemonId: 246, weight: 3 },  // Larvitar
                { pokemonId: 247, weight: 5 },  // Pupitar
                { pokemonId: 248, weight: 8 },  // Tyranitar
                { pokemonId: 227, weight: 6 }   // Skarmory
            ],
            eventPool: ["mt_silver_general", "mt_silver_red_encounter", "mt_silver_veteran_hermit", "mt_silver_strange_behavior"],
            flavor: "The peak vanishes into cloud. Somewhere up there, a legend waits in silence."
        }
    ];
})();
