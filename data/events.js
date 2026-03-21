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
        },

        // ===== FOREST DEATH EVENTS =====
        {
            id: "death_venomoth_nest",
            type: "hazard",
            name: "Venomoth Nest!",
            description: "Your Pokemon wandered into a Venomoth nest and disturbed the swarm!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["town", "city"],
            choices: [
                { text: "Try to flee", outcomes: [
                    { weight: 50, narration: "Your Pokemon didn't make it out of the swarm in time.", effects: { pokemonDeath: true } },
                    { weight: 50, narration: "You barely escape the toxic cloud!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use a Potion to help", requiresItem: "potions", outcomes: [
                    { weight: 70, narration: "You treat the poisoning just in time!", effects: { potions: -1 } },
                    { weight: 30, narration: "The poison was too strong. One Pokemon didn't survive.", effects: { potions: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_fearow_snatch",
            type: "hazard",
            name: "Fearow Attack!",
            description: "A wild Fearow swoops down from the treetops toward your party!",
            weight: 4,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Defend your Pokemon", outcomes: [
                    { weight: 40, narration: "The Fearow snatched one of your Pokemon from the group!", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You drive the Fearow away, but your team is shaken.", effects: { partyDamage: 1 } }
                ]},
                { text: "Hide and wait", outcomes: [
                    { weight: 70, narration: "The Fearow circles overhead then flies away.", effects: {} },
                    { weight: 30, narration: "It spotted you! One Pokemon was carried off!", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_parasect_colony",
            type: "hazard",
            name: "Parasect Colony!",
            description: "Your Pokemon disturbed a colony of angry Parasect. Toxic spores fill the air!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            choices: [
                { text: "Run through the spores", outcomes: [
                    { weight: 45, narration: "The toxic spores overwhelmed one of your Pokemon.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "Everyone makes it through coughing and wheezing!", effects: { partyDamage: 1 } }
                ]},
                { text: "Go around", outcomes: [
                    { weight: 100, narration: "You take the long way around the colony.", effects: { daysLost: 1 } }
                ]}
            ]
        },
        {
            id: "death_vine_trap",
            type: "hazard",
            name: "Tangling Vines!",
            description: "A tangle of vines reaches out and grabs one of your Pokemon, pulling it deep into the forest!",
            weight: 3,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Cut through the vines", outcomes: [
                    { weight: 50, narration: "You hack through the vines but your Pokemon was pulled too deep.", effects: { pokemonDeath: true } },
                    { weight: 50, narration: "You free your Pokemon just in time!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You lasso your Pokemon and pull it free!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The rope snaps! Your Pokemon is pulled into the darkness.", effects: { escapeRope: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_glowing_mushrooms",
            type: "hazard",
            name: "Glowing Mushrooms!",
            description: "Your Pokemon ate some glowing mushrooms growing along the path. They look sick...",
            weight: 4,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Use a Potion quickly", requiresItem: "potions", outcomes: [
                    { weight: 80, narration: "The Potion neutralizes the poison just in time!", effects: { potions: -1 } },
                    { weight: 20, narration: "It wasn't enough. Your Pokemon fell violently ill and didn't recover.", effects: { potions: -1, pokemonDeath: true } }
                ]},
                { text: "Wait and hope for the best", outcomes: [
                    { weight: 40, narration: "Your Pokemon recovers after a rough night.", effects: { partyDamage: 1, daysLost: 1 } },
                    { weight: 60, narration: "The mushrooms were deadly. Your Pokemon didn't survive.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_kakuna_rain",
            type: "hazard",
            name: "Kakuna Storm!",
            description: "A storm shakes the trees and dozens of Kakuna rain down, splitting open into angry Beedrill!",
            weight: 3,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Fight through them", outcomes: [
                    { weight: 40, narration: "The swarm is too thick. One Pokemon goes down.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "Your team fights bravely through the swarm!", effects: { partyDamage: 2 } },
                    { weight: 20, narration: "You scatter the swarm and find some dropped items!", effects: { partyDamage: 1, potions: 1 } }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 90, narration: "The Repel drives the Beedrill away!", effects: { repels: -1 } },
                    { weight: 10, narration: "The swarm is too large for the Repel to handle!", effects: { repels: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "death_mysterious_cry",
            type: "hazard",
            name: "Mysterious Cry!",
            description: "Your Pokemon followed a mysterious cry deep into the woods and hasn't returned...",
            weight: 3,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Search for your Pokemon", outcomes: [
                    { weight: 40, narration: "You search for hours but your Pokemon has vanished forever.", effects: { pokemonDeath: true, daysLost: 1 } },
                    { weight: 40, narration: "You find your Pokemon scared but alive!", effects: { daysLost: 1, partyDamage: 1 } },
                    { weight: 20, narration: "You find your Pokemon — and a wild Pokemon that wants to join!", effects: { daysLost: 1 } }
                ]},
                { text: "Move on without them", outcomes: [
                    { weight: 100, narration: "You leave your Pokemon behind. They never return.", effects: { pokemonDeath: true } }
                ]}
            ]
        },

        // ===== MOUNTAIN DEATH EVENTS =====
        {
            id: "death_rockslide",
            type: "hazard",
            name: "Rockslide!",
            description: "A sudden rockslide crashes down the mountainside toward your party!",
            weight: 5,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["mountain"],
            choices: [
                { text: "Take cover!", outcomes: [
                    { weight: 40, narration: "A boulder crushed one of your Pokemon.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You find shelter just in time! Rocks crash around you.", effects: { partyDamage: 1 } }
                ]},
                { text: "Run back!", outcomes: [
                    { weight: 50, narration: "You escape the rockslide but lose a day backtracking.", effects: { daysLost: 1 } },
                    { weight: 50, narration: "A falling boulder strikes one of your Pokemon as you flee!", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_cliff_slip",
            type: "hazard",
            name: "Cliff Edge!",
            description: "The narrow mountain path crumbles. Your Pokemon slips on the steep cliff!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["mountain"],
            choices: [
                { text: "Grab onto them!", outcomes: [
                    { weight: 50, narration: "You catch your Pokemon just before they fall!", effects: { partyDamage: 1 } },
                    { weight: 50, narration: "The cliff edge crumbles. Your Pokemon plummets.", effects: { pokemonDeath: true } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 85, narration: "You toss the rope and haul your Pokemon to safety!", effects: { escapeRope: -1 } },
                    { weight: 15, narration: "The rope doesn't reach in time.", effects: { escapeRope: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_onix_eruption",
            type: "hazard",
            name: "Wild Onix!",
            description: "A wild Onix erupts from the ground beneath your team! The earth shatters!",
            weight: 4,
            oneTime: false,
            minDay: 7,
            terrainTypes: ["mountain", "cave"],
            choices: [
                { text: "Stand your ground", outcomes: [
                    { weight: 40, narration: "The Onix crushes one of your Pokemon beneath its massive body.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "Your team fights off the Onix!", effects: { partyDamage: 2 } },
                    { weight: 20, narration: "Your team impresses the Onix! It calms down.", effects: { partyDamage: 1 } }
                ]},
                { text: "Flee immediately", outcomes: [
                    { weight: 70, narration: "You escape the rampaging Onix!", effects: {} },
                    { weight: 30, narration: "The Onix blocks your escape route!", effects: { partyDamage: 1, daysLost: 1 } }
                ]}
            ]
        },
        {
            id: "death_graveler_brawl",
            type: "hazard",
            name: "Graveler Brawl!",
            description: "Your Pokemon wandered into the middle of a Graveler territorial brawl!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["mountain", "cave"],
            choices: [
                { text: "Pull them out", outcomes: [
                    { weight: 45, narration: "One of your Pokemon was caught in a Self-Destruct!", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You pull your Pokemon out just as a Graveler explodes!", effects: { partyDamage: 1 } }
                ]},
                { text: "Wait for it to end", outcomes: [
                    { weight: 60, narration: "The brawl settles down. Your Pokemon is bruised but okay.", effects: { partyDamage: 1 } },
                    { weight: 40, narration: "A stray Self-Destruct hits your team!", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_rhyhorn_stampede",
            type: "hazard",
            name: "Rhyhorn Stampede!",
            description: "A stampede of wild Rhyhorn thunders through your camp!",
            weight: 3,
            oneTime: false,
            minDay: 8,
            terrainTypes: ["mountain"],
            choices: [
                { text: "Try to divert them", outcomes: [
                    { weight: 50, narration: "The stampede tramples one of your Pokemon!", effects: { pokemonDeath: true } },
                    { weight: 50, narration: "You manage to divert the stampede around your camp!", effects: { food: -5 } }
                ]},
                { text: "Climb to higher ground", outcomes: [
                    { weight: 70, narration: "You watch the stampede pass from above. Safe!", effects: {} },
                    { weight: 30, narration: "One Pokemon wasn't fast enough to climb.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_hidden_ravine",
            type: "hazard",
            name: "Hidden Ravine!",
            description: "The fog obscures a deep ravine! One of your Pokemon tumbles toward the edge!",
            weight: 3,
            oneTime: false,
            minDay: 7,
            terrainTypes: ["mountain"],
            choices: [
                { text: "Lunge to save them", outcomes: [
                    { weight: 50, narration: "You grab your Pokemon just in time!", effects: { partyDamage: 1 } },
                    { weight: 50, narration: "Your Pokemon fell into the ravine and was lost.", effects: { pokemonDeath: true } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "The rope catches your Pokemon mid-fall! Safe!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The rope frays and snaps under the weight.", effects: { escapeRope: -1, pokemonDeath: true } }
                ]}
            ]
        },

        // ===== OCEAN / WATER DEATH EVENTS =====
        {
            id: "death_gyarados_drag",
            type: "hazard",
            name: "Gyarados Attack!",
            description: "A massive Gyarados surges from the water and lunges at your party!",
            weight: 4,
            oneTime: false,
            minDay: 8,
            terrainTypes: ["water"],
            choices: [
                { text: "Fight back!", outcomes: [
                    { weight: 40, narration: "Your Pokemon was dragged underwater by the Gyarados.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "You drive the Gyarados back but your team is hurt!", effects: { partyDamage: 2 } },
                    { weight: 20, narration: "Your team's courage impresses the Gyarados. It retreats!", effects: { partyDamage: 1 } }
                ]},
                { text: "Flee to shore", outcomes: [
                    { weight: 60, narration: "You escape to shallow water!", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The Gyarados is faster. One Pokemon is lost to the depths.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_tentacool_swarm",
            type: "hazard",
            name: "Tentacool Swarm!",
            description: "Your Pokemon is stung repeatedly by a massive swarm of Tentacool!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["water"],
            choices: [
                { text: "Pull them from the water", outcomes: [
                    { weight: 45, narration: "The poison was too much. Your Pokemon didn't survive.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You pull them out covered in stings but alive!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use a Potion", requiresItem: "potions", outcomes: [
                    { weight: 80, narration: "You treat the stings quickly and your Pokemon recovers!", effects: { potions: -1 } },
                    { weight: 20, narration: "The venom is too potent for a standard Potion.", effects: { potions: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_storm_wave",
            type: "hazard",
            name: "Storm Surge!",
            description: "A storm wave slams your party against sharp rocks!",
            weight: 4,
            oneTime: false,
            minDay: 7,
            terrainTypes: ["water"],
            choices: [
                { text: "Hold on tight!", outcomes: [
                    { weight: 40, narration: "One Pokemon was crushed against the rocks by the wave.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "Everyone holds on! Bruised but alive.", effects: { partyDamage: 2 } }
                ]},
                { text: "Swim for calmer water", outcomes: [
                    { weight: 50, narration: "You reach calmer waters safely!", effects: { partyDamage: 1 } },
                    { weight: 50, narration: "The current pulls one Pokemon under.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_deep_pull",
            type: "hazard",
            name: "Something Below!",
            description: "Something unseen below the water grabs one of your Pokemon and pulls it down!",
            weight: 3,
            oneTime: false,
            minDay: 8,
            terrainTypes: ["water"],
            choices: [
                { text: "Dive after them!", outcomes: [
                    { weight: 40, narration: "You dive deep but whatever took your Pokemon is gone.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You wrestle your Pokemon free from a massive Tentacruel!", effects: { partyDamage: 2 } }
                ]},
                { text: "There's nothing you can do", outcomes: [
                    { weight: 100, narration: "Your Pokemon disappears beneath the dark water forever.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_sea_storm",
            type: "hazard",
            name: "Violent Sea Storm!",
            description: "A violent sea storm erupts! Waves crash over your party!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["water"],
            choices: [
                { text: "Push through the storm", outcomes: [
                    { weight: 40, narration: "Your Pokemon was lost during the violent sea storm.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "Everyone makes it through battered and exhausted!", effects: { partyDamage: 2, food: -5 } },
                    { weight: 20, narration: "The storm passes quickly. You're okay!", effects: { partyDamage: 1 } }
                ]},
                { text: "Wait it out", outcomes: [
                    { weight: 70, narration: "You hunker down until the storm passes.", effects: { daysLost: 1 } },
                    { weight: 30, narration: "The storm lasts too long. Supplies are ruined.", effects: { daysLost: 2, food: -10 } }
                ]}
            ]
        },
        {
            id: "death_dragonite_hurricane",
            type: "hazard",
            name: "Dragonite Hurricane!",
            description: "A wild Dragonite creates hurricane-force winds over the water!",
            weight: 2,
            oneTime: false,
            minDay: 15,
            terrainTypes: ["water"],
            choices: [
                { text: "Brace for impact!", outcomes: [
                    { weight: 35, narration: "The hurricane winds scatter your team. One Pokemon is lost to the sea.", effects: { pokemonDeath: true } },
                    { weight: 45, narration: "You endure the hurricane! Your team is beaten but alive.", effects: { partyDamage: 2, food: -5 } },
                    { weight: 20, narration: "The Dragonite flies off. The winds calm.", effects: { partyDamage: 1 } }
                ]},
                { text: "Try to befriend it", outcomes: [
                    { weight: 20, narration: "The Dragonite is impressed by your courage and calms down!", effects: { seePokemon: 149 } },
                    { weight: 80, narration: "The Dragonite ignores you and the winds intensify!", effects: { partyDamage: 2 } }
                ]}
            ]
        },

        // ===== CAVE DEATH EVENTS =====
        {
            id: "death_zubat_swarm",
            type: "hazard",
            name: "Zubat Swarm!",
            description: "Thousands of Zubat screech and swarm your party in the dark cave!",
            weight: 5,
            oneTime: false,
            minDay: 4,
            terrainTypes: ["cave"],
            choices: [
                { text: "Fight through!", outcomes: [
                    { weight: 35, narration: "The swarm overwhelmed one of your Pokemon.", effects: { pokemonDeath: true } },
                    { weight: 65, narration: "Your team pushes through the swarm!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 95, narration: "The Repel disperses the Zubat swarm!", effects: { repels: -1 } },
                    { weight: 5, narration: "There are too many! The Repel barely helps!", effects: { repels: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "death_cave_collapse_2",
            type: "hazard",
            name: "Cave-In!",
            description: "The cave ceiling cracks and massive rocks begin falling!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["cave"],
            choices: [
                { text: "Run for the exit!", outcomes: [
                    { weight: 40, narration: "A cave collapse trapped one of your Pokemon beneath the rubble.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "Everyone makes it out as the cave collapses behind you!", effects: { partyDamage: 1 } }
                ]},
                { text: "Take shelter in an alcove", outcomes: [
                    { weight: 60, narration: "The alcove holds! You wait out the collapse.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The alcove crumbles too. Your team takes hits!", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_golbat_nest",
            type: "hazard",
            name: "Golbat Nest!",
            description: "Your Pokemon wandered into a nest of angry Golbat!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["cave"],
            choices: [
                { text: "Call them back!", outcomes: [
                    { weight: 45, narration: "The Golbat drained too much blood. Your Pokemon collapsed.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You recall your Pokemon just in time! They're weak but alive.", effects: { partyDamage: 1 } }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 85, narration: "The Repel drives the Golbat back to their roost!", effects: { repels: -1 } },
                    { weight: 15, narration: "The Golbat are too enraged! The Repel only partly works.", effects: { repels: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "death_underground_fissure",
            type: "hazard",
            name: "Underground Fissure!",
            description: "The cave floor splits open! A deep fissure swallows the path!",
            weight: 3,
            oneTime: false,
            minDay: 7,
            terrainTypes: ["cave"],
            choices: [
                { text: "Jump across!", outcomes: [
                    { weight: 45, narration: "One Pokemon didn't make the jump and fell into the fissure.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "Everyone makes the leap! Heart-pounding but safe!", effects: {} }
                ]},
                { text: "Find another way", outcomes: [
                    { weight: 80, narration: "You find a narrow passage around the fissure.", effects: { daysLost: 1 } },
                    { weight: 20, narration: "The detour leads to a dead end. You lose time.", effects: { daysLost: 2 } }
                ]}
            ]
        },
        {
            id: "death_onix_ceiling",
            type: "hazard",
            name: "Onix Rampage!",
            description: "A wild Onix smashes through the cave ceiling, bringing rocks crashing down!",
            weight: 3,
            oneTime: false,
            minDay: 7,
            terrainTypes: ["cave"],
            choices: [
                { text: "Dodge the debris!", outcomes: [
                    { weight: 40, narration: "The ceiling collapse buried one of your Pokemon.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "Rocks rain down but everyone dodges!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You rappel to safety through a side tunnel!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The tunnel collapses before you can escape fully!", effects: { escapeRope: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "death_lost_darkness",
            type: "hazard",
            name: "Lost in Darkness!",
            description: "Your Pokemon was separated from the group in the pitch-black cave...",
            weight: 3,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["cave"],
            choices: [
                { text: "Search in the dark", outcomes: [
                    { weight: 40, narration: "You search for hours but your Pokemon was never found.", effects: { pokemonDeath: true, daysLost: 1 } },
                    { weight: 60, narration: "You hear a cry and find your Pokemon scared but safe!", effects: { daysLost: 1 } }
                ]},
                { text: "Keep moving", outcomes: [
                    { weight: 100, narration: "You press on without them. They never catch up.", effects: { pokemonDeath: true } }
                ]}
            ]
        },

        // ===== GRASSLAND DEATH EVENTS =====
        {
            id: "death_tauros_stampede",
            type: "hazard",
            name: "Tauros Stampede!",
            description: "A stampede of Tauros charges through the tall grass directly at your party!",
            weight: 4,
            oneTime: false,
            minDay: 6,
            choices: [
                { text: "Hit the ground!", outcomes: [
                    { weight: 40, narration: "One of your Pokemon was trampled by the stampede.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "The Tauros thunder over you! Everyone survives!", effects: { partyDamage: 1 } }
                ]},
                { text: "Try to divert them", outcomes: [
                    { weight: 30, narration: "You successfully redirect the herd!", effects: {} },
                    { weight: 70, narration: "Nothing can stop a Tauros stampede! Your team takes hits!", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_arbok_ambush",
            type: "hazard",
            name: "Arbok Ambush!",
            description: "A wild Arbok struck from the tall grass before your team could react!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Fight it off!", outcomes: [
                    { weight: 35, narration: "The Arbok's venom was fatal. One Pokemon didn't make it.", effects: { pokemonDeath: true } },
                    { weight: 45, narration: "You drive the Arbok away but it left a nasty bite!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "Your Pokemon overpowers the Arbok!", effects: {} }
                ]},
                { text: "Use a Potion for the venom", requiresItem: "potions", outcomes: [
                    { weight: 85, narration: "You apply the Potion to the bite wound. The venom is neutralized!", effects: { potions: -1 } },
                    { weight: 15, narration: "The venom spread too quickly.", effects: { potions: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_toxic_berries",
            type: "hazard",
            name: "Toxic Berries!",
            description: "Your Pokemon ate toxic berries while foraging along the trail.",
            weight: 4,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Induce vomiting quickly", outcomes: [
                    { weight: 60, narration: "Your Pokemon recovers after being violently sick.", effects: { partyDamage: 1 } },
                    { weight: 40, narration: "The berries were too toxic. Your Pokemon didn't survive.", effects: { pokemonDeath: true } }
                ]},
                { text: "Use a Potion", requiresItem: "potions", outcomes: [
                    { weight: 80, narration: "The Potion helps flush the toxins!", effects: { potions: -1 } },
                    { weight: 20, narration: "The Potion wasn't enough for this kind of poison.", effects: { potions: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_nidoking_territory",
            type: "hazard",
            name: "Nidoking Territory!",
            description: "A territorial Nidoking charges at your camp! The ground shakes with each step!",
            weight: 3,
            oneTime: false,
            minDay: 8,
            choices: [
                { text: "Defend the camp!", outcomes: [
                    { weight: 40, narration: "The Nidoking's horn pierced one of your Pokemon. They didn't survive.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "Your team drives the Nidoking back!", effects: { partyDamage: 2 } },
                    { weight: 20, narration: "The Nidoking decides you're not worth the fight.", effects: { partyDamage: 1 } }
                ]},
                { text: "Abandon camp and flee", outcomes: [
                    { weight: 60, narration: "You flee! The Nidoking destroys your camp supplies.", effects: { food: -15 } },
                    { weight: 40, narration: "The Nidoking chases you! Everyone takes hits!", effects: { partyDamage: 1, food: -5 } }
                ]}
            ]
        },
        {
            id: "death_predator_territory",
            type: "hazard",
            name: "Predator Territory!",
            description: "Your Pokemon wandered too far into predator territory. A wild Persian stalks from the grass.",
            weight: 3,
            oneTime: false,
            minDay: 7,
            choices: [
                { text: "Try to scare it off", outcomes: [
                    { weight: 40, narration: "The Persian struck too fast. Your Pokemon is gone.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You make yourself look big and scare the Persian away!", effects: {} }
                ]},
                { text: "Back away slowly", outcomes: [
                    { weight: 70, narration: "The Persian watches you leave its territory.", effects: {} },
                    { weight: 30, narration: "It pounces as you turn your back!", effects: { partyDamage: 1 } }
                ]}
            ]
        },

        // ===== VOLCANIC / CINNABAR DEATH EVENTS =====
        {
            id: "death_volcanic_tremor",
            type: "hazard",
            name: "Volcanic Tremor!",
            description: "A sudden volcanic tremor splits the ground beneath your team!",
            weight: 5,
            oneTime: false,
            minDay: 15,
            locationIds: ["cinnabar_island"],
            choices: [
                { text: "Jump to safety!", outcomes: [
                    { weight: 40, narration: "One Pokemon fell into the fissure before it closed.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "Everyone leaps clear as the ground cracks!", effects: { partyDamage: 1 } }
                ]},
                { text: "Run from the area", outcomes: [
                    { weight: 50, narration: "You escape the volcanic zone!", effects: { daysLost: 1 } },
                    { weight: 50, narration: "The tremors chase you! Your team takes damage fleeing.", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_heat_collapse",
            type: "hazard",
            name: "Extreme Heat!",
            description: "The volcanic heat is unbearable. Your Pokemon collapses from heatstroke!",
            weight: 4,
            oneTime: false,
            minDay: 15,
            locationIds: ["cinnabar_island"],
            choices: [
                { text: "Use a Potion to cool them", requiresItem: "potions", outcomes: [
                    { weight: 75, narration: "The Potion revives your Pokemon from the heat!", effects: { potions: -1 } },
                    { weight: 25, narration: "The heat was too extreme. The Potion wasn't enough.", effects: { potions: -1, pokemonDeath: true } }
                ]},
                { text: "Find shade and rest", outcomes: [
                    { weight: 50, narration: "Your Pokemon recovers after resting in the shade.", effects: { daysLost: 1, partyDamage: 1 } },
                    { weight: 50, narration: "There's no escape from the heat. Your Pokemon succumbed.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_lava_burst",
            type: "hazard",
            name: "Lava Eruption!",
            description: "A burst of lava erupts near your camp! Molten rock rains from the sky!",
            weight: 3,
            oneTime: false,
            minDay: 16,
            locationIds: ["cinnabar_island"],
            choices: [
                { text: "Shield your team!", outcomes: [
                    { weight: 45, narration: "Scalding ash and lava overwhelmed one of your Pokemon.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You shield your team from the worst of it!", effects: { partyDamage: 2 } }
                ]},
                { text: "Evacuate immediately", outcomes: [
                    { weight: 60, narration: "You flee the volcanic zone!", effects: { food: -5, daysLost: 1 } },
                    { weight: 40, narration: "Lava blocks your escape route! Your team takes burns!", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_burning_fissure",
            type: "hazard",
            name: "Burning Fissure!",
            description: "Your Pokemon wandered too close to a burning fissure in the volcanic rock!",
            weight: 4,
            oneTime: false,
            minDay: 15,
            locationIds: ["cinnabar_island"],
            choices: [
                { text: "Pull them back!", outcomes: [
                    { weight: 45, narration: "The ground gave way. Your Pokemon fell into the burning fissure.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You yank them away just as the edge crumbles!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use Escape Rope to lasso them", requiresItem: "escapeRope", outcomes: [
                    { weight: 85, narration: "The rope catches and you pull them to safety!", effects: { escapeRope: -1 } },
                    { weight: 15, narration: "The rope burns through from the heat!", effects: { escapeRope: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_firestorm",
            type: "hazard",
            name: "Firestorm!",
            description: "A firestorm sweeps across the volcanic trail! Flames engulf everything!",
            weight: 3,
            oneTime: false,
            minDay: 16,
            locationIds: ["cinnabar_island"],
            choices: [
                { text: "Run through the flames!", outcomes: [
                    { weight: 40, narration: "One Pokemon couldn't escape the inferno.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You burst through the flames singed but alive!", effects: { partyDamage: 2, food: -5 } }
                ]},
                { text: "Take cover and wait", outcomes: [
                    { weight: 50, narration: "The firestorm passes. Your camp is destroyed but everyone's okay.", effects: { food: -10, daysLost: 1 } },
                    { weight: 50, narration: "The fire spreads to your shelter!", effects: { partyDamage: 2, food: -10 } }
                ]}
            ]
        },

        // ===== HAUNTED AREA DEATH EVENTS =====
        {
            id: "death_spirit_possession",
            type: "hazard",
            name: "Spirit Possession!",
            description: "Your Pokemon was possessed by a restless spirit in the Pokemon Tower!",
            weight: 4,
            oneTime: false,
            minDay: 7,
            locationIds: ["lavender_town"],
            choices: [
                { text: "Try to free them!", outcomes: [
                    { weight: 45, narration: "The spirit consumed your Pokemon's life force.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You perform a cleansing ritual and free your Pokemon!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use a Potion", requiresItem: "potions", outcomes: [
                    { weight: 70, narration: "The Potion's energy drives the spirit away!", effects: { potions: -1 } },
                    { weight: 30, narration: "Potions can't cure spiritual possession.", effects: { potions: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_ghostly_whispers",
            type: "hazard",
            name: "Ghostly Whispers!",
            description: "Ghostly whispers lure one of your Pokemon away from the group...",
            weight: 4,
            oneTime: false,
            minDay: 7,
            locationIds: ["lavender_town"],
            choices: [
                { text: "Follow the whispers", outcomes: [
                    { weight: 40, narration: "The ghosts led your Pokemon into the spirit world. They're gone.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "You find your Pokemon in a trance but snap them out of it!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "The whispers lead to a hidden offering — Rare Candy!", effects: { rareCandy: 1 } }
                ]},
                { text: "Cover your ears and move on", outcomes: [
                    { weight: 60, narration: "You resist the whispers but your Pokemon wasn't so strong-willed.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "You all resist the ghostly call and press forward.", effects: {} }
                ]}
            ]
        },
        {
            id: "death_spectral_figure",
            type: "hazard",
            name: "Spectral Figure!",
            description: "A spectral figure appears! Your Pokemon panics and runs blindly into the dark!",
            weight: 3,
            oneTime: false,
            minDay: 7,
            locationIds: ["lavender_town"],
            choices: [
                { text: "Chase after them!", outcomes: [
                    { weight: 45, narration: "Your Pokemon ran off a ledge in their panic. They're gone.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You catch up and calm your terrified Pokemon.", effects: { partyDamage: 1 } }
                ]},
                { text: "Call out to them", outcomes: [
                    { weight: 50, narration: "Your Pokemon hears your voice and comes back trembling.", effects: { partyDamage: 1 } },
                    { weight: 50, narration: "They ran too far. You never see them again.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_shadow_drain",
            type: "hazard",
            name: "Shadow Drain!",
            description: "A dark shadow creeps toward your camp. It drains the life from one of your Pokemon!",
            weight: 3,
            oneTime: false,
            minDay: 8,
            locationIds: ["lavender_town"],
            choices: [
                { text: "Fight the shadow!", outcomes: [
                    { weight: 45, narration: "The shadow drained too much life. Your Pokemon faded away.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "Your team's combined strength drives the shadow away!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use Escape Rope to flee", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You escape the haunted area before the shadow strikes!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "Shadows don't care about ropes.", effects: { escapeRope: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_poltergeist",
            type: "hazard",
            name: "Poltergeist Attack!",
            description: "Objects fly through the air! A poltergeist attack injures your Pokemon!",
            weight: 3,
            oneTime: false,
            minDay: 7,
            locationIds: ["lavender_town"],
            choices: [
                { text: "Shield your Pokemon!", outcomes: [
                    { weight: 40, narration: "A massive gravestone struck your Pokemon. They didn't recover.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You block most of the flying debris!", effects: { partyDamage: 1 } }
                ]},
                { text: "Run from the tower!", outcomes: [
                    { weight: 70, narration: "You escape the poltergeist's range!", effects: {} },
                    { weight: 30, narration: "The poltergeist follows you outside! Debris strikes your team!", effects: { partyDamage: 2 } }
                ]}
            ]
        },

        // ===== WEATHER / ENVIRONMENTAL DEATH EVENTS =====
        {
            id: "death_lightning_strike",
            type: "hazard",
            name: "Lightning Strike!",
            description: "A lightning bolt strikes dangerously close to your party!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Take cover!", outcomes: [
                    { weight: 35, narration: "A direct lightning hit. One Pokemon didn't survive.", effects: { pokemonDeath: true } },
                    { weight: 65, narration: "The lightning misses! Everyone is shaken but alive.", effects: { partyDamage: 1 } }
                ]},
                { text: "Lie flat on the ground", outcomes: [
                    { weight: 70, narration: "The lightning passes overhead. Smart thinking!", effects: {} },
                    { weight: 30, narration: "Ground current zaps your team!", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_exhaustion",
            type: "hazard",
            name: "Total Exhaustion!",
            description: "Your Pokemon collapsed from exhaustion after days of grueling travel.",
            weight: 4,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Rest and treat them", outcomes: [
                    { weight: 50, narration: "Rest helps, but your Pokemon is still weak.", effects: { daysLost: 1, partyDamage: 1 } },
                    { weight: 50, narration: "Your Pokemon was too far gone. They didn't wake up.", effects: { daysLost: 1, pokemonDeath: true } }
                ]},
                { text: "Use a Potion", requiresItem: "potions", outcomes: [
                    { weight: 80, narration: "The Potion revitalizes your exhausted Pokemon!", effects: { potions: -1 } },
                    { weight: 20, narration: "Even the Potion can't reverse total exhaustion.", effects: { potions: -1, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_contaminated_water",
            type: "hazard",
            name: "Contaminated Water!",
            description: "Your Pokemon drank contaminated water and fell violently ill.",
            weight: 4,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Use a Potion", requiresItem: "potions", outcomes: [
                    { weight: 75, narration: "The Potion flushes the contamination!", effects: { potions: -1 } },
                    { weight: 25, narration: "The contamination was too severe.", effects: { potions: -1, pokemonDeath: true } }
                ]},
                { text: "Let them rest it off", outcomes: [
                    { weight: 40, narration: "After a rough night, your Pokemon recovers.", effects: { daysLost: 1, partyDamage: 1 } },
                    { weight: 60, narration: "The illness was too much. Your Pokemon succumbed.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_food_shortage",
            type: "hazard",
            name: "Food Shortage!",
            description: "Food supplies ran dangerously low. One of your Pokemon grows weaker each day.",
            weight: 3,
            oneTime: false,
            minDay: 8,
            choices: [
                { text: "Share what's left", outcomes: [
                    { weight: 50, narration: "Everyone goes hungry but survives.", effects: { food: -10, partyDamage: 1 } },
                    { weight: 50, narration: "There isn't enough. Your weakest Pokemon starved.", effects: { food: -5, pokemonDeath: true } }
                ]},
                { text: "Forage for food", outcomes: [
                    { weight: 60, narration: "You find enough berries to keep everyone going!", effects: { food: 5 } },
                    { weight: 40, narration: "You find nothing. Your Pokemon grows weaker.", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_mysterious_illness",
            type: "hazard",
            name: "Mysterious Illness!",
            description: "Your Pokemon succumbed to a mysterious illness. Nothing seems to help.",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Use a Super Potion", requiresItem: "superPotions", outcomes: [
                    { weight: 70, narration: "The Super Potion fights off the illness!", effects: { superPotions: -1 } },
                    { weight: 30, narration: "Even the Super Potion can't cure this mystery illness.", effects: { superPotions: -1, pokemonDeath: true } }
                ]},
                { text: "Push onward and hope", outcomes: [
                    { weight: 30, narration: "Your Pokemon fights off the illness on their own!", effects: { partyDamage: 1 } },
                    { weight: 70, narration: "The illness was fatal. Your Pokemon is gone.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_violent_storm",
            type: "hazard",
            name: "Violent Storm!",
            description: "A violent storm scatters your team in the night!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Search for everyone", outcomes: [
                    { weight: 35, narration: "You find everyone except one. They were lost to the storm.", effects: { pokemonDeath: true, daysLost: 1 } },
                    { weight: 65, narration: "You gather everyone back together by morning.", effects: { daysLost: 1, partyDamage: 1 } }
                ]},
                { text: "Wait for dawn", outcomes: [
                    { weight: 50, narration: "By morning, everyone returns on their own!", effects: { daysLost: 1 } },
                    { weight: 50, narration: "One Pokemon never came back.", effects: { daysLost: 1, pokemonDeath: true } }
                ]}
            ]
        },

        // ===== TEAM ROCKET DEATH EVENTS =====
        {
            id: "death_rocket_ambush",
            type: "combat",
            name: "Rocket Night Raid!",
            description: "Team Rocket ambushed your camp in the dead of night and took one Pokemon!",
            weight: 3,
            oneTime: false,
            minDay: 8,
            choices: [
                { text: "Chase them!", outcomes: [
                    { weight: 40, narration: "You catch up but they already harmed your Pokemon. It's too late.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You catch them and rescue your Pokemon!", effects: { partyDamage: 1 } }
                ]},
                { text: "Let them go", outcomes: [
                    { weight: 100, narration: "Team Rocket disappears into the night with your Pokemon forever.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_rocket_trap",
            type: "combat",
            name: "Rocket Trap!",
            description: "Your Pokemon triggered a hidden Team Rocket trap along the trail!",
            weight: 3,
            oneTime: false,
            minDay: 6,
            choices: [
                { text: "Disarm the trap", outcomes: [
                    { weight: 45, narration: "The trap activated before you could reach it. Your Pokemon is badly hurt.", effects: { pokemonDeath: true } },
                    { weight: 55, narration: "You carefully disarm the trap and free your Pokemon!", effects: { partyDamage: 1 } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 85, narration: "You use the rope to safely trigger and disable the trap!", effects: { escapeRope: -1 } },
                    { weight: 15, narration: "The trap was more complex than expected.", effects: { escapeRope: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "death_rocket_experiment",
            type: "combat",
            name: "Rocket Experiment!",
            description: "You stumble into a hidden Rocket lab. A failed experiment erupts in energy!",
            weight: 2,
            oneTime: true,
            minDay: 12,
            choices: [
                { text: "Shield your team!", outcomes: [
                    { weight: 40, narration: "The energy blast was too powerful. One Pokemon was lost.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You absorb the blast! Your team is hurt but alive.", effects: { partyDamage: 2 } }
                ]},
                { text: "Flee the lab!", outcomes: [
                    { weight: 50, narration: "You escape before the explosion!", effects: {} },
                    { weight: 50, narration: "The explosion catches your team as you flee!", effects: { partyDamage: 2 } }
                ]}
            ]
        },
        {
            id: "death_rocket_lure",
            type: "combat",
            name: "Rocket Bait!",
            description: "Team Rocket lured one of your Pokemon away with bait while you slept.",
            weight: 3,
            oneTime: false,
            minDay: 7,
            choices: [
                { text: "Track them down", outcomes: [
                    { weight: 40, narration: "You find the Rocket hideout but your Pokemon is already gone.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "You rescue your Pokemon from a cage!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "You find and raid their stash during the rescue!", effects: { money: 500, pokeballs: 3 } }
                ]},
                { text: "They're gone...", outcomes: [
                    { weight: 100, narration: "You never see your Pokemon again.", effects: { pokemonDeath: true } }
                ]}
            ]
        },

        // ===== LEGENDARY DEATH EVENTS =====
        {
            id: "death_zapdos_lightning",
            type: "hazard",
            name: "Zapdos Lightning!",
            description: "A lightning storm intensifies — Zapdos has been summoned! A bolt strikes your party!",
            weight: 2,
            oneTime: false,
            minDay: 15,
            choices: [
                { text: "Endure the storm!", outcomes: [
                    { weight: 40, narration: "One Pokemon was struck directly by Zapdos's lightning.", effects: { pokemonDeath: true, seePokemon: 145 } },
                    { weight: 60, narration: "The storm passes. Everyone survived the electric onslaught!", effects: { partyDamage: 2, seePokemon: 145 } }
                ]},
                { text: "Take shelter!", outcomes: [
                    { weight: 60, narration: "You find cover as Zapdos soars overhead!", effects: { seePokemon: 145 } },
                    { weight: 40, narration: "Lightning destroys your shelter!", effects: { partyDamage: 2, food: -5, seePokemon: 145 } }
                ]}
            ]
        },
        {
            id: "death_articuno_blizzard",
            type: "hazard",
            name: "Articuno Blizzard!",
            description: "An Articuno blizzard freezes everything in sight! Ice crystals cut through the air!",
            weight: 2,
            oneTime: false,
            minDay: 15,
            terrainTypes: ["water", "mountain", "cave"],
            choices: [
                { text: "Huddle together for warmth!", outcomes: [
                    { weight: 40, narration: "One Pokemon was frozen solid by Articuno's power.", effects: { pokemonDeath: true, seePokemon: 144 } },
                    { weight: 60, narration: "Everyone survives the freezing winds!", effects: { partyDamage: 2, seePokemon: 144 } }
                ]},
                { text: "Find a cave!", outcomes: [
                    { weight: 60, narration: "You find shelter from the blizzard!", effects: { daysLost: 1, seePokemon: 144 } },
                    { weight: 40, narration: "The cave is frozen too. It's bitter cold.", effects: { daysLost: 1, partyDamage: 1, seePokemon: 144 } }
                ]}
            ]
        },
        {
            id: "death_moltres_fire",
            type: "hazard",
            name: "Moltres Eruption!",
            description: "Moltres erupts from a volcano in a storm of fire! The sky turns orange!",
            weight: 2,
            oneTime: false,
            minDay: 15,
            locationIds: ["cinnabar_island"],
            choices: [
                { text: "Brace for the heatwave!", outcomes: [
                    { weight: 40, narration: "The firestorm incinerated one of your Pokemon.", effects: { pokemonDeath: true, seePokemon: 146 } },
                    { weight: 60, narration: "Moltres soars away. Your team is scorched but alive!", effects: { partyDamage: 2, seePokemon: 146 } }
                ]},
                { text: "Dive into water!", outcomes: [
                    { weight: 70, narration: "The water protects you from the worst of the flames!", effects: { partyDamage: 1, seePokemon: 146 } },
                    { weight: 30, narration: "The water itself starts to boil!", effects: { partyDamage: 2, seePokemon: 146 } }
                ]}
            ]
        },
        {
            id: "death_mewtwo_shockwave",
            type: "hazard",
            name: "Psychic Shockwave!",
            description: "A psychic shockwave from Mewtwo overwhelms your team! Your Pokemon clutch their heads in pain!",
            weight: 1,
            oneTime: true,
            minDay: 20,
            choices: [
                { text: "Resist the psychic force!", outcomes: [
                    { weight: 40, narration: "One Pokemon's mind was shattered by Mewtwo's power.", effects: { pokemonDeath: true, seePokemon: 150 } },
                    { weight: 60, narration: "The shockwave passes. Everyone is dazed but alive.", effects: { partyDamage: 2, seePokemon: 150 } }
                ]},
                { text: "Flee immediately!", outcomes: [
                    { weight: 50, narration: "You escape Mewtwo's range!", effects: { seePokemon: 150 } },
                    { weight: 50, narration: "You can't outrun a psychic attack!", effects: { partyDamage: 2, seePokemon: 150 } }
                ]}
            ]
        },
        {
            id: "death_mythical_collapse",
            type: "hazard",
            name: "Mythical Encounter!",
            description: "A mysterious mythical Pokemon appeared briefly — a blinding flash of energy hit your team!",
            weight: 1,
            oneTime: true,
            minDay: 18,
            choices: [
                { text: "Shield your eyes!", outcomes: [
                    { weight: 35, narration: "One Pokemon collapsed from the energy burst and never recovered.", effects: { pokemonDeath: true } },
                    { weight: 65, narration: "The light fades. Your team is shaken but okay. What was that?!", effects: { partyDamage: 1 } }
                ]},
                { text: "Reach out to it", outcomes: [
                    { weight: 20, narration: "The Pokemon seems to acknowledge you... then vanishes. Your team feels energized!", effects: { healAll: true } },
                    { weight: 80, narration: "The energy is too intense! Your team takes damage.", effects: { partyDamage: 2 } }
                ]}
            ]
        },

        // ===== COMEDIC DEATH EVENTS =====
        {
            id: "death_wandered_off",
            type: "story",
            name: "Wandered Off!",
            description: "Your Pokemon wandered off during the night. By morning, there's no trace of them.",
            weight: 4,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Search for them", outcomes: [
                    { weight: 50, narration: "After hours of searching, you accept they're gone.", effects: { pokemonDeath: true, daysLost: 1 } },
                    { weight: 50, narration: "You find them napping behind a bush!", effects: { daysLost: 1 } }
                ]},
                { text: "They'll come back... right?", outcomes: [
                    { weight: 30, narration: "They actually do come back! With berries!", effects: { food: 3 } },
                    { weight: 70, narration: "They never came back.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_chased_shiny",
            type: "story",
            name: "Something Shiny!",
            description: "Your Pokemon chased something shiny into the forest and never returned.",
            weight: 3,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Chase after them", outcomes: [
                    { weight: 40, narration: "You find the shiny thing — a bottle cap. No sign of your Pokemon.", effects: { pokemonDeath: true } },
                    { weight: 40, narration: "You find your Pokemon fascinated by a mirror shard!", effects: {} },
                    { weight: 20, narration: "You find your Pokemon — and the shiny thing was a Nugget!", effects: { money: 500 } }
                ]},
                { text: "Wait for them", outcomes: [
                    { weight: 40, narration: "They never come back. The shiny thing was too tempting.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "They return hours later, tail wagging.", effects: {} }
                ]}
            ]
        },
        {
            id: "death_ate_too_many_berries",
            type: "story",
            name: "Berry Binge!",
            description: "Your Pokemon ate an absurd amount of berries and is looking very unwell.",
            weight: 4,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Use a Potion", requiresItem: "potions", outcomes: [
                    { weight: 85, narration: "The Potion settles their stomach. Lesson learned!", effects: { potions: -1 } },
                    { weight: 15, narration: "Even the Potion can't fix this level of gluttony. Your Pokemon is very sick.", effects: { potions: -1, partyDamage: 1 } }
                ]},
                { text: "Let nature take its course", outcomes: [
                    { weight: 60, narration: "After a miserable night, your Pokemon recovers.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "Those berries were not meant for Pokemon consumption.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_picked_fight",
            type: "story",
            name: "Picked a Fight!",
            description: "Your Pokemon picked a fight with something much larger than itself. Classic.",
            weight: 4,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Intervene!", outcomes: [
                    { weight: 40, narration: "Too late. Your Pokemon challenged a Snorlax and lost. Badly.", effects: { pokemonDeath: true } },
                    { weight: 60, narration: "You drag your battered Pokemon away from the fight!", effects: { partyDamage: 1 } }
                ]},
                { text: "Watch and hope", outcomes: [
                    { weight: 30, narration: "Somehow your Pokemon wins?! They strut back proudly.", effects: {} },
                    { weight: 70, narration: "It went exactly as expected. Your Pokemon is gone.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_refused_to_move",
            type: "story",
            name: "Stubborn Pokemon!",
            description: "Your Pokemon refuses to move. It sits down and won't budge no matter what.",
            weight: 4,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Wait them out", outcomes: [
                    { weight: 60, narration: "After a full day, they finally get up and rejoin the group.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "They were still sitting there when you left. They never caught up.", effects: { pokemonDeath: true } }
                ]},
                { text: "Bribe with food", outcomes: [
                    { weight: 70, narration: "Food solves everything! Your Pokemon gets up.", effects: { food: -5 } },
                    { weight: 30, narration: "They eat the food and STILL won't move. Eventually you have to leave.", effects: { food: -5, pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_got_lost",
            type: "story",
            name: "Got Lost Exploring!",
            description: "Your Pokemon got lost while exploring and hasn't been seen for hours.",
            weight: 3,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Organize a search party", outcomes: [
                    { weight: 60, narration: "You find them stuck in a tree. How?!", effects: { daysLost: 1 } },
                    { weight: 40, narration: "Despite searching all day, your Pokemon is gone.", effects: { daysLost: 1, pokemonDeath: true } }
                ]},
                { text: "They'll find their way back", outcomes: [
                    { weight: 50, narration: "They come back covered in mud but happy!", effects: {} },
                    { weight: 50, narration: "They did not find their way back.", effects: { pokemonDeath: true } }
                ]}
            ]
        },
        {
            id: "death_distracted_butterfly",
            type: "story",
            name: "Distracted by Butterfree!",
            description: "Your Pokemon got distracted chasing a Butterfree and ran straight off a cliff.",
            weight: 3,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Check the cliff edge", outcomes: [
                    { weight: 50, narration: "You peer over the edge... they're on a ledge below, scared but alive!", effects: { partyDamage: 1 } },
                    { weight: 50, narration: "It's a long way down. Your Pokemon didn't make it.", effects: { pokemonDeath: true } }
                ]},
                { text: "Use Escape Rope to rescue", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You lower the rope and haul your Pokemon back up!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The rope isn't long enough to reach.", effects: { escapeRope: -1, pokemonDeath: true } }
                ]}
            ]
        },

        // ===== CATCHING OPPORTUNITY EVENTS =====
        {
            id: "catch_tall_grass",
            type: "discovery",
            name: "Rustling Grass!",
            description: "A wild Pokemon appears in the tall grass! It watches you curiously.",
            weight: 10,
            oneTime: false,
            minDay: 1,
            choices: [
                { text: "Throw a Pokeball!", requiresItem: "pokeballs", outcomes: [
                    { weight: 50, narration: "You caught the wild Pokemon!", effects: { pokeballs: -1, catchPokemon: 16 } },
                    { weight: 50, narration: "The Pokemon broke free and fled!", effects: { pokeballs: -1 } }
                ]},
                { text: "Observe it", outcomes: [
                    { weight: 100, narration: "The Pokemon watches you for a moment, then disappears into the grass.", effects: {} }
                ]}
            ]
        },
        {
            id: "catch_water_splash",
            type: "discovery",
            name: "Something Splashes!",
            description: "Something splashes in the nearby water! A Pokemon surfaces briefly.",
            weight: 8,
            oneTime: false,
            minDay: 2,
            terrainTypes: ["water", "city"],
            choices: [
                { text: "Throw a Pokeball!", requiresItem: "pokeballs", outcomes: [
                    { weight: 45, narration: "You caught the water Pokemon!", effects: { pokeballs: -1, catchPokemon: 60 } },
                    { weight: 55, narration: "It dove back underwater before the ball hit!", effects: { pokeballs: -1 } }
                ]},
                { text: "Try fishing", outcomes: [
                    { weight: 40, narration: "You hook a Magikarp! It flops onto shore and joins you.", effects: { catchPokemon: 129 } },
                    { weight: 60, narration: "Whatever it was is gone now.", effects: {} }
                ]}
            ]
        },
        {
            id: "catch_campfire_visitor",
            type: "discovery",
            name: "Campfire Visitor!",
            description: "A curious Pokemon approaches your campfire cautiously, drawn by the warmth.",
            weight: 8,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Offer it food", outcomes: [
                    { weight: 60, narration: "The Pokemon eats happily and decides to join your party!", effects: { food: -3, catchPokemon: 37 } },
                    { weight: 40, narration: "It eats the food and runs away. Thanks a lot.", effects: { food: -3 } }
                ]},
                { text: "Throw a Pokeball gently", requiresItem: "pokeballs", outcomes: [
                    { weight: 50, narration: "Caught! The Pokemon seems happy by the fire.", effects: { pokeballs: -1, catchPokemon: 58 } },
                    { weight: 50, narration: "The sudden movement scares it away!", effects: { pokeballs: -1 } }
                ]}
            ]
        },
        {
            id: "catch_stuck_pokemon",
            type: "discovery",
            name: "Pokemon in Trouble!",
            description: "A Pokemon is stuck in a patch of vines! It cries out for help.",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Free it!", outcomes: [
                    { weight: 60, narration: "You free the Pokemon! Grateful, it joins your party!", effects: { catchPokemon: 43 } },
                    { weight: 40, narration: "You free it and it bolts into the forest. Ungrateful!", effects: {} }
                ]},
                { text: "Free it and catch it", requiresItem: "pokeballs", outcomes: [
                    { weight: 70, narration: "The grateful Pokemon doesn't resist the Pokeball!", effects: { pokeballs: -1, catchPokemon: 69 } },
                    { weight: 30, narration: "It breaks free the moment it's untangled!", effects: { pokeballs: -1 } }
                ]}
            ]
        },
        {
            id: "catch_underground_digging",
            type: "discovery",
            name: "Something Digging!",
            description: "Something is digging beneath the ground nearby. Dirt flies everywhere!",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Throw a Pokeball at the hole!", requiresItem: "pokeballs", outcomes: [
                    { weight: 50, narration: "A Diglett pops up and gets caught!", effects: { pokeballs: -1, catchPokemon: 50 } },
                    { weight: 50, narration: "The Pokemon tunneled away before the ball hit!", effects: { pokeballs: -1 } }
                ]},
                { text: "Wait for it to surface", outcomes: [
                    { weight: 40, narration: "A Sandshrew pops out, sees you, and dives back down.", effects: { seePokemon: 27 } },
                    { weight: 60, narration: "It never comes up. Just dirt everywhere.", effects: {} }
                ]}
            ]
        },
        {
            id: "catch_food_thief",
            type: "discovery",
            name: "Food Thief!",
            description: "A Pokemon steals some food from your supplies and runs away!",
            weight: 8,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Chase and catch it!", requiresItem: "pokeballs", outcomes: [
                    { weight: 50, narration: "You corner the thief and catch it! Welcome to the team.", effects: { food: -3, pokeballs: -1, catchPokemon: 52 } },
                    { weight: 50, narration: "It's too fast! Your food is gone.", effects: { food: -5 } }
                ]},
                { text: "Let it go", outcomes: [
                    { weight: 100, narration: "The little thief disappears with your food.", effects: { food: -3 } }
                ]}
            ]
        },
        {
            id: "catch_follows_party",
            type: "discovery",
            name: "Persistent Follower!",
            description: "A Pokemon has been following your party for several miles. It seems lonely.",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Welcome it to the team", outcomes: [
                    { weight: 70, narration: "The Pokemon happily joins your party!", effects: { catchPokemon: 19 } },
                    { weight: 30, narration: "It gets shy at the last moment and runs.", effects: {} }
                ]},
                { text: "Throw a Pokeball", requiresItem: "pokeballs", outcomes: [
                    { weight: 60, narration: "Caught! It wanted to join anyway.", effects: { pokeballs: -1, catchPokemon: 39 } },
                    { weight: 40, narration: "The ball scares it and it runs off crying.", effects: { pokeballs: -1 } }
                ]}
            ]
        },
        {
            id: "catch_forest_glow",
            type: "discovery",
            name: "Forest Glow!",
            description: "Something glows faintly in the forest. A rare Pokemon?",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Investigate carefully", outcomes: [
                    { weight: 30, narration: "It's a Staryu! You catch it off guard!", effects: { catchPokemon: 120 } },
                    { weight: 40, narration: "Just some glowing moss. Disappointing.", effects: {} },
                    { weight: 30, narration: "A Voltorb! It Self-Destructs!", effects: { partyDamage: 1 } }
                ]},
                { text: "Throw a Great Ball!", requiresItem: "greatballs", outcomes: [
                    { weight: 60, narration: "Caught! It was a rare Pokemon hiding in the glow!", effects: { greatballs: -1, catchPokemon: 35 } },
                    { weight: 40, narration: "The glow fades. Whatever it was is gone.", effects: { greatballs: -1 } }
                ]}
            ]
        },
        {
            id: "catch_rare_sunbathing",
            type: "discovery",
            name: "Rare Sighting!",
            description: "You spot a rare Pokemon basking in the sunlight! It hasn't noticed you yet.",
            weight: 4,
            oneTime: false,
            minDay: 8,
            choices: [
                { text: "Sneak up with a Great Ball", requiresItem: "greatballs", outcomes: [
                    { weight: 55, narration: "Caught! What a rare find!", effects: { greatballs: -1, catchPokemon: 133 } },
                    { weight: 45, narration: "It spotted you and bolted!", effects: { greatballs: -1 } }
                ]},
                { text: "Throw a Pokeball", requiresItem: "pokeballs", outcomes: [
                    { weight: 30, narration: "Against all odds, you caught it!", effects: { pokeballs: -1, catchPokemon: 123 } },
                    { weight: 70, narration: "A regular Pokeball wasn't enough for this one.", effects: { pokeballs: -1 } }
                ]}
            ]
        },
        {
            id: "catch_cave_pokemon",
            type: "discovery",
            name: "Cave Encounter!",
            description: "A Pokemon emerges from a nearby cave, blinking in the light.",
            weight: 7,
            oneTime: false,
            minDay: 3,
            terrainTypes: ["cave", "mountain"],
            choices: [
                { text: "Throw a Pokeball!", requiresItem: "pokeballs", outcomes: [
                    { weight: 50, narration: "Caught the cave dweller!", effects: { pokeballs: -1, catchPokemon: 74 } },
                    { weight: 50, narration: "It retreats back into the cave!", effects: { pokeballs: -1 } }
                ]},
                { text: "Let it pass", outcomes: [
                    { weight: 100, narration: "The Pokemon waddles past your camp and into the wild.", effects: {} }
                ]}
            ]
        },
        {
            id: "catch_night_pokemon",
            type: "discovery",
            name: "Nighttime Visitor!",
            description: "A Pokemon appears at your camp during the night, its eyes glowing in the dark.",
            weight: 6,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Throw a Pokeball in the dark!", requiresItem: "pokeballs", outcomes: [
                    { weight: 40, narration: "Bull's-eye in the dark! Caught!", effects: { pokeballs: -1, catchPokemon: 41 } },
                    { weight: 60, narration: "You missed in the dark. The eyes vanish.", effects: { pokeballs: -1 } }
                ]},
                { text: "Shine a light at it", outcomes: [
                    { weight: 50, narration: "It's just a Hoothoot. It flies away.", effects: {} },
                    { weight: 50, narration: "The light reveals a Gastly! It phases through the ground.", effects: { seePokemon: 92 } }
                ]}
            ]
        },
        {
            id: "catch_supply_raid",
            type: "discovery",
            name: "Supply Raider!",
            description: "A Pokemon tries to raid your supplies! It's rummaging through your bag!",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Catch it red-handed!", requiresItem: "pokeballs", outcomes: [
                    { weight: 55, narration: "Caught the little raider! At least they're on your team now.", effects: { pokeballs: -1, catchPokemon: 56 } },
                    { weight: 45, narration: "It escapes with some of your food!", effects: { pokeballs: -1, food: -3 } }
                ]},
                { text: "Shoo it away", outcomes: [
                    { weight: 60, narration: "You scare it off before it takes too much.", effects: { food: -2 } },
                    { weight: 40, narration: "It grabs a bunch and runs!", effects: { food: -5 } }
                ]}
            ]
        },
        {
            id: "catch_flying_above",
            type: "discovery",
            name: "Something Flying!",
            description: "Something is flying high above your party! A bird Pokemon circles overhead.",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Throw a Pokeball high!", requiresItem: "pokeballs", outcomes: [
                    { weight: 35, narration: "Incredible throw! You caught the flying Pokemon!", effects: { pokeballs: -1, catchPokemon: 21 } },
                    { weight: 65, narration: "The ball falls short. The bird flies away.", effects: { pokeballs: -1 } }
                ]},
                { text: "Lure it down with food", outcomes: [
                    { weight: 40, narration: "It lands and eats! A Pidgey joins your group!", effects: { food: -3, catchPokemon: 16 } },
                    { weight: 60, narration: "It's not interested in your food.", effects: {} }
                ]}
            ]
        },
        {
            id: "catch_injured_pokemon",
            type: "discovery",
            name: "Injured Pokemon!",
            description: "A Pokemon appears injured and weak on the side of the trail. It looks up at you with pleading eyes.",
            weight: 6,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Heal it with a Potion", requiresItem: "potions", outcomes: [
                    { weight: 70, narration: "The grateful Pokemon joins your party!", effects: { potions: -1, catchPokemon: 25 } },
                    { weight: 30, narration: "The Pokemon heals and runs off. At least you helped.", effects: { potions: -1 } }
                ]},
                { text: "Catch it while it's weak", requiresItem: "pokeballs", outcomes: [
                    { weight: 60, narration: "Caught! You'll nurse it back to health.", effects: { pokeballs: -1, catchPokemon: 104 } },
                    { weight: 40, narration: "Even injured, it fights the ball and escapes.", effects: { pokeballs: -1 } }
                ]}
            ]
        },
        {
            id: "catch_hidden_clearing",
            type: "discovery",
            name: "Hidden Clearing!",
            description: "You find tracks leading toward a hidden clearing. Several Pokemon are gathered there!",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Sneak in with Pokeballs", requiresItem: "pokeballs", outcomes: [
                    { weight: 50, narration: "You catch one before the rest scatter!", effects: { pokeballs: -1, catchPokemon: 29 } },
                    { weight: 30, narration: "They spot you immediately and flee!", effects: { pokeballs: -1 } },
                    { weight: 20, narration: "You catch two Pokemon in the chaos!", effects: { pokeballs: -2, catchPokemon: 32, catchPokemon2: 29 } }
                ]},
                { text: "Watch from a distance", outcomes: [
                    { weight: 100, narration: "You observe the Pokemon peacefully. A beautiful sight.", effects: {} }
                ]}
            ]
        },
        {
            id: "catch_pokemon_challenge",
            type: "discovery",
            name: "Pokemon Challenge!",
            description: "A wild Pokemon stands in your path and roars! It's challenging your party!",
            weight: 7,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Accept the challenge!", outcomes: [
                    { weight: 40, narration: "Your Pokemon defeats it! Impressed, it joins you!", effects: { catchPokemon: 66, partyDamage: 1 } },
                    { weight: 40, narration: "A tough fight! It retreats with respect.", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "Your team is overpowered!", effects: { partyDamage: 2 } }
                ]},
                { text: "Throw a Pokeball mid-roar!", requiresItem: "pokeballs", outcomes: [
                    { weight: 40, narration: "Caught while its guard was down!", effects: { pokeballs: -1, catchPokemon: 56 } },
                    { weight: 60, narration: "It swats the ball away angrily!", effects: { pokeballs: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "catch_silent_watcher",
            type: "discovery",
            name: "Silent Watcher!",
            description: "Something watches silently from the trees. Two eyes blink in the shadows.",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Throw a Pokeball at the eyes!", requiresItem: "pokeballs", outcomes: [
                    { weight: 40, narration: "Caught! It's an Abra — good thing it didn't Teleport!", effects: { pokeballs: -1, catchPokemon: 63 } },
                    { weight: 60, narration: "The eyes vanish. Whatever it was teleported away.", effects: { pokeballs: -1 } }
                ]},
                { text: "Approach slowly", outcomes: [
                    { weight: 30, narration: "A Venonat drops from the tree onto your head, then joins your team!", effects: { catchPokemon: 48 } },
                    { weight: 70, narration: "The creature disappears deeper into the trees.", effects: {} }
                ]}
            ]
        },

        // ===== RESOURCE & SUPPLY EVENTS =====
        {
            id: "supply_abandoned",
            type: "discovery",
            name: "Abandoned Supplies!",
            description: "You find abandoned supplies on the road. Someone left in a hurry.",
            weight: 8,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Take everything", outcomes: [
                    { weight: 60, narration: "Food, Pokeballs, and some money! Lucky find!", effects: { food: 10, pokeballs: 3, money: 200 } },
                    { weight: 30, narration: "Most of it is ruined, but you salvage some food.", effects: { food: 5 } },
                    { weight: 10, narration: "It was a trap! Team Rocket ambushes you!", effects: { partyDamage: 1, money: -200 } }
                ]},
                { text: "Take only what you need", outcomes: [
                    { weight: 100, narration: "You take some food and leave the rest for others.", effects: { food: 5 } }
                ]}
            ]
        },
        {
            id: "supply_pokeball_crate",
            type: "discovery",
            name: "Pokeball Crate!",
            description: "You discover a crate of Pokeballs left behind by a traveling merchant!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Take them all", outcomes: [
                    { weight: 70, narration: "A full crate! Your Pokeball supply is restocked!", effects: { pokeballs: 8 } },
                    { weight: 30, narration: "Most are cracked, but a few still work.", effects: { pokeballs: 3 } }
                ]},
                { text: "Check for a trap first", outcomes: [
                    { weight: 80, narration: "No trap — just free Pokeballs!", effects: { pokeballs: 5 } },
                    { weight: 20, narration: "Good instinct! A Voltorb was hiding among them!", effects: { partyDamage: 1, pokeballs: 2 } }
                ]}
            ]
        },
        {
            id: "supply_berry_grove",
            type: "discovery",
            name: "Berry Patch!",
            description: "You find edible berries growing nearby! A feast for your team!",
            weight: 9,
            oneTime: false,
            minDay: 1,
            choices: [
                { text: "Harvest them all", outcomes: [
                    { weight: 70, narration: "Your team fills up on delicious berries!", effects: { food: 12 } },
                    { weight: 20, narration: "Great harvest! Plus some medicinal berries.", effects: { food: 8, potions: 1 } },
                    { weight: 10, narration: "Some berries were toxic! One Pokemon gets sick.", effects: { food: 5, partyDamage: 1 } }
                ]},
                { text: "Pick carefully", outcomes: [
                    { weight: 100, narration: "You carefully select only the safe-looking berries.", effects: { food: 6 } }
                ]}
            ]
        },
        {
            id: "supply_potion_stash",
            type: "discovery",
            name: "Hidden Potions!",
            description: "Someone left a stash of potions hidden in the tall grass!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Take them!", outcomes: [
                    { weight: 70, narration: "Several potions in good condition! Nice find!", effects: { potions: 3 } },
                    { weight: 30, narration: "One potion and a Super Potion! Score!", effects: { potions: 1, superPotions: 1 } }
                ]},
                { text: "Leave them for someone else", outcomes: [
                    { weight: 100, narration: "You leave the potions. Karma will reward you... maybe.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_friendly_camper",
            type: "story",
            name: "Friendly Camper!",
            description: "A friendly camper waves you over. \"You look hungry! Share my fire!\"",
            weight: 8,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Join them", outcomes: [
                    { weight: 60, narration: "They share food and stories. A warm night!", effects: { food: 8, healOne: true } },
                    { weight: 30, narration: "They share everything they can spare!", effects: { food: 10, potions: 1 } },
                    { weight: 10, narration: "They share food but their fire attracted wild Pokemon!", effects: { food: 5, partyDamage: 1 } }
                ]},
                { text: "Politely decline", outcomes: [
                    { weight: 100, narration: "You wave and continue on your way.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_fresh_water",
            type: "discovery",
            name: "Fresh Spring!",
            description: "You discover a fresh water spring! Your team drinks deeply.",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Rest here and recover", outcomes: [
                    { weight: 70, narration: "The fresh water revitalizes your entire team!", effects: { healAll: true } },
                    { weight: 30, narration: "A peaceful rest. Everyone feels better!", effects: { healOne: true, food: 3 } }
                ]},
                { text: "Fill canteens and move on", outcomes: [
                    { weight: 100, narration: "You stock up on fresh water for the road.", effects: { food: 5 } }
                ]}
            ]
        },
        {
            id: "supply_broken_cart",
            type: "discovery",
            name: "Broken Cart!",
            description: "You salvage items from a broken cart on the roadside.",
            weight: 6,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Search the wreckage", outcomes: [
                    { weight: 40, narration: "Pokeballs, food, and some money! Jackpot!", effects: { pokeballs: 4, food: 5, money: 300 } },
                    { weight: 40, narration: "Some usable supplies in the debris.", effects: { food: 5, pokeballs: 2 } },
                    { weight: 20, narration: "Mostly junk, but you find a Rare Candy!", effects: { rareCandy: 1 } }
                ]},
                { text: "Move along", outcomes: [
                    { weight: 100, narration: "You leave the wreckage behind.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_herb_forest",
            type: "discovery",
            name: "Medicinal Herbs!",
            description: "You find medicinal herbs growing wild in the forest!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Gather the herbs", outcomes: [
                    { weight: 60, narration: "You craft makeshift potions from the herbs!", effects: { potions: 2 } },
                    { weight: 30, narration: "The herbs heal your injured Pokemon!", effects: { healOne: true } },
                    { weight: 10, narration: "You find a rare herb — equivalent to a Super Potion!", effects: { superPotions: 1 } }
                ]},
                { text: "Leave them", outcomes: [
                    { weight: 100, narration: "You leave the herbs growing for others.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_trainer_satchel",
            type: "discovery",
            name: "Lost Satchel!",
            description: "You discover a trainer's lost satchel on the trail!",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Open it", outcomes: [
                    { weight: 50, narration: "Great Balls, Potions, and money inside!", effects: { greatballs: 2, potions: 2, money: 500 } },
                    { weight: 30, narration: "A few supplies and a note: 'Good luck, trainer!'", effects: { pokeballs: 3, food: 5 } },
                    { weight: 20, narration: "An Escape Rope and a Rare Candy! Someone had great taste.", effects: { escapeRope: 1, rareCandy: 1 } }
                ]},
                { text: "Leave it", outcomes: [
                    { weight: 100, narration: "Its owner might come back for it.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_center_volunteer",
            type: "story",
            name: "Pokemon Center Volunteer!",
            description: "A Pokemon Center volunteer is distributing free supplies on the trail!",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Accept gratefully", outcomes: [
                    { weight: 50, narration: "Potions, food, and encouragement! What a kind soul!", effects: { potions: 2, food: 8 } },
                    { weight: 30, narration: "They heal your Pokemon and hand out Pokeballs!", effects: { healAll: true, pokeballs: 3 } },
                    { weight: 20, narration: "They give you premium supplies!", effects: { superPotions: 1, greatballs: 2, food: 5 } }
                ]},
                { text: "Decline — save it for others", outcomes: [
                    { weight: 70, narration: "\"You're too kind!\" They heal your team anyway.", effects: { healOne: true } },
                    { weight: 30, narration: "You continue on without taking supplies.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_storm_recovery",
            type: "discovery",
            name: "Storm Debris!",
            description: "After a storm, you recover items scattered along the trail.",
            weight: 6,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Scavenge the area", outcomes: [
                    { weight: 50, narration: "Pokeballs and potions among the debris!", effects: { pokeballs: 3, potions: 1 } },
                    { weight: 30, narration: "Mostly ruined supplies, but some food is salvageable.", effects: { food: 5 } },
                    { weight: 20, narration: "You find a well-sealed case with Great Balls!", effects: { greatballs: 3 } }
                ]},
                { text: "Keep moving", outcomes: [
                    { weight: 100, narration: "No time to dig through storm debris.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_fisherman_trade",
            type: "story",
            name: "Fisherman's Trade!",
            description: "A fisherman offers to trade supplies for bait. \"Got any spare food?\"",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Trade food for supplies", outcomes: [
                    { weight: 60, narration: "Great trade! Potions and Pokeballs for some food.", effects: { food: -8, potions: 2, pokeballs: 3 } },
                    { weight: 40, narration: "He throws in a Great Ball as a bonus!", effects: { food: -8, potions: 1, greatballs: 1 } }
                ]},
                { text: "Decline the trade", outcomes: [
                    { weight: 70, narration: "\"No worries! Here, take a fish at least.\"", effects: { food: 3 } },
                    { weight: 30, narration: "He shrugs and goes back to fishing.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_care_package",
            type: "story",
            name: "Care Package!",
            description: "Someone left a care package near your camp with a note: \"For weary travelers.\"",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Open the package", outcomes: [
                    { weight: 50, narration: "Food, potions, and a Pokeball! Faith in humanity restored!", effects: { food: 10, potions: 2, pokeballs: 2 } },
                    { weight: 30, narration: "A warm meal and medical supplies inside!", effects: { food: 8, superPotions: 1 } },
                    { weight: 20, narration: "It contains a Rare Candy and a note: 'Believe in your Pokemon!'", effects: { rareCandy: 1, food: 5 } }
                ]},
                { text: "Leave it for someone who needs it more", outcomes: [
                    { weight: 100, narration: "You leave the package untouched.", effects: {} }
                ]}
            ]
        },
        {
            id: "supply_abandoned_camp",
            type: "discovery",
            name: "Abandoned Campsite!",
            description: "You discover an abandoned campsite with useful gear left behind.",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Search the campsite", outcomes: [
                    { weight: 40, narration: "A Repel, some food, and an Escape Rope!", effects: { repels: 1, food: 5, escapeRope: 1 } },
                    { weight: 40, narration: "Some canned food and a few Pokeballs.", effects: { food: 8, pokeballs: 2 } },
                    { weight: 20, narration: "The camp was ransacked. Only scraps remain.", effects: { food: 2 } }
                ]},
                { text: "Camp here for the night", outcomes: [
                    { weight: 100, narration: "You use the existing campsite. A restful night!", effects: { healOne: true } }
                ]}
            ]
        },

        // ===== EXPLORATION EVENTS =====
        {
            id: "explore_hidden_path",
            type: "discovery",
            name: "Hidden Path!",
            description: "You discover a hidden path through the woods. It could be a shortcut!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Take the shortcut", outcomes: [
                    { weight: 40, narration: "The shortcut saves you a full day of travel!", effects: { daysLost: -1 } },
                    { weight: 30, narration: "The path leads to a clearing with berries!", effects: { food: 8 } },
                    { weight: 30, narration: "It's not a shortcut — you get lost!", effects: { daysLost: 1 } }
                ]},
                { text: "Stick to the main trail", outcomes: [
                    { weight: 100, narration: "You stay on the known path. Safety first.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_abandoned_cabin",
            type: "discovery",
            name: "Abandoned Cabin!",
            description: "Your party finds an abandoned cabin deep in the woods.",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Search inside", outcomes: [
                    { weight: 40, narration: "Old supplies and a journal with useful route information!", effects: { food: 5, potions: 1 } },
                    { weight: 30, narration: "A stash of items hidden under the floorboards!", effects: { money: 500, pokeballs: 3 } },
                    { weight: 20, narration: "A wild Pokemon was nesting inside! It attacks!", effects: { partyDamage: 1 } },
                    { weight: 10, narration: "You find a Rare Candy in a dusty drawer!", effects: { rareCandy: 1 } }
                ]},
                { text: "Rest here overnight", outcomes: [
                    { weight: 70, narration: "A roof over your head! Everyone rests well.", effects: { healOne: true } },
                    { weight: 30, narration: "The cabin creaks all night. Nobody sleeps well.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_strange_statue",
            type: "discovery",
            name: "Strange Statue!",
            description: "A strange stone statue stands beside the trail. It seems ancient.",
            weight: 5,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Examine it closely", outcomes: [
                    { weight: 30, narration: "The statue radiates energy! Your Pokemon feel rejuvenated!", effects: { healAll: true } },
                    { weight: 40, narration: "You find coins left as offerings at its base.", effects: { money: 300 } },
                    { weight: 20, narration: "It's just a weathered old statue. Interesting though.", effects: {} },
                    { weight: 10, narration: "The statue's eyes glow! A Moon Stone drops from a slot!", effects: { rareCandy: 1 } }
                ]},
                { text: "Leave it alone", outcomes: [
                    { weight: 100, narration: "Some things are best left undisturbed.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_old_ruins",
            type: "discovery",
            name: "Old Ruins!",
            description: "You find old ruins deep in the forest. Vines cover crumbling walls.",
            weight: 4,
            oneTime: false,
            minDay: 6,
            choices: [
                { text: "Explore the ruins", outcomes: [
                    { weight: 30, narration: "Ancient treasure! Money and a rare item!", effects: { money: 800, escapeRope: 1 } },
                    { weight: 30, narration: "The ruins are mostly empty but you find some supplies.", effects: { potions: 2, food: 3 } },
                    { weight: 20, narration: "Ghost Pokemon haunt the ruins! Your team is spooked!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "You discover ancient carvings that describe the legendary birds!", effects: { seePokemon: 144 } }
                ]},
                { text: "Too dangerous, move on", outcomes: [
                    { weight: 100, narration: "You leave the crumbling ruins behind.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_cave_entrance",
            type: "discovery",
            name: "Hidden Cave!",
            description: "Your team discovers a hidden cave entrance behind a waterfall!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["cave", "mountain", "water"],
            choices: [
                { text: "Venture inside", outcomes: [
                    { weight: 30, narration: "A treasure trove! Pokeballs and money stashed by a trainer!", effects: { pokeballs: 5, money: 600 } },
                    { weight: 30, narration: "The cave holds medicinal hot springs! Your team heals up!", effects: { healAll: true } },
                    { weight: 20, narration: "Wild Pokemon attack in the darkness!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "You find ancient fossils worth a fortune!", effects: { money: 1000 } }
                ]},
                { text: "Mark it and continue", outcomes: [
                    { weight: 100, narration: "You note the location and keep moving.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_quiet_lake",
            type: "discovery",
            name: "Quiet Lake!",
            description: "You stumble upon a quiet, crystal-clear lake. It's peaceful here.",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Rest by the lake", outcomes: [
                    { weight: 50, narration: "A peaceful rest. Your entire team feels refreshed!", effects: { healAll: true } },
                    { weight: 30, narration: "You fish and catch dinner! Plus some rest.", effects: { food: 8, healOne: true } },
                    { weight: 20, narration: "A water Pokemon surfaces and wants to join!", effects: { catchPokemon: 118 } }
                ]},
                { text: "Fill canteens and go", outcomes: [
                    { weight: 100, narration: "Fresh water for the road!", effects: { food: 3 } }
                ]}
            ]
        },
        {
            id: "explore_mysterious_shrine",
            type: "discovery",
            name: "Mysterious Shrine!",
            description: "Your team finds a mysterious shrine. Candles still flicker despite no wind.",
            weight: 3,
            oneTime: false,
            minDay: 7,
            choices: [
                { text: "Make an offering", outcomes: [
                    { weight: 40, narration: "The shrine glows! Your team is blessed with vitality!", effects: { money: -100, healAll: true } },
                    { weight: 30, narration: "The spirits seem pleased. Good fortune ahead!", effects: { money: -100, rareCandy: 1 } },
                    { weight: 30, narration: "Nothing happens. At least you were respectful.", effects: { money: -100 } }
                ]},
                { text: "Pray without offering", outcomes: [
                    { weight: 50, narration: "You feel a warm sense of peace.", effects: { healOne: true } },
                    { weight: 50, narration: "The candles flicker angrily. Nothing happens... for now.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_glowing_crystals",
            type: "discovery",
            name: "Glowing Crystals!",
            description: "You notice glowing crystals embedded in a cave wall!",
            weight: 4,
            oneTime: false,
            minDay: 5,
            terrainTypes: ["cave", "mountain"],
            choices: [
                { text: "Mine the crystals", outcomes: [
                    { weight: 40, narration: "The crystals are valuable! You sell them for a good price.", effects: { money: 800 } },
                    { weight: 30, narration: "One crystal pulses with energy — it's like a Rare Candy!", effects: { rareCandy: 1 } },
                    { weight: 30, narration: "Mining disturbs wild Pokemon! They attack!", effects: { partyDamage: 1, money: 300 } }
                ]},
                { text: "Admire and move on", outcomes: [
                    { weight: 100, narration: "Beautiful, but you leave them be.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_old_pokeball",
            type: "discovery",
            name: "Buried Pokeball!",
            description: "Your team discovers an old Pokeball buried in the dirt!",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Open it!", outcomes: [
                    { weight: 30, narration: "A Pokemon was still inside! It bursts out and joins your team!", effects: { catchPokemon: 23 } },
                    { weight: 40, narration: "It's empty but still functional. Free Pokeball!", effects: { pokeballs: 1 } },
                    { weight: 20, narration: "It's a Great Ball! And it still works!", effects: { greatballs: 1 } },
                    { weight: 10, narration: "It crumbles to dust. Ancient and useless.", effects: {} }
                ]},
                { text: "Leave it buried", outcomes: [
                    { weight: 100, narration: "You rebury it and move on.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_mysterious_fog",
            type: "discovery",
            name: "Mysterious Fog!",
            description: "A mysterious fog rolls in, covering the trail completely.",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Push through the fog", outcomes: [
                    { weight: 30, narration: "The fog clears and you've actually made great progress!", effects: { daysLost: -1 } },
                    { weight: 40, narration: "You wander in circles and lose time.", effects: { daysLost: 1 } },
                    { weight: 30, narration: "Strange shapes in the fog — Ghost Pokemon swirl around you!", effects: { partyDamage: 1 } }
                ]},
                { text: "Wait for it to clear", outcomes: [
                    { weight: 60, narration: "The fog clears after a few hours.", effects: {} },
                    { weight: 40, narration: "It takes all day for the fog to lift.", effects: { daysLost: 1 } }
                ]}
            ]
        },
        {
            id: "explore_broken_lab",
            type: "discovery",
            name: "Abandoned Laboratory!",
            description: "You find a broken laboratory deep in the woods. Equipment is scattered everywhere.",
            weight: 3,
            oneTime: true,
            minDay: 8,
            choices: [
                { text: "Investigate the lab", outcomes: [
                    { weight: 30, narration: "Research notes mention experiments on evolution! You find a Rare Candy!", effects: { rareCandy: 1 } },
                    { weight: 30, narration: "Potions and medical supplies in the storage room!", effects: { potions: 3, superPotions: 1 } },
                    { weight: 20, narration: "An escaped lab Pokemon attacks!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "You find research data worth money to Professor Oak!", effects: { money: 1000 } }
                ]},
                { text: "Leave it alone", outcomes: [
                    { weight: 100, narration: "Abandoned labs mean trouble. You keep walking.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_hidden_meadow",
            type: "discovery",
            name: "Hidden Meadow!",
            description: "A hidden meadow opens before you. Flowers bloom in every color!",
            weight: 5,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Rest in the meadow", outcomes: [
                    { weight: 50, narration: "The peaceful meadow heals your team's spirits!", effects: { healAll: true } },
                    { weight: 30, narration: "You gather berries and medicinal flowers!", effects: { food: 5, potions: 1 } },
                    { weight: 20, narration: "A wild Pokemon frolics in the meadow and joins you!", effects: { catchPokemon: 43 } }
                ]},
                { text: "Pass through quickly", outcomes: [
                    { weight: 100, narration: "Beautiful, but no time to stop.", effects: {} }
                ]}
            ]
        },
        {
            id: "explore_map_rock",
            type: "discovery",
            name: "Map Carving!",
            description: "You find a map carved into a large flat rock. It shows nearby features.",
            weight: 4,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Study the map", outcomes: [
                    { weight: 40, narration: "The map reveals a shortcut! You save time!", effects: { daysLost: -1 } },
                    { weight: 30, narration: "The map shows a supply cache location! You find it!", effects: { food: 10, pokeballs: 3 } },
                    { weight: 30, narration: "The map is ancient and hard to read. Interesting but unhelpful.", effects: {} }
                ]},
                { text: "Ignore it", outcomes: [
                    { weight: 100, narration: "Old maps can be misleading. You trust your instincts.", effects: {} }
                ]}
            ]
        },

        // ===== CHARACTER ENCOUNTER EVENTS =====
        {
            id: "char_brock_survival",
            type: "story",
            name: "Brock's Advice!",
            description: "Brock appears on the trail! \"Hey! Let me share some survival tips with you!\"",
            weight: 5,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Listen to his advice", outcomes: [
                    { weight: 50, narration: "Brock teaches you about cooking trail food! Your rations go further.", effects: { food: 10 } },
                    { weight: 30, narration: "Brock shares his Pokemon care knowledge! Your team is healthier!", effects: { healAll: true } },
                    { weight: 20, narration: "Brock gives you some supplies from his pack!", effects: { potions: 2, food: 5 } }
                ]},
                { text: "Challenge him to a battle", outcomes: [
                    { weight: 40, narration: "Brock's Onix is tough but you win! He rewards you.", effects: { money: 500, partyDamage: 1 } },
                    { weight: 60, narration: "Brock's rock-solid defense beats you. Good practice though!", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "char_misty_fishing",
            type: "story",
            name: "Misty's Challenge!",
            description: "Misty is fishing by the waterside. \"Think you can out-fish me, trainer?\"",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Accept the fishing challenge", outcomes: [
                    { weight: 40, narration: "You actually out-fish Misty! She gives you a prize!", effects: { money: 500, catchPokemon: 118 } },
                    { weight: 40, narration: "Misty wins easily. She still gives you a consolation fish.", effects: { food: 5 } },
                    { weight: 20, narration: "You both catch a Magikarp! Misty laughs and you keep yours.", effects: { catchPokemon: 129 } }
                ]},
                { text: "Ask for water Pokemon tips", outcomes: [
                    { weight: 100, narration: "Misty shares her expertise. You feel more confident near water!", effects: { potions: 1 } }
                ]}
            ]
        },
        {
            id: "char_team_rocket_disguise",
            type: "combat",
            name: "Suspicious Merchants!",
            description: "Two merchants in terrible disguises offer you a deal. That hair looks familiar...",
            weight: 6,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "\"You're Team Rocket!\"", outcomes: [
                    { weight: 50, narration: "\"Blast off again!\" They flee, dropping some loot!", effects: { money: 300, pokeballs: 2 } },
                    { weight: 30, narration: "They panic and battle you! A quick fight.", effects: { money: 500, partyDamage: 1 } },
                    { weight: 20, narration: "\"How did you know?!\" They drop everything and run!", effects: { food: 5, potions: 2, money: 200 } }
                ]},
                { text: "Play along with their scheme", outcomes: [
                    { weight: 40, narration: "They sell you overpriced junk. Classic Rocket.", effects: { money: -300 } },
                    { weight: 60, narration: "Their products are actually decent! Maybe crime does pay.", effects: { money: -200, potions: 2, pokeballs: 3 } }
                ]}
            ]
        },
        {
            id: "char_professor_call",
            type: "story",
            name: "Professor Oak Calls!",
            description: "Your Pokedex rings! Professor Oak is checking on your progress.",
            weight: 5,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Chat with Professor Oak", outcomes: [
                    { weight: 40, narration: "Oak is impressed! He sends a care package to the next town!", effects: { potions: 2, pokeballs: 3 } },
                    { weight: 40, narration: "Oak shares research that helps your team! Knowledge is power!", effects: { healOne: true } },
                    { weight: 20, narration: "Oak sends you a rare item via PC transfer!", effects: { rareCandy: 1 } }
                ]},
                { text: "Keep it brief", outcomes: [
                    { weight: 100, narration: "\"Keep up the good work!\" Oak hangs up.", effects: {} }
                ]}
            ]
        },
        {
            id: "char_wandering_trainer",
            type: "story",
            name: "Wandering Trainer!",
            description: "A wandering trainer offers battle tips. \"Let me show you some tricks!\"",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Learn from them", outcomes: [
                    { weight: 50, narration: "Great tips! Your team feels more prepared!", effects: { healOne: true } },
                    { weight: 30, narration: "They share some supplies too!", effects: { pokeballs: 2, food: 3 } },
                    { weight: 20, narration: "They teach your Pokemon a new technique! Everyone's energized!", effects: { healAll: true } }
                ]},
                { text: "Challenge them instead", outcomes: [
                    { weight: 50, narration: "You win! They hand over prize money.", effects: { money: 400, partyDamage: 1 } },
                    { weight: 50, narration: "They're tougher than they look! You lose.", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "char_pokemon_breeder",
            type: "story",
            name: "Pokemon Breeder!",
            description: "A Pokemon breeder examines your team. \"I can help your Pokemon!\"",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Accept their help", outcomes: [
                    { weight: 50, narration: "The breeder nurses your Pokemon back to health!", effects: { healAll: true } },
                    { weight: 30, narration: "They give your Pokemon special vitamins!", effects: { healOne: true, food: 5 } },
                    { weight: 20, narration: "They have a spare Pokemon that needs a home!", effects: { catchPokemon: 133 } }
                ]},
                { text: "Politely decline", outcomes: [
                    { weight: 100, narration: "\"If you change your mind, I'll be around!\"", effects: {} }
                ]}
            ]
        },
        {
            id: "char_ranger_warning",
            type: "story",
            name: "Ranger Warning!",
            description: "A Pokemon Ranger stops you. \"Danger ahead! Let me help you prepare.\"",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Heed the warning", outcomes: [
                    { weight: 50, narration: "The Ranger gives you supplies and escorts you through!", effects: { potions: 2, repels: 1 } },
                    { weight: 30, narration: "Thanks to the warning, you find a safe detour!", effects: {} },
                    { weight: 20, narration: "The Ranger shares their emergency supplies!", effects: { food: 8, escapeRope: 1 } }
                ]},
                { text: "\"I can handle it\"", outcomes: [
                    { weight: 50, narration: "Your confidence pays off! The danger wasn't that bad.", effects: {} },
                    { weight: 50, narration: "Should have listened to the Ranger.", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "char_hiker_stories",
            type: "story",
            name: "Friendly Hiker!",
            description: "A hiker shares stories from the mountains over a warm drink.",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Listen to the stories", outcomes: [
                    { weight: 50, narration: "The hiker's tips help you navigate better!", effects: { food: 3 } },
                    { weight: 30, narration: "He shares his food and drink!", effects: { food: 8, healOne: true } },
                    { weight: 20, narration: "His stories reveal a hidden supply cache nearby!", effects: { pokeballs: 3, potions: 2 } }
                ]},
                { text: "Trade stories", outcomes: [
                    { weight: 70, narration: "A nice chat! The hiker shares some food.", effects: { food: 5 } },
                    { weight: 30, narration: "He's so impressed by your journey he gives you a gift!", effects: { money: 500 } }
                ]}
            ]
        },
        {
            id: "char_bug_catcher",
            type: "story",
            name: "Bug Catcher!",
            description: "A Bug Catcher excitedly discusses rare Pokemon. \"I've seen amazing things on this route!\"",
            weight: 6,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Battle the Bug Catcher", outcomes: [
                    { weight: 60, narration: "Easy win! Bug Catchers are enthusiastic but not strong.", effects: { money: 200 } },
                    { weight: 40, narration: "Their Beedrill put up a surprising fight!", effects: { money: 300, partyDamage: 1 } }
                ]},
                { text: "Chat about bugs", outcomes: [
                    { weight: 50, narration: "They point out where rare Pokemon hide! Useful intel.", effects: {} },
                    { weight: 50, narration: "They give you a Pokeball. Bug Catchers carry tons of them.", effects: { pokeballs: 2 } }
                ]}
            ]
        },
        {
            id: "char_scientist",
            type: "story",
            name: "Field Scientist!",
            description: "A scientist studies unusual Pokemon behavior nearby. \"Fascinating! Can I examine your team?\"",
            weight: 4,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Allow the examination", outcomes: [
                    { weight: 40, narration: "The scientist's scan reveals health issues — and fixes them!", effects: { healAll: true } },
                    { weight: 30, narration: "\"Remarkable specimens!\" They give you a reward for the data!", effects: { money: 500 } },
                    { weight: 30, narration: "They share experimental potions as thanks!", effects: { superPotions: 2 } }
                ]},
                { text: "Decline", outcomes: [
                    { weight: 100, narration: "\"Perhaps another time then!\" The scientist returns to their work.", effects: {} }
                ]}
            ]
        },
        {
            id: "char_rival_taunt",
            type: "story",
            name: "Rival Encounter!",
            description: "Your rival appears! \"Still slowpoke-ing along? I'm way ahead of you!\"",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Battle your rival!", outcomes: [
                    { weight: 40, narration: "You beat your rival! \"Smell ya later!\" They drop prize money.", effects: { money: 800, partyDamage: 1 } },
                    { weight: 40, narration: "A close match but your rival wins this time.", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "Crushing victory! Your rival is speechless!", effects: { money: 1000 } }
                ]},
                { text: "Ignore them", outcomes: [
                    { weight: 60, narration: "Your rival runs off, annoyed you didn't engage.", effects: {} },
                    { weight: 40, narration: "\"Fine! Take this and get stronger!\" They toss you an item.", effects: { potions: 1 } }
                ]}
            ]
        },
        {
            id: "char_jessie_james",
            type: "combat",
            name: "Jessie & James Again!",
            description: "\"Prepare for trouble! And make it double!\" Jessie and James strike a pose.",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "\"Not you two again...\"", outcomes: [
                    { weight: 50, narration: "Team Rocket blasts off again! They drop some items in the process.", effects: { pokeballs: 2, money: 200 } },
                    { weight: 30, narration: "Their Meowth puts up a decent fight!", effects: { partyDamage: 1, money: 300 } },
                    { weight: 20, narration: "They actually manage to steal some food!", effects: { food: -5 } }
                ]},
                { text: "Listen to their motto", outcomes: [
                    { weight: 40, narration: "They're so flattered you listened that they forget to fight and leave.", effects: {} },
                    { weight: 60, narration: "The motto was a distraction! They grab some supplies!", effects: { pokeballs: -2, food: -3 } }
                ]}
            ]
        },
        {
            id: "char_lost_child",
            type: "story",
            name: "Lost Child!",
            description: "A young child is crying on the trail. \"I can't find my way home!\"",
            weight: 5,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Help them find home", outcomes: [
                    { weight: 50, narration: "You escort the child to the nearest town. Their parents reward you!", effects: { daysLost: 1, money: 500 } },
                    { weight: 30, narration: "The child's parent finds you both! They're so grateful!", effects: { money: 300, food: 5, potions: 1 } },
                    { weight: 20, narration: "The child knows a secret shortcut home! You save time!", effects: { money: 200 } }
                ]},
                { text: "Point them to the nearest town", outcomes: [
                    { weight: 70, narration: "The child thanks you and heads off.", effects: {} },
                    { weight: 30, narration: "You feel guilty watching them go alone...", effects: {} }
                ]}
            ]
        },
        {
            id: "char_collector",
            type: "story",
            name: "Pokemon Collector!",
            description: "A collector offers rewards for Pokemon information. \"I'll pay for Pokedex data!\"",
            weight: 4,
            oneTime: false,
            minDay: 6,
            choices: [
                { text: "Share your Pokedex data", outcomes: [
                    { weight: 50, narration: "The collector pays handsomely for your data!", effects: { money: 800 } },
                    { weight: 30, narration: "\"Excellent data!\" They give you rare items as payment!", effects: { greatballs: 2, superPotions: 1 } },
                    { weight: 20, narration: "\"This data is incredible!\" Ultra-rare reward!", effects: { money: 500, rareCandy: 1 } }
                ]},
                { text: "Decline to share", outcomes: [
                    { weight: 100, narration: "\"Your loss!\" The collector walks away.", effects: {} }
                ]}
            ]
        },
        {
            id: "char_mysterious_figure",
            type: "story",
            name: "Mysterious Stranger!",
            description: "A mysterious figure in a cloak watches your party silently from the shadows.",
            weight: 4,
            oneTime: false,
            minDay: 7,
            choices: [
                { text: "Approach them", outcomes: [
                    { weight: 30, narration: "They hand you an item without a word and vanish!", effects: { rareCandy: 1 } },
                    { weight: 40, narration: "\"Your journey is not over, trainer.\" They give you supplies.", effects: { potions: 2, food: 5 } },
                    { weight: 30, narration: "They vanish the moment you blink. Were they even real?", effects: {} }
                ]},
                { text: "Avoid them", outcomes: [
                    { weight: 70, narration: "You give them a wide berth. Probably wise.", effects: {} },
                    { weight: 30, narration: "They call out: \"Wait!\" and toss you a Pokeball.", effects: { greatballs: 1 } }
                ]}
            ]
        },
        {
            id: "char_nurse_traveling",
            type: "story",
            name: "Traveling Nurse!",
            description: "A nurse traveling from a Pokemon Center stops to help your team!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Accept her help", outcomes: [
                    { weight: 60, narration: "She heals all your Pokemon! Just like a Pokemon Center!", effects: { healAll: true } },
                    { weight: 30, narration: "She heals your team and gives you spare potions!", effects: { healAll: true, potions: 2 } },
                    { weight: 10, narration: "She heals your team and shares her lunch!", effects: { healAll: true, food: 5 } }
                ]},
                { text: "\"We're fine, thanks!\"", outcomes: [
                    { weight: 100, narration: "\"Stay safe out there!\" She waves and continues on.", effects: {} }
                ]}
            ]
        },

        // ===== HAZARD EVENTS =====
        {
            id: "hazard_storm_slow",
            type: "weather",
            name: "Sudden Storm!",
            description: "A storm slows your journey to a crawl. Rain pounds your party!",
            weight: 8,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Push through", outcomes: [
                    { weight: 40, narration: "You slog through the storm and lose a day.", effects: { daysLost: 1, partyDamage: 1 } },
                    { weight: 60, narration: "The storm passes quicker than expected!", effects: { partyDamage: 1 } }
                ]},
                { text: "Make camp and wait", outcomes: [
                    { weight: 60, narration: "You wait out the storm safely.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The storm lasts two days!", effects: { daysLost: 2 } }
                ]}
            ]
        },
        {
            id: "hazard_lost_forest",
            type: "hazard",
            name: "Lost in the Forest!",
            description: "Your party gets lost in the dense forest. Everything looks the same!",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Try to find the way", outcomes: [
                    { weight: 40, narration: "You find the trail after hours of wandering!", effects: { daysLost: 1 } },
                    { weight: 30, narration: "You stumble onto a new path — a shortcut!", effects: {} },
                    { weight: 30, narration: "You wander in circles all day.", effects: { daysLost: 2, food: -5 } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 100, narration: "The Escape Rope guides you back to the main trail!", effects: { escapeRope: -1 } }
                ]}
            ]
        },
        {
            id: "hazard_food_spoil",
            type: "hazard",
            name: "Food Spoiled!",
            description: "Your food supplies spoiled unexpectedly! The heat ruined everything.",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Salvage what you can", outcomes: [
                    { weight: 50, narration: "You save about half your food.", effects: { food: -8 } },
                    { weight: 50, narration: "Almost everything is ruined.", effects: { food: -15 } }
                ]},
                { text: "Forage for replacement food", outcomes: [
                    { weight: 60, narration: "You find berries and roots to replace some food!", effects: { food: -5 } },
                    { weight: 40, narration: "Slim pickings. Your food supply takes a big hit.", effects: { food: -12 } }
                ]}
            ]
        },
        {
            id: "hazard_wild_stalkers",
            type: "hazard",
            name: "Night Stalkers!",
            description: "Wild Pokemon stalk your camp at night! Their eyes glow in the darkness.",
            weight: 7,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Stand guard all night", outcomes: [
                    { weight: 50, narration: "You keep them at bay but everyone's exhausted.", effects: { daysLost: 1 } },
                    { weight: 30, narration: "They attack at dawn! Quick battle!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "They lose interest and wander away.", effects: {} }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 90, narration: "The Repel keeps them away all night!", effects: { repels: -1 } },
                    { weight: 10, narration: "The Repel wears off at dawn. They charge!", effects: { repels: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_wrong_turn",
            type: "hazard",
            name: "Wrong Turn!",
            description: "Your party takes a wrong turn and ends up far off the trail.",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Backtrack to the trail", outcomes: [
                    { weight: 60, narration: "You find the trail again after half a day.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The detour leads to useful supplies!", effects: { food: 5, pokeballs: 2 } }
                ]},
                { text: "Cut through the wilderness", outcomes: [
                    { weight: 40, narration: "A rough shortcut, but you rejoin the trail!", effects: { partyDamage: 1 } },
                    { weight: 60, narration: "The wilderness is harsh. Your team suffers.", effects: { partyDamage: 1, food: -5 } }
                ]}
            ]
        },
        {
            id: "hazard_rockslide_block",
            type: "hazard",
            name: "Blocked Path!",
            description: "A rockslide blocks the trail ahead! You need to find a way through.",
            weight: 6,
            oneTime: false,
            minDay: 4,
            terrainTypes: ["mountain", "cave"],
            choices: [
                { text: "Clear the rocks", outcomes: [
                    { weight: 50, narration: "Your Pokemon help clear the path! It takes time though.", effects: { daysLost: 1 } },
                    { weight: 50, narration: "The rocks are too massive. You find a detour.", effects: { daysLost: 2 } }
                ]},
                { text: "Use Escape Rope to climb over", requiresItem: "escapeRope", outcomes: [
                    { weight: 80, narration: "You scale the rockslide and continue!", effects: { escapeRope: -1 } },
                    { weight: 20, narration: "Tricky climb but you make it over!", effects: { escapeRope: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_bridge_collapse",
            type: "hazard",
            name: "Bridge Collapse!",
            description: "The bridge ahead collapses just as you approach! Now what?",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Find another crossing", outcomes: [
                    { weight: 50, narration: "You find a shallow ford downstream. Costs a day.", effects: { daysLost: 1 } },
                    { weight: 50, narration: "The detour is long and exhausting.", effects: { daysLost: 2, food: -5 } }
                ]},
                { text: "Build a makeshift bridge", outcomes: [
                    { weight: 40, narration: "Your Pokemon help build a crossing! Teamwork!", effects: { daysLost: 1 } },
                    { weight: 60, narration: "The makeshift bridge holds just long enough!", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_supplies_river",
            type: "hazard",
            name: "Supplies in the River!",
            description: "Your supplies fell into the river during a crossing!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Dive in after them", outcomes: [
                    { weight: 50, narration: "You recover most of your supplies!", effects: { food: -5 } },
                    { weight: 30, narration: "The current is too strong. You lose a lot.", effects: { food: -12, pokeballs: -3 } },
                    { weight: 20, narration: "Your Pokemon helps fish everything out!", effects: { food: -2 } }
                ]},
                { text: "Let them go", outcomes: [
                    { weight: 100, narration: "You watch your supplies float away downstream.", effects: { food: -10, pokeballs: -2 } }
                ]}
            ]
        },
        {
            id: "hazard_poison_plants",
            type: "hazard",
            name: "Poisonous Plants!",
            description: "Poisonous plants contaminate your food supply!",
            weight: 6,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Throw out contaminated food", outcomes: [
                    { weight: 60, narration: "You toss the bad food. Better safe than sorry.", effects: { food: -10 } },
                    { weight: 40, narration: "You carefully sort the good from the bad.", effects: { food: -5 } }
                ]},
                { text: "Risk eating it", outcomes: [
                    { weight: 30, narration: "It's actually fine! You saved your food.", effects: {} },
                    { weight: 70, narration: "Your Pokemon get sick from the contaminated food.", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_wild_raid",
            type: "hazard",
            name: "Supply Raid!",
            description: "A pack of wild Pokemon raids your supplies during the night!",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Defend your supplies!", outcomes: [
                    { weight: 40, narration: "You drive them off but they got some food!", effects: { food: -5, partyDamage: 1 } },
                    { weight: 40, narration: "You protect everything! Your team stands guard.", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "Complete defense! Nothing was taken!", effects: {} }
                ]},
                { text: "Let them take some", outcomes: [
                    { weight: 70, narration: "They take food and leave peacefully.", effects: { food: -8 } },
                    { weight: 30, narration: "They take almost everything!", effects: { food: -15, pokeballs: -2 } }
                ]}
            ]
        },
        {
            id: "hazard_equipment_break",
            type: "hazard",
            name: "Broken Equipment!",
            description: "Your equipment breaks during travel! Some items are lost.",
            weight: 6,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Repair what you can", outcomes: [
                    { weight: 60, narration: "You fix most of your gear. Only a few items lost.", effects: { pokeballs: -2 } },
                    { weight: 40, narration: "Too much damage. Significant losses.", effects: { pokeballs: -3, potions: -1 } }
                ]},
                { text: "Discard and lighten load", outcomes: [
                    { weight: 100, narration: "You toss the broken gear. Lighter but less equipped.", effects: { pokeballs: -2, potions: -1 } }
                ]}
            ]
        },
        {
            id: "hazard_sandstorm_blind",
            type: "weather",
            name: "Blinding Sandstorm!",
            description: "A sandstorm blinds your party! Sand cuts at your skin!",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Push through", outcomes: [
                    { weight: 40, narration: "You make it through but everyone is battered.", effects: { partyDamage: 2 } },
                    { weight: 60, narration: "The storm weakens and you pass through.", effects: { partyDamage: 1 } }
                ]},
                { text: "Take shelter and wait", outcomes: [
                    { weight: 60, narration: "You wait out the sandstorm safely.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The sandstorm lasts way too long.", effects: { daysLost: 2, food: -3 } }
                ]}
            ]
        },
        {
            id: "hazard_flood",
            type: "hazard",
            name: "Flash Flood!",
            description: "Your path becomes flooded! Water rises rapidly!",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Wade through", outcomes: [
                    { weight: 40, narration: "You make it through the flood! Soggy but safe.", effects: { food: -5 } },
                    { weight: 40, narration: "The current is strong! Your team struggles!", effects: { partyDamage: 1, food: -3 } },
                    { weight: 20, narration: "The flood sweeps away some supplies!", effects: { food: -10, pokeballs: -2 } }
                ]},
                { text: "Wait for waters to recede", outcomes: [
                    { weight: 60, narration: "The water drops after a day. You continue safely.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "It takes two days for the flood to recede.", effects: { daysLost: 2 } }
                ]}
            ]
        },
        {
            id: "hazard_ambush_surprise",
            type: "hazard",
            name: "Wild Ambush!",
            description: "A wild Pokemon ambush surprises your party from all sides!",
            weight: 7,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Fight them off!", outcomes: [
                    { weight: 40, narration: "Your team battles bravely and drives them away!", effects: { partyDamage: 1 } },
                    { weight: 40, narration: "A tough fight from all angles!", effects: { partyDamage: 2 } },
                    { weight: 20, narration: "You scatter the ambush and find one wants to join you!", effects: { partyDamage: 1, catchPokemon: 23 } }
                ]},
                { text: "Use a Repel to escape", requiresItem: "repels", outcomes: [
                    { weight: 80, narration: "The Repel creates a path through the wild Pokemon!", effects: { repels: -1 } },
                    { weight: 20, narration: "Too many to repel! You still take some hits.", effects: { repels: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_dangerous_cliff",
            type: "hazard",
            name: "Dangerous Cliff Path!",
            description: "A dangerous cliff path is the only way forward. It's narrow and crumbling.",
            weight: 5,
            oneTime: false,
            minDay: 6,
            terrainTypes: ["mountain"],
            choices: [
                { text: "Cross carefully", outcomes: [
                    { weight: 50, narration: "Slow and steady wins the race! Everyone crosses safely.", effects: { daysLost: 1 } },
                    { weight: 30, narration: "A close call — rocks crumble but everyone makes it!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "Part of the path gives way!", effects: { partyDamage: 2 } }
                ]},
                { text: "Use Escape Rope for safety", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You use the rope as a safety line. Everyone crosses!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The rope helps but the path is still treacherous.", effects: { escapeRope: -1, partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_unstable_ground",
            type: "hazard",
            name: "Unstable Ground!",
            description: "Your team encounters unstable ground. The earth shifts beneath your feet!",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Tread lightly", outcomes: [
                    { weight: 50, narration: "You carefully pick your way across!", effects: {} },
                    { weight: 30, narration: "A section collapses but everyone jumps clear!", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "The whole area gives way! Rough tumble!", effects: { partyDamage: 2 } }
                ]},
                { text: "Find a way around", outcomes: [
                    { weight: 60, narration: "A longer route but much safer.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The detour has its own hazards.", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "hazard_followed",
            type: "hazard",
            name: "Something Following!",
            description: "Something has been following your party silently for miles...",
            weight: 5,
            oneTime: false,
            minDay: 5,
            choices: [
                { text: "Confront it!", outcomes: [
                    { weight: 30, narration: "It's a wild Pokemon! It attacks!", effects: { partyDamage: 1 } },
                    { weight: 30, narration: "It's a lost Pokemon! It wants to join your team!", effects: { catchPokemon: 48 } },
                    { weight: 40, narration: "Nothing there. Maybe you imagined it.", effects: {} }
                ]},
                { text: "Pick up the pace", outcomes: [
                    { weight: 60, narration: "Whatever it was, you leave it behind.", effects: {} },
                    { weight: 40, narration: "It keeps up! But eventually gives up.", effects: {} }
                ]}
            ]
        },

        // ===== RARE & LEGENDARY EVENTS =====
        {
            id: "rare_legendary_sighting",
            type: "story",
            name: "Legendary Sighting!",
            description: "A legendary Pokemon is seen flying in the distance! Your jaw drops!",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Chase after it!", outcomes: [
                    { weight: 20, narration: "You get close enough to see it clearly! Incredible!", effects: { seePokemon: 144, daysLost: 1 } },
                    { weight: 80, narration: "It's gone in a flash. But what a sight!", effects: {} }
                ]},
                { text: "Watch in awe", outcomes: [
                    { weight: 100, narration: "You watch the legendary Pokemon soar across the sky. Unforgettable.", effects: {} }
                ]}
            ]
        },
        {
            id: "rare_unnatural_storm",
            type: "weather",
            name: "Unnatural Storm!",
            description: "A powerful storm seems completely unnatural. Lightning strikes in patterns!",
            weight: 3,
            oneTime: false,
            minDay: 12,
            choices: [
                { text: "Investigate the source", outcomes: [
                    { weight: 30, narration: "You glimpse Zapdos at the storm's center! Awe-inspiring!", effects: { seePokemon: 145, partyDamage: 1 } },
                    { weight: 70, narration: "The storm is too dangerous to approach. You take shelter.", effects: { daysLost: 1 } }
                ]},
                { text: "Take cover immediately", outcomes: [
                    { weight: 70, narration: "You shelter until the unnatural storm passes.", effects: { daysLost: 1 } },
                    { weight: 30, narration: "Even in shelter, the storm's power is felt!", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "rare_glowing_feather",
            type: "discovery",
            name: "Glowing Feather!",
            description: "You find a feather glowing with strange energy on the trail!",
            weight: 3,
            oneTime: true,
            minDay: 8,
            choices: [
                { text: "Pick it up", outcomes: [
                    { weight: 40, narration: "The feather pulses with warmth! Your team feels energized!", effects: { healAll: true } },
                    { weight: 30, narration: "It's a feather from a legendary bird! Worth a fortune!", effects: { money: 2000 } },
                    { weight: 30, narration: "The feather dissolves into light, healing your team completely!", effects: { healAll: true, food: 10 } }
                ]},
                { text: "Leave it", outcomes: [
                    { weight: 100, narration: "Something that powerful is best left alone.", effects: {} }
                ]}
            ]
        },
        {
            id: "rare_freezing_air",
            type: "weather",
            name: "Sudden Freeze!",
            description: "The air suddenly turns freezing cold. Frost forms on everything!",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Look for the source", outcomes: [
                    { weight: 30, narration: "You spot Articuno perched on a distant peak!", effects: { seePokemon: 144 } },
                    { weight: 70, narration: "The cold is unbearable. Your team shivers and presses on.", effects: { partyDamage: 1 } }
                ]},
                { text: "Huddle for warmth", outcomes: [
                    { weight: 60, narration: "The cold passes as quickly as it came.", effects: {} },
                    { weight: 40, narration: "The lingering cold costs your team energy.", effects: { food: -5 } }
                ]}
            ]
        },
        {
            id: "rare_distant_roar",
            type: "story",
            name: "Distant Roar!",
            description: "A distant roar echoes across the mountains. The ground trembles!",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Investigate", outcomes: [
                    { weight: 20, narration: "You find massive footprints — something enormous was here!", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The roar fades. Whatever it was is gone.", effects: {} },
                    { weight: 40, narration: "Wild Pokemon in the area are spooked and aggressive!", effects: { partyDamage: 1 } }
                ]},
                { text: "Stay away from the sound", outcomes: [
                    { weight: 100, narration: "Wisdom is knowing when to be cautious.", effects: {} }
                ]}
            ]
        },
        {
            id: "rare_psychic_wave",
            type: "story",
            name: "Psychic Wave!",
            description: "A mysterious psychic wave shakes your team! Your Pokemon clutch their heads!",
            weight: 2,
            oneTime: false,
            minDay: 15,
            choices: [
                { text: "Push through the pain", outcomes: [
                    { weight: 40, narration: "The wave passes. Your team is dazed but okay.", effects: { partyDamage: 1 } },
                    { weight: 30, narration: "The psychic energy actually strengthens your bond!", effects: { healOne: true } },
                    { weight: 30, narration: "You glimpse a vision of Mewtwo's cave!", effects: { seePokemon: 150, partyDamage: 1 } }
                ]},
                { text: "Take shelter", outcomes: [
                    { weight: 60, narration: "You shield your team from the worst of it.", effects: {} },
                    { weight: 40, narration: "The psychic power penetrates even shelter.", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "rare_ancient_ruins",
            type: "discovery",
            name: "Ancient Ruins!",
            description: "You discover ancient ruins tied to a powerful Pokemon! Energy crackles in the air!",
            weight: 2,
            oneTime: true,
            minDay: 12,
            choices: [
                { text: "Explore the ruins", outcomes: [
                    { weight: 30, narration: "You find artifacts from an ancient civilization! Valuable!", effects: { money: 2000, rareCandy: 1 } },
                    { weight: 40, narration: "The ruins hold ancient power that revitalizes your team!", effects: { healAll: true, superPotions: 2 } },
                    { weight: 30, narration: "A guardian Pokemon attacks! Defending the ruins!", effects: { partyDamage: 2 } }
                ]},
                { text: "Document and leave", outcomes: [
                    { weight: 70, narration: "Professor Oak will want to hear about this!", effects: { money: 500 } },
                    { weight: 30, narration: "As you leave, a warm light heals your team!", effects: { healOne: true } }
                ]}
            ]
        },
        {
            id: "rare_scorched_ground",
            type: "discovery",
            name: "Scorched Earth!",
            description: "You find a scorched patch of ground. The heat is still radiating. Something powerful was here.",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Search the area", outcomes: [
                    { weight: 30, narration: "A feather from Moltres! It radiates healing warmth!", effects: { seePokemon: 146, healAll: true } },
                    { weight: 40, narration: "Just scorched earth. But the warmth is comforting.", effects: { healOne: true } },
                    { weight: 30, narration: "The residual heat is dangerous! Pokemon get burned!", effects: { partyDamage: 1 } }
                ]},
                { text: "Avoid the area", outcomes: [
                    { weight: 100, narration: "Something that can scorch the earth like this isn't to be trifled with.", effects: {} }
                ]}
            ]
        },
        {
            id: "rare_shrine_reaction",
            type: "discovery",
            name: "Shrine Reacts!",
            description: "A roadside shrine begins to glow as your party approaches! It reacts to your presence!",
            weight: 2,
            oneTime: true,
            minDay: 12,
            choices: [
                { text: "Touch the shrine", outcomes: [
                    { weight: 30, narration: "Incredible power flows through your team! Everyone is fully healed!", effects: { healAll: true, rareCandy: 1 } },
                    { weight: 40, narration: "The shrine bestows a blessing on your journey!", effects: { healAll: true } },
                    { weight: 30, narration: "The energy is too intense! Your team is knocked back!", effects: { partyDamage: 1 } }
                ]},
                { text: "Observe from a distance", outcomes: [
                    { weight: 60, narration: "The glow fades. Whatever it was, the moment has passed.", effects: {} },
                    { weight: 40, narration: "Even from afar, you feel a gentle warmth.", effects: { healOne: true } }
                ]}
            ]
        },
        {
            id: "rare_powerful_presence",
            type: "story",
            name: "Powerful Presence!",
            description: "You feel a powerful presence watching from afar. The hair on your neck stands up.",
            weight: 3,
            oneTime: false,
            minDay: 12,
            choices: [
                { text: "Call out to it", outcomes: [
                    { weight: 20, narration: "A brief glimpse of something massive before it vanishes!", effects: { seePokemon: 149 } },
                    { weight: 80, narration: "Silence. But the feeling of being watched persists.", effects: {} }
                ]},
                { text: "Keep moving quietly", outcomes: [
                    { weight: 50, narration: "The presence fades. You wonder what it was.", effects: {} },
                    { weight: 50, narration: "The presence seems to follow for a while, then vanishes.", effects: {} }
                ]}
            ]
        },
        {
            id: "rare_eerie_cry",
            type: "story",
            name: "Eerie Cry!",
            description: "The wind carries an eerie cry across the region. Your Pokemon react nervously.",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Comfort your Pokemon", outcomes: [
                    { weight: 50, narration: "You calm your team. The cry fades away.", effects: {} },
                    { weight: 30, narration: "Your Pokemon are too spooked. They refuse to move for hours.", effects: { daysLost: 1 } },
                    { weight: 20, narration: "The cry seems to energize your Pokemon instead!", effects: { healOne: true } }
                ]},
                { text: "Follow the sound", outcomes: [
                    { weight: 30, narration: "You find a clearing where a legendary Pokemon once rested!", effects: { money: 500 } },
                    { weight: 70, narration: "The sound leads nowhere. Just the wind.", effects: { daysLost: 1 } }
                ]}
            ]
        },
        {
            id: "rare_storm_cloud",
            type: "weather",
            name: "Instant Storm!",
            description: "A storm cloud forms instantly overhead! This is no natural weather!",
            weight: 3,
            oneTime: false,
            minDay: 10,
            choices: [
                { text: "Brace for it", outcomes: [
                    { weight: 40, narration: "The storm unleashes fury but passes quickly!", effects: { partyDamage: 1 } },
                    { weight: 30, narration: "Lightning strikes reveal a nearby supply cache!", effects: { partyDamage: 1, potions: 2, money: 300 } },
                    { weight: 30, narration: "The storm scatters some of your supplies!", effects: { food: -5 } }
                ]},
                { text: "Run for cover!", outcomes: [
                    { weight: 60, narration: "You find shelter just in time!", effects: {} },
                    { weight: 40, narration: "Can't outrun this storm!", effects: { partyDamage: 1 } }
                ]}
            ]
        },

        // ===== COMEDIC OREGON TRAIL EVENTS =====
        {
            id: "comedy_wont_wake",
            type: "story",
            name: "Sleepy Pokemon!",
            description: "Your Pokemon refuses to wake up this morning. It's snoring loudly.",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Wait for them to wake up", outcomes: [
                    { weight: 50, narration: "They finally wake up... at noon. Half the day wasted.", effects: { daysLost: 1 } },
                    { weight: 50, narration: "They wake up refreshed and full of energy!", effects: { healOne: true } }
                ]},
                { text: "Poke them awake", outcomes: [
                    { weight: 60, narration: "Grumpy but awake! They sulk for a bit.", effects: {} },
                    { weight: 40, narration: "They roll over and go back to sleep. *sigh*", effects: { daysLost: 1 } }
                ]}
            ]
        },
        {
            id: "comedy_stole_food",
            type: "story",
            name: "Midnight Snacker!",
            description: "Your Pokemon stole food from the supplies! They're caught red-handed!",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Scold them", outcomes: [
                    { weight: 50, narration: "They look guilty. But the food is already gone.", effects: { food: -5 } },
                    { weight: 50, narration: "They sheepishly spit some of it back out.", effects: { food: -3 } }
                ]},
                { text: "Let it slide", outcomes: [
                    { weight: 60, narration: "A well-fed Pokemon is a happy Pokemon... right?", effects: { food: -5 } },
                    { weight: 40, narration: "They share the food with everyone! Team bonding!", effects: { food: -3, healOne: true } }
                ]}
            ]
        },
        {
            id: "comedy_sulking",
            type: "story",
            name: "Sulking Pokemon!",
            description: "Your Pokemon is sulking for unknown reasons. Arms crossed, won't make eye contact.",
            weight: 7,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Try to cheer them up", outcomes: [
                    { weight: 40, narration: "After much coaxing, they crack a smile!", effects: {} },
                    { weight: 30, narration: "Food fixes everything! They perk right up.", effects: { food: -3 } },
                    { weight: 30, narration: "They're still sulking. This could take a while.", effects: { daysLost: 1 } }
                ]},
                { text: "Ignore the sulking", outcomes: [
                    { weight: 50, narration: "They get over it on their own.", effects: {} },
                    { weight: 50, narration: "The sulking is contagious. Everyone's moody now.", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "comedy_found_thing",
            type: "story",
            name: "Won't Let Go!",
            description: "Your Pokemon found something strange and won't let go of it no matter what.",
            weight: 6,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Let them keep it", outcomes: [
                    { weight: 40, narration: "It's a rock. They love the rock. The rock is their friend now.", effects: {} },
                    { weight: 30, narration: "Wait — it's actually a Nugget! Good find!", effects: { money: 500 } },
                    { weight: 30, narration: "It's a Pokeball! And it still works!", effects: { pokeballs: 1 } }
                ]},
                { text: "Pry it from their hands", outcomes: [
                    { weight: 50, narration: "They growl but give it up. It was just a stick.", effects: {} },
                    { weight: 50, narration: "They refuse and run off with it! They come back later without it.", effects: {} }
                ]}
            ]
        },
        {
            id: "comedy_staring_distance",
            type: "story",
            name: "Staring Contest!",
            description: "Your Pokemon keeps staring into the distance. What are they looking at?!",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Look where they're looking", outcomes: [
                    { weight: 30, narration: "You see a wild Pokemon! They were tracking it!", effects: { seePokemon: 132 } },
                    { weight: 40, narration: "There's nothing there. They're just being weird.", effects: {} },
                    { weight: 30, narration: "A distant Butterfree. They snap out of it eventually.", effects: {} }
                ]},
                { text: "Pull them along", outcomes: [
                    { weight: 100, narration: "They reluctantly follow, looking back every few steps.", effects: {} }
                ]}
            ]
        },
        {
            id: "comedy_plotting",
            type: "story",
            name: "Plotting Pokemon!",
            description: "Your Pokemon appears to be plotting something. They keep whispering to each other.",
            weight: 5,
            oneTime: false,
            minDay: 4,
            choices: [
                { text: "Ask what's going on", outcomes: [
                    { weight: 40, narration: "They all look at you innocently. Too innocently.", effects: {} },
                    { weight: 30, narration: "They surprise you with berries they gathered! Aww!", effects: { food: 5 } },
                    { weight: 30, narration: "They were planning a coordinated nap. They all fall asleep.", effects: { daysLost: 1 } }
                ]},
                { text: "Let them scheme", outcomes: [
                    { weight: 50, narration: "The plotting leads to nothing. Just Pokemon being Pokemon.", effects: {} },
                    { weight: 50, narration: "They pull off a coordinated foraging run! Impressive!", effects: { food: 8 } }
                ]}
            ]
        },
        {
            id: "comedy_excited_no_reason",
            type: "story",
            name: "Overly Excited!",
            description: "Your Pokemon is extremely excited for absolutely no reason! Bouncing off the walls!",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Channel the energy into travel", outcomes: [
                    { weight: 50, narration: "They run ahead and you make great time!", effects: { daysLost: -1 } },
                    { weight: 30, narration: "They're so hyper they exhaust themselves.", effects: { partyDamage: 1 } },
                    { weight: 20, narration: "The excitement is contagious! Everyone moves faster!", effects: {} }
                ]},
                { text: "Try to calm them down", outcomes: [
                    { weight: 60, narration: "After some food, they settle down.", effects: { food: -2 } },
                    { weight: 40, narration: "Nothing can contain this energy! They crash eventually.", effects: {} }
                ]}
            ]
        },
        {
            id: "comedy_nervous",
            type: "story",
            name: "Nervous Pokemon!",
            description: "Your Pokemon seems nervous about something ahead. They keep looking around anxiously.",
            weight: 6,
            oneTime: false,
            minDay: 3,
            choices: [
                { text: "Scout ahead carefully", outcomes: [
                    { weight: 30, narration: "Good instincts! You spot a hazard and avoid it!", effects: {} },
                    { weight: 40, narration: "Nothing dangerous ahead. Your Pokemon was being paranoid.", effects: {} },
                    { weight: 30, narration: "There IS something ahead — wild Pokemon blocking the path!", effects: { partyDamage: 1 } }
                ]},
                { text: "\"It's fine, let's go\"", outcomes: [
                    { weight: 60, narration: "It was fine. Your Pokemon relaxes eventually.", effects: {} },
                    { weight: 40, narration: "Maybe you should have listened...", effects: { partyDamage: 1 } }
                ]}
            ]
        },
        {
            id: "comedy_hungry",
            type: "story",
            name: "Extremely Hungry!",
            description: "Your Pokemon is EXTREMELY hungry. They're eating everything that isn't nailed down!",
            weight: 7,
            oneTime: false,
            minDay: 2,
            choices: [
                { text: "Feed them extra", outcomes: [
                    { weight: 60, narration: "A satisfied Pokemon! They're happy and energetic!", effects: { food: -5, healOne: true } },
                    { weight: 40, narration: "They eat and eat and eat... there goes a lot of food.", effects: { food: -10 } }
                ]},
                { text: "\"You just ate!\"", outcomes: [
                    { weight: 50, narration: "They grumble but deal with it.", effects: {} },
                    { weight: 50, narration: "They sneak food when you're not looking.", effects: { food: -3 } }
                ]}
            ]
        }
    ];
})();

