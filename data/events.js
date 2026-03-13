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
                        { weight: 50, narration: "Your Pokemon fight bravely and drive Team Rocket away!", effects: { money: 500, xp: 25 }, trackRocket: true },
                        { weight: 30, narration: "A tough fight! You win, but your Pokemon take damage.", effects: { money: 200, partyDamage: 1, xp: 20 }, trackRocket: true },
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
                        { weight: 40, narration: "You find a stash of supplies! Team Rocket will be furious.", effects: { money: 1000, pokeballs: 5, potions: 3, xp: 30 }, trackRocket: true },
                        { weight: 35, narration: "You grab some items but trigger an alarm! Your Pokemon take hits escaping.", effects: { money: 500, pokeballs: 3, partyDamage: 1, xp: 20 }, trackRocket: true },
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
                        { weight: 40, narration: "Your team fights with everything they have and defeats Giovanni! Team Rocket disbands!", effects: { money: 3000, xp: 50 }, trackRocket: true },
                        { weight: 35, narration: "A close battle! You barely win but your team is battered.", effects: { money: 1500, partyDamage: 2, xp: 40 }, trackRocket: true },
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
                        { weight: 60, narration: "Oak gives you some Pokeballs and food. \"Be careful out there!\"", effects: { pokeballs: 5, food: 10, xp: 15 } },
                        { weight: 40, narration: "Oak gives you a rare item! \"You'll need this where you're going.\"", effects: { pokeballs: 3, potions: 2, rareCandy: 1, xp: 20 } }
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
                        { weight: 45, narration: "Your Pokemon outperform Gary's! \"Hmph! I'll beat you next time!\"", effects: { money: 500, xp: 30 } },
                        { weight: 35, narration: "A close match! Gary barely wins. \"I knew I was better!\"", effects: { partyDamage: 1, xp: 10 } },
                        { weight: 20, narration: "Gary's team is surprisingly strong. He takes some of your money.", effects: { partyDamage: 1, money: -200, xp: 10 } }
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
                        { weight: 60, narration: "\"Team Rocket's blasting off again!\" They fly into the sky.", effects: { money: 300, xp: 20 }, trackRocket: true },
                        { weight: 30, narration: "Meowth scratches your Pokemon! But you still win.", effects: { partyDamage: 1, money: 200, xp: 15 }, trackRocket: true },
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
                        { weight: 40, narration: "You fight through Team Rocket and save Silph Co.! The president gives you a Lapras and the Silph Scope!", effects: { catchPokemon: 131, keyItem: "Silph Scope", money: 2000, xp: 40 }, trackRocket: true },
                        { weight: 35, narration: "You rescue the employees but your team takes a beating. You get the Silph Scope!", effects: { partyDamage: 2, keyItem: "Silph Scope", money: 1000, xp: 30 }, trackRocket: true },
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
                        { weight: 40, narration: "You sprint through the falling rocks! Everyone makes it!", effects: { xp: 15 } },
                        { weight: 35, narration: "Rocks hit your team! A Pokemon is injured.", effects: { partyDamage: 1, xp: 10 } },
                        { weight: 25, narration: "A major collapse! Multiple Pokemon are hurt!", effects: { partyDamage: 2, xp: 10 } }
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
                        { weight: 30, narration: "Your Pokemon shield you! But they take damage.", effects: { partyDamage: 2, xp: 15 } },
                        { weight: 40, narration: "A Pokemon gets trampled! Food supplies are scattered!", effects: { partyDamage: 1, food: -10, xp: 10 } },
                        { weight: 30, narration: "One Tauros stops and joins your team in respect!", effects: { partyDamage: 1, catchPokemon: 128, xp: 20 } }
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
            weight: 20,
            oneTime: true,
            locationIds: ["indigo_plateau"],
            choices: [
                {
                    text: "Brave Victory Road!",
                    outcomes: [
                        { weight: 30, narration: "Your team pushes through with determination! Indigo Plateau is in sight!", effects: { partyDamage: 1, xp: 30 } },
                        { weight: 40, narration: "A brutal gauntlet! Your team is battered but standing!", effects: { partyDamage: 2, xp: 25 } },
                        { weight: 20, narration: "The cave nearly claims your team. Everyone is exhausted.", effects: { partyDamage: 3, food: -10, xp: 20 } },
                        { weight: 10, narration: "Incredibly, your team is inspired and powers through unscathed!", effects: { xp: 40 } }
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
            weight: 25,
            oneTime: true,
            locationIds: ["indigo_plateau"],
            minBadges: 4,
            choices: [
                {
                    text: "Challenge the Elite Four!",
                    outcomes: [
                        { weight: 25, narration: "Against all odds, you defeat all four and become CHAMPION! Your name will be remembered forever!", effects: { partyDamage: 2, champion: true, xp: 80 } },
                        { weight: 35, narration: "You defeat Lorelei and Bruno, but Agatha's ghosts overwhelm you. A valiant effort!", effects: { partyDamage: 3, money: 2000, xp: 40 } },
                        { weight: 25, narration: "Lorelei's ice types freeze your team. You're eliminated in the first round.", effects: { partyDamage: 2, money: 1000, xp: 20 } },
                        { weight: 15, narration: "You defeat ALL FOUR and become Champion! Lance himself congratulates you!", effects: { partyDamage: 3, champion: true, money: 5000, xp: 100 } }
                    ]
                },
                {
                    text: "You've made it far enough",
                    outcomes: [
                        { weight: 100, narration: "You decide reaching the Plateau is victory enough. And that's okay.", effects: {} }
                    ]
                }
            ]
        }
    ];
})();
