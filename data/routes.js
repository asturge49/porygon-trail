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
            eventPool: ["prof_oak_advice", "gary_rival"],
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
                { pokemonId: 74, weight: 30 },  // Geodude
                { pokemonId: 27, weight: 20 },  // Sandshrew
                { pokemonId: 21, weight: 20 },  // Spearow
                { pokemonId: 23, weight: 15 },  // Ekans
                { pokemonId: 56, weight: 15 }   // Mankey
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
                { pokemonId: 41, weight: 35 },  // Zubat
                { pokemonId: 74, weight: 20 },  // Geodude
                { pokemonId: 46, weight: 15 },  // Paras
                { pokemonId: 35, weight: 10 },  // Clefairy
                { pokemonId: 27, weight: 10 },  // Sandshrew
                { pokemonId: 95, weight: 5 },   // Onix
                { pokemonId: 104, weight: 5 }   // Cubone
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
                { pokemonId: 54, weight: 25 },  // Psyduck
                { pokemonId: 118, weight: 20 }, // Goldeen
                { pokemonId: 120, weight: 15 }, // Staryu
                { pokemonId: 129, weight: 20 }, // Magikarp
                { pokemonId: 60, weight: 15 },  // Poliwag
                { pokemonId: 63, weight: 5 }    // Abra
            ],
            eventPool: ["nugget_bridge", "team_rocket_ambush", "misty_fishing", "bill_event"],
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
                { pokemonId: 25, weight: 15 },  // Pikachu
                { pokemonId: 50, weight: 20 },  // Diglett
                { pokemonId: 100, weight: 15 }, // Voltorb
                { pokemonId: 81, weight: 15 },  // Magnemite
                { pokemonId: 52, weight: 15 },  // Meowth
                { pokemonId: 21, weight: 10 },  // Spearow
                { pokemonId: 96, weight: 10 }   // Drowzee
            ],
            eventPool: ["ss_anne_event", "lt_surge_trash_cans", "diglett_cave_shortcut"],
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
            eventPool: ["ghost_encounter", "pokemon_tower", "channeler_curse", "mr_fuji_rescue"],
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
                { pokemonId: 43, weight: 20 },  // Oddish
                { pokemonId: 44, weight: 10 },  // Gloom
                { pokemonId: 69, weight: 20 },  // Bellsprout
                { pokemonId: 102, weight: 15 }, // Exeggcute
                { pokemonId: 114, weight: 10 }, // Tangela
                { pokemonId: 133, weight: 5 },  // Eevee
                { pokemonId: 37, weight: 10 },  // Vulpix
                { pokemonId: 58, weight: 10 }   // Growlithe
            ],
            eventPool: ["game_corner", "team_rocket_hideout", "dept_store_sale", "eevee_gift"],
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
                { pokemonId: 63, weight: 20 },  // Abra
                { pokemonId: 64, weight: 10 },  // Kadabra
                { pokemonId: 96, weight: 20 },  // Drowzee
                { pokemonId: 97, weight: 10 },  // Hypno
                { pokemonId: 122, weight: 5 },  // Mr. Mime
                { pokemonId: 106, weight: 5 },  // Hitmonlee
                { pokemonId: 107, weight: 5 },  // Hitmonchan
                { pokemonId: 132, weight: 10 }, // Ditto
                { pokemonId: 137, weight: 5 },  // Porygon
                { pokemonId: 52, weight: 10 }   // Meowth
            ],
            eventPool: ["silph_co_siege", "team_rocket_ambush", "fighting_dojo", "lapras_gift"],
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
                { pokemonId: 48, weight: 15 },  // Venonat
                { pokemonId: 49, weight: 10 },  // Venomoth
                { pokemonId: 109, weight: 15 }, // Koffing
                { pokemonId: 88, weight: 15 },  // Grimer
                { pokemonId: 128, weight: 5 },  // Tauros
                { pokemonId: 115, weight: 5 },  // Kangaskhan
                { pokemonId: 123, weight: 5 },  // Scyther
                { pokemonId: 127, weight: 5 },  // Pinsir
                { pokemonId: 113, weight: 5 },  // Chansey
                { pokemonId: 147, weight: 5 },  // Dratini
                { pokemonId: 111, weight: 10 }  // Rhyhorn
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
                { pokemonId: 86, weight: 20 },  // Seel
                { pokemonId: 87, weight: 10 },  // Dewgong
                { pokemonId: 90, weight: 20 },  // Shellder
                { pokemonId: 116, weight: 15 }, // Horsea
                { pokemonId: 117, weight: 10 }, // Seadra
                { pokemonId: 72, weight: 15 },  // Tentacool
                { pokemonId: 131, weight: 5 },  // Lapras
                { pokemonId: 144, weight: 2 },  // Articuno
                { pokemonId: 120, weight: 3 }   // Staryu
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
                { pokemonId: 142, weight: 3 }   // Aerodactyl
            ],
            eventPool: ["pokemon_mansion", "mewtwo_journal", "fossil_revival", "blaine_quiz"],
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
