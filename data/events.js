// Porygon Trail - Random Events
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.Events = [
        // ===== TEAM ROCKET EVENTS =====
        {
            id: "team_rocket_ambush",
            type: "combat",
            name: "Team Rocket Ambush!",
            description: "A group of Team Rocket grunts blocks the path! \"Hand over your Pokemon and nobody gets hurt!\"",
            weight: 15,
            oneTime: false,
            minDay: 3,
            choices: [
                {
                    text: "Battle them!",
                    outcomes: [
                        { weight: 50, narration: "Your Pokemon fight bravely and drive Team Rocket away!", effects: { money: 500 }, trackRocket: true },
                        { weight: 30, narration: "A tough fight! You win, but your Pokemon take damage.", effects: { money: 200, partyDamage: 1 }, trackRocket: true },
                        { weight: 20, narration: "They overwhelm you and steal your supplies!", effects: { food: -10, pokeballs: -3 } }
                    ]
                },
                {
                    text: "Hand over supplies",
                    outcomes: [
                        { weight: 100, narration: "They take your food and Pokeballs and vanish laughing.", effects: { food: -15, pokeballs: -5 } }
                    ]
                },
                {
                    text: "Use Escape Rope",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 100, narration: "You slip away through a hidden path before they notice!", effects: { escapeRope: -1 } }
                    ]
                }
            ]
        },
        {
            id: "team_rocket_hideout",
            type: "combat",
            name: "Team Rocket Hideout!",
            description: "You stumble upon a hidden Team Rocket base! You could raid it for supplies or sneak past.",
            weight: 8,
            oneTime: false,
            minDay: 8,
            choices: [
                {
                    text: "Raid the hideout",
                    outcomes: [
                        { weight: 40, narration: "You find a stash of supplies! Team Rocket will be furious.", effects: { money: 1000, pokeballs: 5, potions: 3 }, trackRocket: true },
                        { weight: 35, narration: "You grab some items but trigger an alarm! Your Pokemon take hits escaping.", effects: { money: 500, pokeballs: 3, partyDamage: 1 }, trackRocket: true },
                        { weight: 25, narration: "It was a trap! Team Rocket ambushes you!", effects: { partyDamage: 2, food: -10 } }
                    ]
                },
                {
                    text: "Sneak past",
                    outcomes: [
                        { weight: 80, narration: "You quietly sneak past without being noticed.", effects: {} },
                        { weight: 20, narration: "They spot you! You flee but drop some items.", effects: { pokeballs: -2 } }
                    ]
                }
            ]
        },
        {
            id: "team_rocket_final",
            type: "combat",
            name: "Team Rocket's Last Stand!",
            description: "Giovanni himself appears! \"This is where your journey ends, trainer.\"",
            weight: 10,
            oneTime: true,
            minDay: 20,
            minLocation: 12,
            choices: [
                {
                    text: "Face Giovanni!",
                    outcomes: [
                        { weight: 40, narration: "Your team fights with everything they have and defeats Giovanni! Team Rocket disbands!", effects: { money: 3000 }, trackRocket: true },
                        { weight: 35, narration: "A close battle! You barely win but your team is battered.", effects: { money: 1500, partyDamage: 2 }, trackRocket: true },
                        { weight: 25, narration: "Giovanni's Pokemon are too strong. He takes your money and leaves.", effects: { money: -1000, partyDamage: 2 } }
                    ]
                },
                {
                    text: "Flee",
                    outcomes: [
                        { weight: 70, narration: "You escape Giovanni's clutches... for now.", effects: {} },
                        { weight: 30, narration: "Giovanni's Persian blocks your escape! You lose items fleeing.", effects: { food: -10, money: -500 } }
                    ]
                }
            ]
        },

        // ===== NPC ENCOUNTERS =====
        {
            id: "nurse_joy",
            type: "healing",
            name: "Nurse Joy!",
            description: "A Pokemon Center! Nurse Joy greets you with a warm smile. \"Welcome! Let me heal your Pokemon!\"",
            weight: 12,
            oneTime: false,
            choices: [
                {
                    text: "Heal all Pokemon",
                    outcomes: [
                        { weight: 100, narration: "Nurse Joy heals all your Pokemon to full health!", effects: { healAll: true } }
                    ]
                },
                {
                    text: "Heal and rest (lose 1 day)",
                    outcomes: [
                        { weight: 100, narration: "You rest at the Pokemon Center. Everyone feels refreshed!", effects: { healAll: true, food: 5, daysLost: 1 } }
                    ]
                }
            ]
        },
        {
            id: "prof_oak_advice",
            type: "story",
            name: "Professor Oak!",
            description: "Professor Oak appears! \"Ah, there you are! How's your Pokedex coming along? Here, take these supplies.\"",
            weight: 8,
            oneTime: false,
            minDay: 0,
            choices: [
                {
                    text: "Thank him",
                    outcomes: [
                        { weight: 60, narration: "Oak gives you some Pokeballs and food. \"Be careful out there!\"", effects: { pokeballs: 5, food: 10 } },
                        { weight: 40, narration: "Oak gives you a rare item! \"You'll need this where you're going.\"", effects: { pokeballs: 3, potions: 2, rareCandy: 1 } }
                    ]
                }
            ]
        },
        {
            id: "gary_rival",
            type: "combat",
            name: "Rival Gary!",
            description: "\"Hey loser! Smell ya later! ...Just kidding. Let's see who's stronger!\"",
            weight: 10,
            oneTime: false,
            minDay: 2,
            choices: [
                {
                    text: "Accept his challenge!",
                    outcomes: [
                        { weight: 45, narration: "Your Pokemon outperform Gary's! \"Hmph! I'll beat you next time!\"", effects: { money: 500 } },
                        { weight: 35, narration: "A close match! Gary barely wins. \"I knew I was better!\"", effects: { partyDamage: 1 } },
                        { weight: 20, narration: "Gary's team is surprisingly strong. He takes some of your money.", effects: { partyDamage: 1, money: -200 } }
                    ]
                },
                {
                    text: "\"Not now, Gary.\"",
                    outcomes: [
                        { weight: 100, narration: "Gary shrugs. \"Scared? Smell ya later!\" He walks off.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "jessie_james",
            type: "combat",
            name: "Jessie & James!",
            description: "\"Prepare for trouble!\" \"And make it double!\" Team Rocket's most persistent duo blocks your path!",
            weight: 10,
            oneTime: false,
            minDay: 4,
            choices: [
                {
                    text: "Battle them",
                    outcomes: [
                        { weight: 60, narration: "\"Team Rocket's blasting off again!\" They fly into the sky.", effects: { money: 300 }, trackRocket: true },
                        { weight: 30, narration: "Meowth scratches your Pokemon! But you still win.", effects: { partyDamage: 1, money: 200 }, trackRocket: true },
                        { weight: 10, narration: "Their Weezing's Smokescreen lets them steal some Pokeballs!", effects: { pokeballs: -3 } }
                    ]
                },
                {
                    text: "Distract them with food",
                    outcomes: [
                        { weight: 80, narration: "James gets distracted by the food. Jessie yells at him. You sneak past!", effects: { food: -5 } },
                        { weight: 20, narration: "\"We're not falling for that!\" They steal the food AND some money.", effects: { food: -8, money: -200 } }
                    ]
                }
            ]
        },
        {
            id: "ash_pikachu",
            type: "story",
            name: "Ash & Pikachu!",
            description: "A kid with a Pikachu on his shoulder waves at you. \"Hey! I'm gonna be a Pokemon Master too! Want some help?\"",
            weight: 6,
            oneTime: false,
            choices: [
                {
                    text: "Travel together for a bit",
                    outcomes: [
                        { weight: 70, narration: "Ash's Pikachu cheers up your Pokemon! One is healed.", effects: { healOne: true } },
                        { weight: 30, narration: "Ash shares his food and some Pokemon wisdom. Your team feels stronger!", effects: { food: 5, healOne: true } }
                    ]
                }
            ]
        },

        // ===== WEATHER EVENTS =====
        {
            id: "thunderstorm",
            type: "weather",
            name: "Thunderstorm!",
            description: "Dark clouds gather and lightning strikes! A massive thunderstorm rolls in!",
            weight: 10,
            oneTime: false,
            minDay: 5,
            choices: [
                {
                    text: "Push through",
                    bonusAbility: "flash",
                    outcomes: [
                        { weight: 40, narration: "You brave the storm. It's miserable but you make it through.", effects: { partyDamage: 1 } },
                        { weight: 30, narration: "Lightning strikes near your team! A Pokemon is paralyzed!", effects: { statusRandom: "paralyzed" } },
                        { weight: 30, narration: "The rain soaks your food supplies.", effects: { food: -8 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Electric-type lights the way safely through the storm!", effects: {} }
                },
                {
                    text: "Wait it out (lose 1 day)",
                    outcomes: [
                        { weight: 100, narration: "You shelter under a tree until the storm passes.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        },
        {
            id: "heatwave",
            type: "weather",
            name: "Heat Wave!",
            description: "The sun beats down mercilessly. Temperatures soar and water supplies dwindle!",
            weight: 8,
            oneTime: false,
            minDay: 5,
            choices: [
                {
                    text: "Keep moving",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 50, narration: "The heat drains everyone. Extra food and water consumed.", effects: { food: -10 } },
                        { weight: 30, narration: "A Pokemon collapses from heat. You use extra potions.", effects: { food: -5, partyDamage: 1 } },
                        { weight: 20, narration: "You find an oasis! But it's a mirage... mostly.", effects: { food: -8 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type keeps everyone cool and hydrated!", effects: { food: -3 } }
                },
                {
                    text: "Rest until evening",
                    outcomes: [
                        { weight: 100, narration: "You travel at night instead. Slower but safer.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        },
        {
            id: "fog",
            type: "weather",
            name: "Dense Fog!",
            description: "A thick fog rolls in. You can barely see your hand in front of your face!",
            weight: 8,
            oneTime: false,
            choices: [
                {
                    text: "Navigate carefully",
                    bonusAbility: "fly",
                    outcomes: [
                        { weight: 40, narration: "You slowly make your way through. Lost half a day.", effects: { daysLost: 1 } },
                        { weight: 30, narration: "You get lost and wander in circles!", effects: { daysLost: 2 } },
                        { weight: 30, narration: "You stumble upon a hidden item in the fog!", effects: { potions: 2, pokeballs: 2 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Flying-type scouts above the fog and guides you through!", effects: {} }
                },
                {
                    text: "Wait for it to clear",
                    outcomes: [
                        { weight: 100, narration: "The fog lifts after a day of waiting.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        },

        // ===== DISCOVERY EVENTS =====
        {
            id: "fossil_discovery",
            type: "discovery",
            name: "Fossil Discovery!",
            description: "You find ancient fossils embedded in the cave wall!",
            weight: 6,
            oneTime: true,
            locationIds: ["mt_moon"],
            choices: [
                {
                    text: "Take the Helix Fossil",
                    outcomes: [
                        { weight: 100, narration: "You carefully extract the Helix Fossil. Maybe someone can revive it!", effects: { keyItem: "Helix Fossil" } }
                    ]
                },
                {
                    text: "Take the Dome Fossil",
                    outcomes: [
                        { weight: 100, narration: "You carefully extract the Dome Fossil. It looks ancient!", effects: { keyItem: "Dome Fossil" } }
                    ]
                }
            ]
        },
        {
            id: "moon_stone_event",
            type: "discovery",
            name: "Moon Stone!",
            description: "A strange glowing stone sits on a pedestal, radiating mysterious energy.",
            weight: 8,
            oneTime: true,
            locationIds: ["mt_moon"],
            choices: [
                {
                    text: "Take the Moon Stone",
                    outcomes: [
                        { weight: 70, narration: "You take the Moon Stone! It pulses with energy.", effects: { rareCandy: 1 } },
                        { weight: 30, narration: "As you grab it, Clefairy appear and attack! But you keep the stone.", effects: { rareCandy: 1, partyDamage: 1 } }
                    ]
                },
                {
                    text: "Leave it for the Clefairy",
                    outcomes: [
                        { weight: 100, narration: "The Clefairy dance around the stone gratefully. One gives you food!", effects: { food: 15 } }
                    ]
                }
            ]
        },
        {
            id: "hidden_item",
            type: "discovery",
            name: "Hidden Item!",
            description: "You spot something glinting in the bushes!",
            weight: 12,
            oneTime: false,
            choices: [
                {
                    text: "Investigate",
                    outcomes: [
                        { weight: 30, narration: "You found some money!", effects: { money: 500 } },
                        { weight: 25, narration: "Pokeballs! Someone must have dropped them.", effects: { pokeballs: 3 } },
                        { weight: 20, narration: "A stash of potions hidden under a rock!", effects: { potions: 2 } },
                        { weight: 15, narration: "Rare Candy! What a lucky find!", effects: { rareCandy: 1 } },
                        { weight: 10, narration: "It was just a shiny bottle cap. Oh well.", effects: {} }
                    ]
                },
                {
                    text: "Keep moving",
                    outcomes: [
                        { weight: 100, narration: "You decide not to risk it and keep walking.", effects: {} }
                    ]
                }
            ]
        },

        // ===== SPECIAL LOCATION EVENTS =====
        {
            id: "ghost_encounter",
            type: "story",
            name: "Ghost in the Tower!",
            description: "A ghostly figure blocks your path in Pokemon Tower! \"Get... out...\" it moans.",
            weight: 15,
            oneTime: true,
            locationIds: ["lavender_town"],
            choices: [
                {
                    text: "Use Silph Scope",
                    requiresKeyItem: "Silph Scope",
                    outcomes: [
                        { weight: 100, narration: "The Silph Scope reveals it's a Marowak's ghost! It finds peace and passes on. A Gastly joins you gratefully.", effects: { catchPokemon: 92 } }
                    ]
                },
                {
                    text: "Try to communicate",
                    outcomes: [
                        { weight: 40, narration: "The ghost wails and your Pokemon are frightened!", effects: { partyDamage: 1 } },
                        { weight: 40, narration: "The ghost seems sad, not angry. It fades away, leaving a Rare Candy.", effects: { rareCandy: 1 } },
                        { weight: 20, narration: "Your bravery impresses a wild Gastly, who joins your team!", effects: { catchPokemon: 92 } }
                    ]
                },
                {
                    text: "Flee the tower",
                    outcomes: [
                        { weight: 100, narration: "You run out of the tower, heart pounding.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "safari_zone",
            type: "special",
            name: "Safari Zone!",
            description: "Welcome to the Safari Zone! Pay 500 to enter and catch rare Pokemon! But Pokeballs work differently here...",
            weight: 15,
            oneTime: true,
            locationIds: ["fuchsia_city"],
            choices: [
                {
                    text: "Enter (costs 500)",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 25, narration: "Amazing luck! You catch a Chansey and Tauros!", effects: { money: -500, catchPokemon: 113, catchPokemon2: 128 } },
                        { weight: 35, narration: "You catch a Scyther! What a find!", effects: { money: -500, catchPokemon: 123 } },
                        { weight: 25, narration: "You catch a Kangaskhan after a long chase!", effects: { money: -500, catchPokemon: 115 } },
                        { weight: 15, narration: "The rare Pokemon keep running away! You wasted your money.", effects: { money: -500 } }
                    ]
                },
                {
                    text: "Too expensive, skip it",
                    outcomes: [
                        { weight: 100, narration: "You pass on the Safari Zone. Maybe next time.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "ss_anne_event",
            type: "story",
            name: "S.S. Anne!",
            description: "The luxury cruise ship S.S. Anne is docked! A sailor offers you a ticket aboard.",
            weight: 12,
            oneTime: true,
            locationIds: ["vermilion_city"],
            choices: [
                {
                    text: "Board the S.S. Anne",
                    outcomes: [
                        { weight: 50, narration: "The captain thanks you for visiting! He teaches your Pokemon Cut. You also enjoy a feast!", effects: { food: 20, keyItem: "HM Cut" } },
                        { weight: 30, narration: "You find a Rare Candy in a cabin and enjoy the buffet!", effects: { food: 15, rareCandy: 1 } },
                        { weight: 20, narration: "Gary challenges you on board! You win and feast afterwards.", effects: { money: 500, food: 15 } }
                    ]
                },
                {
                    text: "Skip it",
                    outcomes: [
                        { weight: 100, narration: "The S.S. Anne departs without you. Oh well.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "silph_co_siege",
            type: "combat",
            name: "Silph Co. Under Siege!",
            description: "Team Rocket has taken over Silph Co.! Employees beg for your help!",
            weight: 15,
            oneTime: true,
            locationIds: ["saffron_city"],
            choices: [
                {
                    text: "Storm Silph Co.!",
                    outcomes: [
                        { weight: 40, narration: "You fight through Team Rocket and save Silph Co.! The president gives you a Lapras and the Silph Scope!", effects: { catchPokemon: 131, keyItem: "Silph Scope", money: 2000 }, trackRocket: true },
                        { weight: 35, narration: "You rescue the employees but your team takes a beating. You get the Silph Scope!", effects: { partyDamage: 2, keyItem: "Silph Scope", money: 1000 }, trackRocket: true },
                        { weight: 25, narration: "Team Rocket is too strong! You retreat with minor injuries.", effects: { partyDamage: 1 } }
                    ]
                },
                {
                    text: "It's too dangerous",
                    outcomes: [
                        { weight: 100, narration: "You decide discretion is the better part of valor.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "snorlax_blocking",
            type: "special",
            name: "Snorlax Blocking the Road!",
            description: "A massive Snorlax is sleeping right in the middle of the path! Nothing can get through!",
            weight: 10,
            oneTime: false,
            minDay: 5,
            choices: [
                {
                    text: "Play the Poke Flute",
                    requiresKeyItem: "Poke Flute",
                    outcomes: [
                        { weight: 60, narration: "Snorlax wakes up! It looks angry but then yawns and wanders off. You can catch it!", effects: { catchPokemon: 143 } },
                        { weight: 40, narration: "Snorlax wakes, stretches, and ambles away. The path is clear!", effects: {} }
                    ]
                },
                {
                    text: "Feed it (10 food)",
                    outcomes: [
                        { weight: 50, narration: "Snorlax eats and rolls aside happily!", effects: { food: -10 } },
                        { weight: 50, narration: "Snorlax eats your food... and falls back asleep. You squeeze past.", effects: { food: -10 } }
                    ]
                },
                {
                    text: "Go around (lose 2 days)",
                    outcomes: [
                        { weight: 100, narration: "You take a lengthy detour around the sleeping giant.", effects: { daysLost: 2 } }
                    ]
                }
            ]
        },

        // ===== LEGENDARY ENCOUNTERS =====
        {
            id: "articuno_encounter",
            type: "legendary",
            name: "Articuno Appears!",
            description: "The air turns frigid. Ice crystals form in the air. A magnificent blue bird descends from the sky!",
            weight: 3,
            oneTime: true,
            locationIds: ["seafoam_islands"],
            choices: [
                {
                    text: "Throw an Ultra Ball!",
                    requiresItem: "ultraballs",
                    outcomes: [
                        { weight: 20, narration: "Incredible! Articuno is caught! The legendary bird joins your team!", effects: { ultraballs: -1, catchPokemon: 144 } },
                        { weight: 80, narration: "Articuno breaks free and flies away into the blizzard!", effects: { ultraballs: -1 } }
                    ]
                },
                {
                    text: "Observe in awe",
                    outcomes: [
                        { weight: 100, narration: "Articuno's beauty is mesmerizing. It cries out and a chill fills your heart. A truly legendary sight.", effects: { seePokemon: 144 } }
                    ]
                },
                {
                    text: "Retreat from the cold",
                    outcomes: [
                        { weight: 100, narration: "The cold is too much. You retreat to safety.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "zapdos_storm",
            type: "legendary",
            name: "Zapdos Storm!",
            description: "Lightning fills the sky! Through the electric storm, you see the silhouette of a massive electric bird!",
            weight: 3,
            oneTime: true,
            minDay: 15,
            choices: [
                {
                    text: "Throw an Ultra Ball!",
                    requiresItem: "ultraballs",
                    bonusAbility: "flash",
                    outcomes: [
                        { weight: 15, narration: "The Ultra Ball flies true! Zapdos is captured!", effects: { ultraballs: -1, catchPokemon: 145 } },
                        { weight: 85, narration: "Zapdos shatters the ball with a thunderbolt and vanishes!", effects: { ultraballs: -1 } }
                    ],
                    bonusOutcome: { weight: 35, narration: "Your Electric-type calms Zapdos! The Ultra Ball connects! Zapdos is caught!", effects: { ultraballs: -1, catchPokemon: 145 } }
                },
                {
                    text: "Take shelter",
                    outcomes: [
                        { weight: 70, narration: "You find shelter as Zapdos flies off into the storm.", effects: { seePokemon: 145 } },
                        { weight: 30, narration: "Lightning strikes near you! A Pokemon is paralyzed!", effects: { statusRandom: "paralyzed", seePokemon: 145 } }
                    ]
                }
            ]
        },
        {
            id: "moltres_volcano",
            type: "legendary",
            name: "Moltres Rises!",
            description: "The ground shakes. Lava bubbles nearby. From the volcanic flames, Moltres emerges in blazing glory!",
            weight: 3,
            oneTime: true,
            locationIds: ["cinnabar_island"],
            choices: [
                {
                    text: "Throw an Ultra Ball!",
                    requiresItem: "ultraballs",
                    bonusAbility: "fire",
                    outcomes: [
                        { weight: 15, narration: "Against all odds, the Ultra Ball holds! Moltres is yours!", effects: { ultraballs: -1, catchPokemon: 146 } },
                        { weight: 85, narration: "Moltres melts the ball instantly and soars away!", effects: { ultraballs: -1 } }
                    ],
                    bonusOutcome: { weight: 30, narration: "Your Fire-type resonates with Moltres! The catch succeeds!", effects: { ultraballs: -1, catchPokemon: 146 } }
                },
                {
                    text: "Shield your team",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 50, narration: "The heat is unbearable! A Pokemon is burned!", effects: { partyDamage: 1, seePokemon: 146 } },
                        { weight: 50, narration: "You endure the heat as Moltres flies into the sky.", effects: { seePokemon: 146 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type protects everyone from the heat!", effects: { seePokemon: 146 } }
                }
            ]
        },
        {
            id: "mewtwo_cave",
            type: "legendary",
            name: "The Unknown Dungeon!",
            description: "Deep in a cave behind Cerulean City, you sense an overwhelming psychic presence. The air itself vibrates with power.",
            weight: 2,
            oneTime: true,
            minDay: 25,
            minBadges: 6,
            choices: [
                {
                    text: "Challenge Mewtwo!",
                    requiresItem: "ultraballs",
                    outcomes: [
                        { weight: 10, narration: "The Ultra Ball shakes once... twice... three times... CLICK! You caught MEWTWO!", effects: { ultraballs: -1, catchPokemon: 150 } },
                        { weight: 50, narration: "Mewtwo psychically destroys the ball! Your team takes massive damage!", effects: { ultraballs: -1, partyDamage: 3 } },
                        { weight: 40, narration: "Mewtwo swats the ball away and teleports. Your team is shaken.", effects: { ultraballs: -1, partyDamage: 1 } }
                    ]
                },
                {
                    text: "Retreat immediately",
                    outcomes: [
                        { weight: 80, narration: "Wisdom prevails. You leave the cave unharmed.", effects: { seePokemon: 150 } },
                        { weight: 20, narration: "As you turn, a psychic blast hits your team!", effects: { partyDamage: 1, seePokemon: 150 } }
                    ]
                }
            ]
        },

        // ===== CAVE / ROUTE HAZARDS =====
        {
            id: "cave_collapse",
            type: "hazard",
            name: "Cave Collapse!",
            description: "The ceiling rumbles! Rocks start falling all around you!",
            weight: 8,
            oneTime: false,
            minDay: 3,
            terrainTypes: ["cave", "mountain"],
            choices: [
                {
                    text: "Run through!",
                    bonusAbility: "dig",
                    outcomes: [
                        { weight: 40, narration: "You sprint through the falling rocks! Everyone makes it!", effects: {} },
                        { weight: 35, narration: "Rocks hit your team! A Pokemon is injured.", effects: { partyDamage: 1 } },
                        { weight: 25, narration: "A major collapse! Multiple Pokemon are hurt!", effects: { partyDamage: 2 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Ground-type digs a safe tunnel through the collapse!", effects: {} }
                },
                {
                    text: "Use Escape Rope",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 100, narration: "The Escape Rope pulls you to safety!", effects: { escapeRope: -1 } }
                    ]
                }
            ]
        },
        {
            id: "wild_pokemon_stampede",
            type: "hazard",
            name: "Pokemon Stampede!",
            description: "A herd of Tauros charges down the route! Everything in their path is flattened!",
            weight: 6,
            oneTime: false,
            minDay: 8,
            choices: [
                {
                    text: "Stand your ground",
                    bonusAbility: "guard",
                    outcomes: [
                        { weight: 30, narration: "Your Pokemon shield you! But they take damage.", effects: { partyDamage: 2 } },
                        { weight: 40, narration: "A Pokemon gets trampled! Food supplies are scattered!", effects: { partyDamage: 1, food: -10 } },
                        { weight: 30, narration: "One Tauros stops and joins your team in respect!", effects: { partyDamage: 1, catchPokemon: 128 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your defensive Pokemon creates a barrier! The Tauros run around you!", effects: {} }
                },
                {
                    text: "Dodge to the side!",
                    outcomes: [
                        { weight: 60, narration: "You dive out of the way just in time!", effects: {} },
                        { weight: 40, narration: "Almost made it! Some supplies get trampled.", effects: { food: -5, pokeballs: -2 } }
                    ]
                }
            ]
        },
        {
            id: "poison_swamp",
            type: "hazard",
            name: "Toxic Swamp!",
            description: "The path leads through a foul-smelling swamp. Grimer and Muk lurk in the toxic water.",
            weight: 7,
            oneTime: false,
            minDay: 6,
            choices: [
                {
                    text: "Wade through",
                    bonusAbility: "poison",
                    outcomes: [
                        { weight: 40, narration: "The toxic sludge poisons one of your Pokemon!", effects: { statusRandom: "poisoned" } },
                        { weight: 30, narration: "You make it through but feel sick. Food tastes wrong.", effects: { food: -5 } },
                        { weight: 30, narration: "A wild Grimer attacks as you pass!", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Poison-type navigates the swamp easily and keeps everyone safe!", effects: {} }
                },
                {
                    text: "Find a way around",
                    outcomes: [
                        { weight: 100, narration: "A longer path, but a safer one.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        },
        {
            id: "strong_current",
            type: "hazard",
            name: "Strong Current!",
            description: "The water route has a dangerously strong current! Waves crash against the rocks.",
            weight: 10,
            oneTime: false,
            terrainTypes: ["water"],
            choices: [
                {
                    text: "Swim through",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 40, narration: "The current is brutal! A Pokemon is swept away... but returns safely.", effects: { partyDamage: 1 } },
                        { weight: 30, narration: "You lose some supplies to the waves!", effects: { food: -8, pokeballs: -2 } },
                        { weight: 30, narration: "You fight the current and make it through exhausted.", effects: { food: -5 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type Pokemon guides everyone through the current safely!", effects: {} }
                },
                {
                    text: "Wait for calmer waters",
                    outcomes: [
                        { weight: 100, narration: "You wait a day for the current to subside.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        },

        // ===== POSITIVE EVENTS =====
        {
            id: "berry_grove",
            type: "discovery",
            name: "Berry Grove!",
            description: "You stumble upon a grove full of berry trees! Berries everywhere!",
            weight: 10,
            oneTime: false,
            choices: [
                {
                    text: "Gather berries",
                    outcomes: [
                        { weight: 60, narration: "You gather armfuls of berries! Great for food!", effects: { food: 15 } },
                        { weight: 30, narration: "Lots of berries, plus some have healing properties!", effects: { food: 10, potions: 1 } },
                        { weight: 10, narration: "A wild Pokemon guards the best berries! You grab what you can.", effects: { food: 8 } }
                    ]
                }
            ]
        },
        {
            id: "traveling_merchant",
            type: "story",
            name: "Traveling Merchant!",
            description: "A shady merchant appears. \"Psst... hey kid. Wanna buy some rare items? Special prices, just for you!\"",
            weight: 8,
            oneTime: false,
            minDay: 4,
            choices: [
                {
                    text: "Buy Rare Candy (1500)",
                    requiresMoney: 1500,
                    outcomes: [
                        { weight: 70, narration: "It's a real Rare Candy! What a deal!", effects: { money: -1500, rareCandy: 1 } },
                        { weight: 30, narration: "It's a fake! Just a painted rock. You've been scammed!", effects: { money: -1500 } }
                    ]
                },
                {
                    text: "Buy supplies bundle (800)",
                    requiresMoney: 800,
                    outcomes: [
                        { weight: 80, narration: "Good deal! Pokeballs, potions, and food!", effects: { money: -800, pokeballs: 5, potions: 2, food: 10 } },
                        { weight: 20, narration: "Half the Pokeballs are cracked! Only some work.", effects: { money: -800, pokeballs: 2, potions: 1, food: 5 } }
                    ]
                },
                {
                    text: "\"No thanks.\"",
                    outcomes: [
                        { weight: 100, narration: "The merchant shrugs and disappears into the bushes.", effects: {} }
                    ]
                }
            ]
        },

        // ===== VICTORY ROAD / ENDGAME =====
        {
            id: "victory_road_cave",
            type: "hazard",
            name: "Victory Road!",
            description: "The final stretch! Victory Road is a treacherous cave filled with the strongest wild Pokemon. Only the worthy make it through!",
            weight: 15,
            oneTime: false,
            locationIds: ["indigo_plateau"],
            choices: [
                {
                    text: "Brave Victory Road!",
                    outcomes: [
                        { weight: 30, narration: "Your team pushes through with determination! Indigo Plateau is in sight!", effects: { partyDamage: 1 } },
                        { weight: 40, narration: "A brutal gauntlet! Your team is battered but standing!", effects: { partyDamage: 2 } },
                        { weight: 20, narration: "The cave nearly claims your team. Everyone is exhausted.", effects: { partyDamage: 3, food: -10 } },
                        { weight: 10, narration: "Incredibly, your team is inspired and powers through unscathed!", effects: {} }
                    ]
                },
                {
                    text: "Use Escape Rope if things go bad",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 50, narration: "You make it through with minimal damage!", effects: { partyDamage: 1 } },
                        { weight: 50, narration: "Things get bad — you use the rope but still take damage.", effects: { escapeRope: -1, partyDamage: 1 } }
                    ]
                }
            ]
        },
        {
            id: "elite_four_challenge",
            type: "special",
            name: "The Elite Four!",
            description: "You've reached the Pokemon League! The Elite Four await. This is the final challenge!",
            weight: 60,
            oneTime: false,
            locationIds: ["indigo_plateau"],
            minBadges: 4,
            choices: [
                {
                    text: "Challenge the Elite Four!",
                    outcomes: [
                        { weight: 25, narration: "Against all odds, you defeat all four and become CHAMPION! Your name will be remembered forever!", effects: { partyDamage: 2, champion: true } },
                        { weight: 35, narration: "You defeat Lorelei and Bruno, but Agatha's ghosts overwhelm you. A valiant effort!", effects: { partyDamage: 3, money: 2000 } },
                        { weight: 25, narration: "Lorelei's ice types freeze your team. You're eliminated in the first round.", effects: { partyDamage: 2, money: 1000 } },
                        { weight: 15, narration: "You defeat ALL FOUR and become Champion! Lance himself congratulates you!", effects: { partyDamage: 3, champion: true, money: 5000 } }
                    ]
                },
                {
                    text: "You've made it far enough",
                    outcomes: [
                        { weight: 100, narration: "You decide reaching the Plateau is victory enough. And that's okay.", effects: {} }
                    ]
                }
            ]
        },

        // ===== PERMANENT DEATH EVENTS =====
        // Forest / Route Deaths
        {
            id: "death_beedrill_swarm",
            type: "hazard",
            name: "Beedrill Swarm!",
            description: "You accidentally disturb a Beedrill nest! A furious swarm descends on your party with lethal stingers!",
            weight: 4,
            oneTime: false,
            minDay: 8,
            terrainTypes: ["town", "city"],
            choices: [
                {
                    text: "Run for it!",
                    bonusAbility: "fire",
                    outcomes: [
                        { weight: 40, narration: "You escape but one of your Pokemon is stung badly and doesn't make it...", effects: { pokemonDeath: true, partyDamage: 1 } },
                        { weight: 40, narration: "The swarm is relentless! Your team takes heavy damage.", effects: { partyDamage: 2 } },
                        { weight: 20, narration: "You sprint through the forest and barely escape!", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Fire-type scorches the air and the Beedrill scatter!", effects: {} }
                },
                {
                    text: "Use Repel",
                    requiresItem: "repels",
                    outcomes: [
                        { weight: 100, narration: "The Repel drives the Beedrill away! Crisis averted.", effects: { repels: -1 } }
                    ]
                }
            ]
        },
        // Mountain Deaths
        {
            id: "death_avalanche",
            type: "hazard",
            name: "Avalanche!",
            description: "The mountain trembles! An avalanche of snow and rock cascades toward you at terrifying speed!",
            weight: 5,
            oneTime: false,
            minDay: 10,
            terrainTypes: ["mountain"],
            choices: [
                {
                    text: "Shield your team!",
                    bonusAbility: "guard",
                    outcomes: [
                        { weight: 35, narration: "The avalanche buries one of your Pokemon under tons of rock... they're gone.", effects: { pokemonDeath: true, partyDamage: 1 } },
                        { weight: 35, narration: "Your team is battered by rocks and snow. Everyone is hurt badly.", effects: { partyDamage: 2 } },
                        { weight: 30, narration: "You find shelter behind a boulder just in time!", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your defensive Pokemon creates a barrier! The avalanche flows around you!", effects: {} }
                },
                {
                    text: "Use Escape Rope",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 100, narration: "The Escape Rope yanks you to safety just in time!", effects: { escapeRope: -1 } }
                    ]
                }
            ]
        },
        // Ocean Deaths
        {
            id: "death_whirlpool",
            type: "hazard",
            name: "Massive Whirlpool!",
            description: "A monstrous whirlpool opens up beneath your team! The current drags everything down!",
            weight: 5,
            oneTime: false,
            minDay: 12,
            terrainTypes: ["water"],
            choices: [
                {
                    text: "Swim against the current!",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 40, narration: "The whirlpool drags one of your Pokemon into the depths... they don't resurface.", effects: { pokemonDeath: true } },
                        { weight: 30, narration: "Everyone fights the current. Your supplies are scattered!", effects: { partyDamage: 1, food: -15, pokeballs: -3 } },
                        { weight: 30, narration: "You narrowly escape the edge of the whirlpool!", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type powers through the current and guides everyone to safety!", effects: {} }
                }
            ]
        },
        // Cave Deaths
        {
            id: "death_cave_gas",
            type: "hazard",
            name: "Toxic Cave Gas!",
            description: "A pocket of poisonous gas erupts from a crack in the cave floor! The air turns deadly green!",
            weight: 5,
            oneTime: false,
            minDay: 10,
            terrainTypes: ["cave"],
            choices: [
                {
                    text: "Hold your breath and run!",
                    bonusAbility: "poison",
                    outcomes: [
                        { weight: 35, narration: "One of your Pokemon inhales too much... the poison is fatal.", effects: { pokemonDeath: true, statusRandom: "poisoned" } },
                        { weight: 35, narration: "Everyone is poisoned! You need medicine fast!", effects: { partyDamage: 1, statusRandom: "poisoned" } },
                        { weight: 30, narration: "You hold your breath and make it through the gas cloud!", effects: {} }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Poison-type absorbs the toxic fumes — they're immune!", effects: {} }
                },
                {
                    text: "Use Escape Rope",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 100, narration: "You escape the cave before the gas spreads!", effects: { escapeRope: -1 } }
                    ]
                }
            ]
        },
        // Volcanic / Cinnabar Deaths
        {
            id: "death_eruption",
            type: "hazard",
            name: "Volcanic Eruption!",
            description: "The ground splits open! Lava shoots into the sky! Cinnabar's volcano is erupting!",
            weight: 8,
            oneTime: false,
            minDay: 18,
            locationIds: ["cinnabar_island"],
            choices: [
                {
                    text: "Flee the lava!",
                    bonusAbility: "fire",
                    outcomes: [
                        { weight: 40, narration: "A lava flow cuts off one of your Pokemon... there's nothing you can do.", effects: { pokemonDeath: true, partyDamage: 1 } },
                        { weight: 30, narration: "The heat is unbearable! Your team suffers burns!", effects: { partyDamage: 2 } },
                        { weight: 30, narration: "You outrun the lava flow! Close call!", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Fire-type navigates the lava flows and leads everyone to safety!", effects: {} }
                }
            ]
        },
        // Haunted / Lavender Town Deaths
        {
            id: "death_ghost_curse",
            type: "hazard",
            name: "Ghostly Curse!",
            description: "A vengeful spirit descends from Pokemon Tower! Its eyes glow with malice as it points at your team!",
            weight: 8,
            oneTime: false,
            minDay: 10,
            locationIds: ["lavender_town"],
            choices: [
                {
                    text: "Stand your ground!",
                    bonusAbility: "psychic",
                    outcomes: [
                        { weight: 40, narration: "The ghost's curse claims one of your Pokemon... they fade away before your eyes.", effects: { pokemonDeath: true } },
                        { weight: 30, narration: "The curse weakens your team! Everyone feels drained.", effects: { partyDamage: 2 } },
                        { weight: 30, narration: "Your Pokemon resist the curse! The ghost wails and vanishes.", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Psychic-type shields the team! The ghost is banished!", effects: {} }
                },
                {
                    text: "Flee the tower!",
                    outcomes: [
                        { weight: 70, narration: "You run from Pokemon Tower as fast as you can!", effects: {} },
                        { weight: 30, narration: "The ghost follows you! One Pokemon is cursed!", effects: { partyDamage: 1 } }
                    ]
                }
            ]
        },
        // Team Rocket Death
        {
            id: "death_rocket_execution",
            type: "combat",
            name: "Team Rocket Ambush - Elite Squad!",
            description: "This isn't a regular grunt. Team Rocket's elite operatives surround you. \"We're done playing games, kid.\"",
            weight: 3,
            oneTime: false,
            minDay: 15,
            minBadges: 3,
            choices: [
                {
                    text: "Fight back!",
                    outcomes: [
                        { weight: 35, narration: "Their Pokemon are brutal. One of yours falls and doesn't get back up...", effects: { pokemonDeath: true, partyDamage: 1 }, trackRocket: true },
                        { weight: 35, narration: "A vicious battle! Your team barely survives.", effects: { partyDamage: 2, money: -500 } },
                        { weight: 30, narration: "Your team fights with everything they have and drives them off!", effects: { partyDamage: 1, money: 1000 }, trackRocket: true }
                    ]
                },
                {
                    text: "Surrender your supplies",
                    outcomes: [
                        { weight: 100, narration: "They take everything valuable and disappear into the shadows.", effects: { money: -2000, pokeballs: -5, food: -15 } }
                    ]
                }
            ]
        },
        // Comedic Oregon Trail Style Deaths
        {
            id: "death_dysentery",
            type: "hazard",
            name: "Bad Berries!",
            description: "Your Pokemon ate some strange berries by the roadside. Their stomachs are NOT happy.",
            weight: 3,
            oneTime: false,
            minDay: 5,
            choices: [
                {
                    text: "Rush to find medicine!",
                    outcomes: [
                        { weight: 30, narration: "One of your Pokemon ate too many bad berries... they didn't make it. The Oregon Trail claims another victim.", effects: { pokemonDeath: true } },
                        { weight: 40, narration: "Severe food poisoning! Everyone is sick for days.", effects: { partyDamage: 1, daysLost: 2 } },
                        { weight: 30, narration: "False alarm! Just some mild indigestion.", effects: { daysLost: 1 } }
                    ]
                },
                {
                    text: "Use Potion",
                    requiresItem: "potions",
                    outcomes: [
                        { weight: 100, narration: "The Potion settles their stomachs. Crisis averted!", effects: { potions: -1 } }
                    ]
                }
            ]
        },
        {
            id: "death_ford_river",
            type: "hazard",
            name: "River Crossing!",
            description: "You must ford the river! The water is 3 feet deep and moving fast. Your Pokemon eye the rushing water nervously.",
            weight: 4,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["water"],
            choices: [
                {
                    text: "Ford the river!",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 25, narration: "The current is too strong! One of your Pokemon is swept away and lost!", effects: { pokemonDeath: true, food: -5 } },
                        { weight: 35, narration: "You lose food and supplies to the current, but everyone makes it!", effects: { food: -10, pokeballs: -2 } },
                        { weight: 40, narration: "You ford the river safely! That wasn't so bad.", effects: {} }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type ferries everyone across with ease!", effects: {} }
                },
                {
                    text: "Go around (lose 2 days)",
                    outcomes: [
                        { weight: 100, narration: "You take the long way around. Safe but slow.", effects: { daysLost: 2 } }
                    ]
                }
            ]
        },
        {
            id: "death_broken_wheel",
            type: "hazard",
            name: "Broken Trail!",
            description: "The path ahead has completely collapsed! A massive sinkhole blocks the entire route!",
            weight: 3,
            oneTime: false,
            minDay: 8,
            choices: [
                {
                    text: "Jump across!",
                    bonusAbility: "fly",
                    outcomes: [
                        { weight: 30, narration: "One of your Pokemon misjudges the jump and falls into the sinkhole...", effects: { pokemonDeath: true } },
                        { weight: 40, narration: "Everyone makes it, but barely. That was terrifying.", effects: { partyDamage: 1 } },
                        { weight: 30, narration: "A perfect leap! Everyone clears the gap!", effects: {} }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Flying-type carries everyone safely over!", effects: {} }
                },
                {
                    text: "Find another way (lose 2 days)",
                    outcomes: [
                        { weight: 100, narration: "You backtrack and find a detour. Long but safe.", effects: { daysLost: 2 } }
                    ]
                }
            ]
        },

        // ===== NEW VARIETY EVENTS =====
        // Resource Events
        {
            id: "abandoned_camp",
            type: "discovery",
            name: "Abandoned Campsite!",
            description: "You find an abandoned trainer's campsite. Supplies are scattered everywhere. Looks like they left in a hurry...",
            weight: 8,
            oneTime: false,
            minDay: 3,
            choices: [
                {
                    text: "Search the camp",
                    outcomes: [
                        { weight: 30, narration: "Jackpot! Food, Pokeballs, and money!", effects: { food: 15, pokeballs: 3, money: 500 } },
                        { weight: 30, narration: "Some supplies left behind. Better than nothing!", effects: { food: 8, potions: 1 } },
                        { weight: 20, narration: "A Rare Candy tucked in a backpack!", effects: { rareCandy: 1, food: 5 } },
                        { weight: 20, narration: "The camp is booby-trapped! Team Rocket!", effects: { partyDamage: 1 } }
                    ]
                },
                {
                    text: "Leave it alone",
                    outcomes: [
                        { weight: 100, narration: "Could be a trap. You move on carefully.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "fishing_spot",
            type: "discovery",
            name: "Fishing Spot!",
            description: "A beautiful lake with crystal clear water. You can see Pokemon swimming beneath the surface!",
            weight: 8,
            oneTime: false,
            terrainTypes: ["water"],
            choices: [
                {
                    text: "Fish for a while",
                    outcomes: [
                        { weight: 30, narration: "You catch a delicious meal! Your food stocks are replenished.", effects: { food: 12 } },
                        { weight: 25, narration: "A Magikarp splashes onto shore and joins your team!", effects: { catchPokemon: 129, food: 5 } },
                        { weight: 25, narration: "You relax and fish. The peace restores your Pokemon's spirits.", effects: { food: 8, healOne: true } },
                        { weight: 20, narration: "A Gyarados lurks below! You flee before it surfaces!", effects: { seePokemon: 130 } }
                    ]
                }
            ]
        },
        {
            id: "trainer_battle",
            type: "combat",
            name: "Trainer Challenge!",
            description: "A fellow trainer spots you and wants to battle! \"Hey! You look strong! Let's see what you've got!\"",
            weight: 10,
            oneTime: false,
            minDay: 2,
            choices: [
                {
                    text: "Accept the challenge!",
                    outcomes: [
                        { weight: 40, narration: "Your Pokemon outperforms theirs! The trainer pays up.", effects: { money: 800 } },
                        { weight: 30, narration: "A close battle! You win and the trainer shares some tips and food.", effects: { money: 400, food: 5 } },
                        { weight: 30, narration: "Their Pokemon is too strong! You lose the match and some cash.", effects: { partyDamage: 1, money: -300 } }
                    ]
                },
                {
                    text: "\"Not right now.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Aw man, next time then!\" The trainer waves goodbye.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "pokemart_sale",
            type: "story",
            name: "PokeMart Sale!",
            description: "A PokeMart is having a blowout sale! \"Everything must go! Unbeatable prices!\"",
            weight: 6,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["town", "city"],
            choices: [
                {
                    text: "Buy the mega bundle (2000)",
                    requiresMoney: 2000,
                    outcomes: [
                        { weight: 70, narration: "Great deals! You stock up on everything!", effects: { money: -2000, pokeballs: 10, greatballs: 3, potions: 5, food: 20, repels: 2 } },
                        { weight: 30, narration: "Amazing deal! They even throw in an Ultra Ball!", effects: { money: -2000, pokeballs: 8, greatballs: 2, ultraballs: 1, potions: 4, food: 15 } }
                    ]
                },
                {
                    text: "Buy basic supplies (500)",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 100, narration: "You grab the essentials. Good enough!", effects: { money: -500, pokeballs: 5, potions: 2, food: 10 } }
                    ]
                },
                {
                    text: "\"Just browsing.\"",
                    outcomes: [
                        { weight: 100, narration: "You browse the shelves but decide to save your money.", effects: {} }
                    ]
                }
            ]
        },
        // Exploration Events
        {
            id: "old_man_wisdom",
            type: "story",
            name: "Old Man's Wisdom!",
            description: "An old man sits by the road, whittling. \"Ah, a young trainer. Let me tell you something my grandfather told me...\"",
            weight: 6,
            oneTime: false,
            choices: [
                {
                    text: "Listen to his story",
                    outcomes: [
                        { weight: 40, narration: "He tells you where to find hidden items nearby! You search and find treasure!", effects: { money: 1000, potions: 2 } },
                        { weight: 30, narration: "He shares ancient healing wisdom. Your Pokemon feel renewed!", effects: { healAll: true } },
                        { weight: 30, narration: "He rambles for hours. You learn nothing but lost a day.", effects: { daysLost: 1 } }
                    ]
                },
                {
                    text: "Politely decline",
                    outcomes: [
                        { weight: 100, narration: "\"Kids these days...\" He goes back to whittling.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "daycare_couple",
            type: "story",
            name: "Pokemon Day Care!",
            description: "An elderly couple runs a Pokemon Day Care. \"We'll look after your Pokemon! They come back stronger!\"",
            weight: 5,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["town", "city"],
            choices: [
                {
                    text: "Rest here (lose 1 day)",
                    outcomes: [
                        { weight: 50, narration: "The couple feeds your team home-cooked meals. Everyone heals up!", effects: { healAll: true, food: 5, daysLost: 1 } },
                        { weight: 30, narration: "They give your Pokemon special vitamins! +1 HP to one!", effects: { healAll: true, daysLost: 1 } },
                        { weight: 20, narration: "One of your Pokemon hatched an egg! ...It was just a rock. But the rest was nice.", effects: { healAll: true, daysLost: 1 } }
                    ]
                },
                {
                    text: "Keep moving",
                    outcomes: [
                        { weight: 100, narration: "No time to stop! You wave as you pass by.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "wild_pikachu_pack",
            type: "discovery",
            name: "Wild Pikachu Pack!",
            description: "A group of wild Pikachu are playing in a field, generating sparks of electricity!",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                {
                    text: "Try to catch one!",
                    outcomes: [
                        { weight: 40, narration: "One Pikachu is curious about you and joins your team!", effects: { catchPokemon: 25 } },
                        { weight: 30, narration: "They shock you and run away! Your team is paralyzed!", effects: { statusRandom: "paralyzed" } },
                        { weight: 30, narration: "They're too fast! They scatter before you can throw a ball.", effects: {} }
                    ]
                },
                {
                    text: "Watch them play",
                    outcomes: [
                        { weight: 100, narration: "Watching the Pikachu play cheers up your Pokemon. One is healed!", effects: { healOne: true, seePokemon: 25 } }
                    ]
                }
            ]
        },
        // Character Events
        {
            id: "bill_pc",
            type: "story",
            name: "Bill's House!",
            description: "You find a strange house with a massive satellite dish. A voice calls from inside: \"Help! I turned myself into a Pokemon again!\"",
            weight: 8,
            oneTime: true,
            locationIds: ["cerulean_city"],
            choices: [
                {
                    text: "Help Bill",
                    outcomes: [
                        { weight: 60, narration: "You help Bill revert to human form! He gives you a ticket for the S.S. Anne and some Pokeballs!", effects: { pokeballs: 5, money: 1000 } },
                        { weight: 40, narration: "Bill is so grateful, he gives you an Eevee from his Pokemon collection!", effects: { catchPokemon: 133 } }
                    ]
                },
                {
                    text: "That sounds dangerous...",
                    outcomes: [
                        { weight: 100, narration: "You slowly back away from the house. Some things are best left alone.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "mr_pokemon_trade",
            type: "story",
            name: "Pokemon Trader!",
            description: "A collector approaches you. \"I'll trade you something special if you have what I need!\"",
            weight: 6,
            oneTime: false,
            minDay: 5,
            choices: [
                {
                    text: "See what they offer",
                    outcomes: [
                        { weight: 35, narration: "They give you Great Balls for your regular ones! Upgrade!", effects: { pokeballs: -5, greatballs: 3 } },
                        { weight: 35, narration: "They trade you Super Potions for regular ones! Nice!", effects: { potions: -3, superPotions: 2 } },
                        { weight: 30, narration: "They only wanted common Pokemon. Nothing interesting to trade.", effects: {} }
                    ]
                },
                {
                    text: "\"No thanks.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Your loss!\" The trader moves on.", effects: {} }
                    ]
                }
            ]
        },
        // More Hazard Events
        {
            id: "wild_pokemon_attack",
            type: "hazard",
            name: "Aggressive Wild Pokemon!",
            description: "A territorial wild Pokemon leaps from the bushes and attacks without warning!",
            weight: 8,
            oneTime: false,
            minDay: 4,
            choices: [
                {
                    text: "Defend yourself!",
                    bonusAbility: "intimidate",
                    outcomes: [
                        { weight: 40, narration: "Your Pokemon takes a hit defending you!", effects: { partyDamage: 1 } },
                        { weight: 30, narration: "A nasty scratch! But you drive it off.", effects: { partyDamage: 1, food: -3 } },
                        { weight: 30, narration: "Your team scares it off! No harm done.", effects: {} }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Pokemon's intimidating presence scares it away immediately!", effects: {} }
                },
                {
                    text: "Use Repel",
                    requiresItem: "repels",
                    outcomes: [
                        { weight: 100, narration: "The Repel drives the wild Pokemon away!", effects: { repels: -1 } }
                    ]
                }
            ]
        },
        {
            id: "sandstorm",
            type: "weather",
            name: "Sandstorm!",
            description: "Swirling sand fills the air! Visibility drops to near zero as the storm intensifies!",
            weight: 7,
            oneTime: false,
            minDay: 7,
            terrainTypes: ["mountain"],
            choices: [
                {
                    text: "Push through",
                    bonusAbility: "dig",
                    outcomes: [
                        { weight: 40, narration: "The sand tears at your team! A Pokemon is badly hurt!", effects: { partyDamage: 1, food: -5 } },
                        { weight: 30, narration: "You get disoriented in the storm! Lost a day wandering.", effects: { daysLost: 1 } },
                        { weight: 30, narration: "You huddle together and push through!", effects: { food: -3 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Ground-type creates a tunnel under the worst of the storm!", effects: {} }
                },
                {
                    text: "Wait it out",
                    outcomes: [
                        { weight: 100, narration: "You find shelter and wait. The storm passes in a day.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        },
        {
            id: "food_theft",
            type: "hazard",
            name: "Sneaky Meowth!",
            description: "While you sleep, a wild Meowth sneaks into your camp and goes for your food supply!",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                {
                    text: "Chase it!",
                    outcomes: [
                        { weight: 40, narration: "You catch the Meowth! It drops the food and runs. Nothing lost!", effects: {} },
                        { weight: 30, narration: "It's too fast! It steals a bunch of food!", effects: { food: -12 } },
                        { weight: 30, narration: "You corner it, and it decides to join you instead!", effects: { catchPokemon: 52, food: -5 } }
                    ]
                },
                {
                    text: "Let it go",
                    outcomes: [
                        { weight: 100, narration: "The Meowth takes some food and scampers off.", effects: { food: -8 } }
                    ]
                }
            ]
        },
        {
            id: "earthquake_event",
            type: "hazard",
            name: "Earthquake!",
            description: "The ground shakes violently! Trees topple and rocks tumble! A powerful earthquake rocks the region!",
            weight: 4,
            oneTime: false,
            minDay: 12,
            choices: [
                {
                    text: "Brace for impact!",
                    bonusAbility: "dig",
                    outcomes: [
                        { weight: 35, narration: "A massive fissure opens! One of your Pokemon falls in and is lost forever!", effects: { pokemonDeath: true } },
                        { weight: 35, narration: "Falling debris hits your team! Everyone takes damage!", effects: { partyDamage: 2, food: -10 } },
                        { weight: 30, narration: "The shaking stops. You're rattled but okay.", effects: { partyDamage: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Ground-type senses the quake early and leads everyone to safety!", effects: {} }
                }
            ]
        },
        {
            id: "blizzard_event",
            type: "weather",
            name: "Blizzard!",
            description: "A vicious blizzard hits! The temperature plummets and visibility is nearly zero! Your Pokemon shiver in the cold.",
            weight: 5,
            oneTime: false,
            minDay: 14,
            terrainTypes: ["mountain", "cave"],
            choices: [
                {
                    text: "Keep moving!",
                    bonusAbility: "fire",
                    outcomes: [
                        { weight: 30, narration: "The cold claims one of your Pokemon... they freeze in the blizzard.", effects: { pokemonDeath: true } },
                        { weight: 35, narration: "Frostbite! Your team is badly hurt by the cold!", effects: { partyDamage: 2, food: -10 } },
                        { weight: 35, narration: "You push through! Cold and hungry, but alive.", effects: { partyDamage: 1, food: -5 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Fire-type keeps everyone warm through the blizzard!", effects: { food: -3 } }
                },
                {
                    text: "Build a shelter and wait",
                    outcomes: [
                        { weight: 100, narration: "You hunker down for two days until the blizzard passes.", effects: { daysLost: 2, food: -8 } }
                    ]
                }
            ]
        },
        // Positive / Fun Events
        {
            id: "lucky_egg",
            type: "discovery",
            name: "Lucky Find!",
            description: "Something is glowing behind a waterfall! You can barely make it out through the mist...",
            weight: 4,
            oneTime: false,
            minDay: 8,
            choices: [
                {
                    text: "Investigate",
                    outcomes: [
                        { weight: 30, narration: "A hidden cave behind the waterfall! Rare Candy and Ultra Balls!", effects: { rareCandy: 1, ultraballs: 2 } },
                        { weight: 30, narration: "An ancient treasure cache! Loads of money!", effects: { money: 3000 } },
                        { weight: 20, narration: "A healing spring! All your Pokemon are fully restored!", effects: { healAll: true } },
                        { weight: 20, narration: "It was just a shiny rock. But at least the scenery is nice.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "pokemon_ranger",
            type: "story",
            name: "Pokemon Ranger!",
            description: "A Pokemon Ranger approaches. \"I patrol these routes to keep trainers safe. Need any help?\"",
            weight: 6,
            oneTime: false,
            minDay: 5,
            choices: [
                {
                    text: "Ask for help",
                    outcomes: [
                        { weight: 40, narration: "The Ranger heals your Pokemon and shares supplies!", effects: { healAll: true, food: 10, potions: 2 } },
                        { weight: 30, narration: "The Ranger gives you a map shortcut! You save time!", effects: { food: 5 } },
                        { weight: 30, narration: "The Ranger escorts you safely through dangerous territory!", effects: { healOne: true } }
                    ]
                },
                {
                    text: "\"I'm fine, thanks!\"",
                    outcomes: [
                        { weight: 100, narration: "\"Stay safe out there!\" The Ranger continues their patrol.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "lost_child",
            type: "story",
            name: "Lost Child!",
            description: "A young kid is crying by the road. \"I-I can't find my mommy! I was looking for Pokemon and got lost!\"",
            weight: 5,
            oneTime: false,
            choices: [
                {
                    text: "Help them find their parent",
                    outcomes: [
                        { weight: 50, narration: "You find their parent nearby. They reward you generously!", effects: { money: 1500, food: 10, daysLost: 1 } },
                        { weight: 30, narration: "It takes a while, but you reunite them! The grateful family shares a meal.", effects: { food: 15, healAll: true, daysLost: 1 } },
                        { weight: 20, narration: "It was a trap! The kid was a Team Rocket decoy!", effects: { money: -500, pokeballs: -3 } }
                    ]
                },
                {
                    text: "Point them to town",
                    outcomes: [
                        { weight: 100, narration: "You point the way to the nearest town and wish them luck.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "star_shower",
            type: "discovery",
            name: "Meteor Shower!",
            description: "The night sky lights up with a brilliant meteor shower! Your Pokemon stare in wonder at the cosmic display!",
            weight: 4,
            oneTime: false,
            minDay: 10,
            choices: [
                {
                    text: "Make a wish!",
                    outcomes: [
                        { weight: 25, narration: "A meteor fragment lands nearby! It's a Moon Stone! (Rare Candy)", effects: { rareCandy: 1 } },
                        { weight: 25, narration: "The cosmic energy revitalizes your team! Everyone is healed!", effects: { healAll: true } },
                        { weight: 25, narration: "A wild Clefairy appears, drawn by the meteors, and joins you!", effects: { catchPokemon: 35 } },
                        { weight: 25, narration: "A beautiful night. Your Pokemon are inspired and rest well.", effects: { healOne: true } }
                    ]
                }
            ]
        },
        {
            id: "ferry_service",
            type: "story",
            name: "Ferry Service!",
            description: "A sailor offers to ferry you and your Pokemon across the water. \"Hop aboard! It'll save you days of travel!\"",
            weight: 6,
            oneTime: false,
            minDay: 8,
            terrainTypes: ["water"],
            choices: [
                {
                    text: "Pay for the ferry (300)",
                    requiresMoney: 300,
                    outcomes: [
                        { weight: 70, narration: "A smooth ride! You save time and your Pokemon rest.", effects: { money: -300, healOne: true } },
                        { weight: 30, narration: "Rough waters! The ferry rocks but you make it safely. The sailor gives a discount.", effects: { money: -150 } }
                    ]
                },
                {
                    text: "Swim across",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 50, narration: "The swim is exhausting but free!", effects: { food: -5 } },
                        { weight: 50, narration: "Strong currents slow you down.", effects: { daysLost: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type makes the crossing effortless!", effects: {} }
                }
            ]
        },
        {
            id: "haunted_forest",
            type: "hazard",
            name: "Haunted Forest!",
            description: "The trees seem to close in around you. Strange sounds echo through the darkness. Eyes watch from the shadows...",
            weight: 5,
            oneTime: false,
            minDay: 7,
            choices: [
                {
                    text: "Press forward",
                    bonusAbility: "flash",
                    outcomes: [
                        { weight: 30, narration: "Ghost Pokemon torment your team all night! Everyone is exhausted.", effects: { partyDamage: 1, daysLost: 1 } },
                        { weight: 30, narration: "You get lost in the twisting paths!", effects: { daysLost: 2 } },
                        { weight: 20, narration: "A wild Gastly is intrigued by your courage and joins you!", effects: { catchPokemon: 92 } },
                        { weight: 20, narration: "You find an ancient shrine with an offering — Escape Rope!", effects: { escapeRope: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Pokemon lights the way! The ghosts flee from the brightness!", effects: {} }
                },
                {
                    text: "Go around (lose 1 day)",
                    outcomes: [
                        { weight: 100, narration: "You take the long way around the spooky forest.", effects: { daysLost: 1 } }
                    ]
                }
            ]
        }
    ];
})();

