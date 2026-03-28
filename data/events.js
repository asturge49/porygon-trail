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
                    eventBattle: {
                        pool: "rocket_grunt",
                        difficulty: "medium",
                        trainerName: "Rocket Grunt",
                        winNarration: "You drive Team Rocket away! They scatter like cowards.",
                        lossNarration: "The Rocket Grunt's Pokemon overpowers yours!",
                        winEffects: { money: 500 },
                        lossEffects: { food: -5 }
                    }
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
                    eventBattle: {
                        pool: "rocket_grunt",
                        difficulty: "medium",
                        trainerName: "Rocket Guard",
                        winNarration: "You defeat the guard and raid their supply stash!",
                        lossNarration: "The Rocket Guard catches you sneaking in!",
                        winEffects: { money: 1000, pokeballs: 5, potions: 3 },
                        lossEffects: { food: -10, money: -200 }
                    }
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
                    eventBattle: {
                        pool: "giovanni",
                        difficulty: "hard",
                        trainerName: "Giovanni",
                        winNarration: "You defeat Giovanni! \"Impossible... I, the leader of Team Rocket, defeated by a child?!\" Team Rocket disbands!",
                        lossNarration: "Giovanni's Pokemon is ruthless. \"You're 10 years too early to challenge me.\"",
                        winEffects: { money: 3000 },
                        lossEffects: { money: -1000 }
                    }
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
                    eventBattle: {
                        pool: "gary",
                        difficulty: "medium",
                        trainerName: "Rival Gary",
                        winNarration: "\"Hmph! I'll beat you next time!\" Gary storms off. The battle experience strengthens your team!",
                        lossNarration: "\"I knew I was better! Smell ya later, loser!\" Gary laughs as he walks away.",
                        winEffects: { money: 500, trainPokemon: true },
                        lossEffects: { money: -200 }
                    }
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
                    eventBattle: {
                        pool: "jessie_james",
                        difficulty: "easy",
                        trainerName: "Jessie & James",
                        winNarration: "\"Team Rocket's blasting off agaaaaain!\" ✨ They fly into the sky.",
                        lossNarration: "\"We did it!\" Jessie and James high-five while Meowth raids your bag.",
                        winEffects: { money: 300 },
                        lossEffects: { pokeballs: -2, food: -3 }
                    }
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
            id: "ash_pikachu_challenge",
            type: "legendary",
            name: "Ash's Pikachu!",
            description: "A kid in a red cap grins at you. His Pikachu's cheeks spark with terrifying power. \"I've beaten the Indigo League, y'know! My Pikachu can take on anyone. Wanna try?\"",
            weight: 4,
            oneTime: true,
            locationIds: ["pallet_town"],
            choices: [
                {
                    text: "Challenge Ash's Pikachu!",
                    outcomes: [
                        { weight: 25, narration: "Your Pokemon fights valiantly and somehow overpowers Ash's Pikachu! Ash stares in disbelief. \"Wow... you're the real deal. Pikachu, go with them.\" The battle-hardened Pikachu joins your team — but it has a stubborn streak.", effects: { catchPokemon: 25, partyDamageAll: 1 } },
                        { weight: 35, narration: "Ash's Pikachu is on another level. Thunderbolt after Thunderbolt rains down on your team. You lose badly. Ash helps patch up your Pokemon, but the damage is done.", effects: { partyDamageAll: 2 } },
                        { weight: 25, narration: "Pikachu's Thunder knocks your Pokemon out cold. It doesn't get back up. Ash looks horrified. \"I... I'm sorry. Pikachu doesn't know its own strength.\"", effects: { pokemonDeath: true } },
                        { weight: 15, narration: "A close fight! Your Pokemon holds its own but ultimately falls. Ash is impressed. \"You've got guts. Here, take these.\" He hands you supplies.", effects: { partyDamageAll: 1, potions: 3, food: 10 } }
                    ]
                },
                {
                    text: "\"Maybe another time, Ash.\"",
                    outcomes: [
                        { weight: 100, narration: "Ash shrugs. \"Your loss! Come on, Pikachu!\" They disappear down Route 1, Pikachu riding on his shoulder.", effects: {} }
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
                        { weight: 40, narration: "You brave the storm. It's miserable but you make it through.", effects: { partyDamageAll: 1 } },
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
                        { weight: 30, narration: "A Pokemon collapses from heat. You use extra potions.", effects: { food: -5, partyDamageAll: 1 } },
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
            name: "Fossil Resurrection!",
            description: "Deep in Mt. Moon, you find two ancient fossils embedded in the cave wall — one spiral-shaped, one dome-shaped. A scientist nearby has portable revival equipment, but the process requires enormous energy. \"I can only revive ONE, and it'll drain all your supplies. The other fossil will crumble when removed.\" This is a permanent choice.",
            weight: 6,
            oneTime: true,
            locationIds: ["mt_moon"],
            choices: [
                {
                    text: "Revive Omanyte (Helix Fossil) — costs 20 food",
                    outcomes: [
                        { weight: 100, narration: "The machine whirs to life. The Helix Fossil glows, cracks, and an Omanyte blinks up at you. The Dome Fossil crumbles to dust. It cost you dearly, but you have a living fossil.", effects: { food: -20, catchPokemon: 138 } }
                    ]
                },
                {
                    text: "Revive Kabuto (Dome Fossil) — costs 20 food",
                    outcomes: [
                        { weight: 100, narration: "The machine hums with power. The Dome Fossil splits open and Kabuto skitters out, alive after millions of years. The Helix Fossil turns to powder. A heavy price for a miracle.", effects: { food: -20, catchPokemon: 140 } }
                    ]
                },
                {
                    text: "Leave the fossils alone",
                    outcomes: [
                        { weight: 100, narration: "You can't afford to lose those supplies. The fossils remain embedded in the cave wall, waiting for another trainer.", effects: {} }
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
                        { weight: 30, narration: "As you grab it, Clefairy appear and attack! But you keep the stone.", effects: { rareCandy: 1, partyDamageAll: 1 } }
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
                        { weight: 40, narration: "The ghost wails and your Pokemon are frightened!", effects: { partyDamageAll: 1 } },
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
                        { weight: 35, narration: "You rescue the employees but your team takes a beating. You get the Silph Scope!", effects: { partyDamageAll: 2, keyItem: "Silph Scope", money: 1000 }, trackRocket: true },
                        { weight: 25, narration: "Team Rocket is too strong! You retreat with minor injuries.", effects: { partyDamageAll: 1 } }
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
                        { weight: 50, narration: "The heat is unbearable! A Pokemon is burned!", effects: { partyDamageAll: 1, seePokemon: 146 } },
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
                        { weight: 50, narration: "Mewtwo psychically destroys the ball! Your team takes massive damage!", effects: { ultraballs: -1, partyDamageAll: 3 } },
                        { weight: 40, narration: "Mewtwo swats the ball away and teleports. Your team is shaken.", effects: { ultraballs: -1, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Retreat immediately",
                    outcomes: [
                        { weight: 80, narration: "Wisdom prevails. You leave the cave unharmed.", effects: { seePokemon: 150 } },
                        { weight: 20, narration: "As you turn, a psychic blast hits your team!", effects: { partyDamageAll: 1, seePokemon: 150 } }
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
                        { weight: 35, narration: "Rocks hit your team! A Pokemon is injured.", effects: { partyDamageAll: 1 } },
                        { weight: 25, narration: "A major collapse! Multiple Pokemon are hurt!", effects: { partyDamageAll: 2 } }
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
                        { weight: 30, narration: "Your Pokemon shield you! But they take damage.", effects: { partyDamageAll: 2 } },
                        { weight: 40, narration: "A Pokemon gets trampled! Food supplies are scattered!", effects: { partyDamageAll: 1, food: -10 } },
                        { weight: 30, narration: "One Tauros stops and joins your team in respect!", effects: { partyDamageAll: 1, catchPokemon: 128 } }
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
                        { weight: 30, narration: "A wild Grimer attacks as you pass!", effects: { partyDamageAll: 1 } }
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
                        { weight: 40, narration: "The current is brutal! A Pokemon is swept away... but returns safely.", effects: { partyDamageAll: 1 } },
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
                        { weight: 30, narration: "Your team pushes through with determination! Indigo Plateau is in sight!", effects: { partyDamageAll: 1 } },
                        { weight: 40, narration: "A brutal gauntlet! Your team is battered but standing!", effects: { partyDamageAll: 2 } },
                        { weight: 20, narration: "The cave nearly claims your team. Everyone is exhausted.", effects: { partyDamageAll: 3, food: -10 } },
                        { weight: 10, narration: "Incredibly, your team is inspired and powers through unscathed!", effects: {} }
                    ]
                },
                {
                    text: "Use Escape Rope if things go bad",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 50, narration: "You make it through with minimal damage!", effects: { partyDamageAll: 1 } },
                        { weight: 50, narration: "Things get bad — you use the rope but still take damage.", effects: { escapeRope: -1, partyDamageAll: 1 } }
                    ]
                }
            ]
        },
        // Elite Four is now handled by the dedicated ELITEFOUR screen

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
                        { weight: 40, narration: "You escape but one of your Pokemon is stung badly and doesn't make it...", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 40, narration: "The swarm is relentless! Your team takes heavy damage.", effects: { partyDamageAll: 2 } },
                        { weight: 20, narration: "You sprint through the forest and barely escape!", effects: { partyDamageAll: 1 } }
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
                        { weight: 35, narration: "The avalanche buries one of your Pokemon under tons of rock... they're gone.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 35, narration: "Your team is battered by rocks and snow. Everyone is hurt badly.", effects: { partyDamageAll: 2 } },
                        { weight: 30, narration: "You find shelter behind a boulder just in time!", effects: { partyDamageAll: 1 } }
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
                        { weight: 30, narration: "Everyone fights the current. Your supplies are scattered!", effects: { partyDamageAll: 1, food: -15, pokeballs: -3 } },
                        { weight: 30, narration: "You narrowly escape the edge of the whirlpool!", effects: { partyDamageAll: 1 } }
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
                        { weight: 35, narration: "Everyone is poisoned! You need medicine fast!", effects: { partyDamageAll: 1, statusRandom: "poisoned" } },
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
                        { weight: 40, narration: "A lava flow cuts off one of your Pokemon... there's nothing you can do.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 30, narration: "The heat is unbearable! Your team suffers burns!", effects: { partyDamageAll: 2 } },
                        { weight: 30, narration: "You outrun the lava flow! Close call!", effects: { partyDamageAll: 1 } }
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
                        { weight: 30, narration: "The curse weakens your team! Everyone feels drained.", effects: { partyDamageAll: 2 } },
                        { weight: 30, narration: "Your Pokemon resist the curse! The ghost wails and vanishes.", effects: { partyDamageAll: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Psychic-type shields the team! The ghost is banished!", effects: {} }
                },
                {
                    text: "Flee the tower!",
                    outcomes: [
                        { weight: 70, narration: "You run from Pokemon Tower as fast as you can!", effects: {} },
                        { weight: 30, narration: "The ghost follows you! One Pokemon is cursed!", effects: { partyDamageAll: 1 } }
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
                    eventBattle: {
                        pool: "rocket_grunt",
                        difficulty: "hard",
                        trainerName: "Rocket Elite",
                        winNarration: "Your Pokemon fights with everything it has and drives the elite squad off! They scatter.",
                        lossNarration: "The Rocket Elite's Pokemon is ruthless. Your Pokemon crumbles under the assault.",
                        winEffects: { money: 1000 },
                        lossEffects: { money: -500 }
                    }
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
                        { weight: 40, narration: "Severe food poisoning! Everyone is sick for days.", effects: { partyDamageAll: 1, daysLost: 2 } },
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
                        { weight: 40, narration: "Everyone makes it, but barely. That was terrifying.", effects: { partyDamageAll: 1 } },
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
                        { weight: 20, narration: "The camp is booby-trapped! Team Rocket!", effects: { partyDamageAll: 1 } }
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
                    eventBattle: {
                        pool: "trainer",
                        difficulty: "easy",
                        trainerName: "Trainer",
                        winNarration: "Your Pokemon wins! The trainer pays up and shares some tips.",
                        lossNarration: "Their Pokemon was tougher than expected. \"Good fight though!\"",
                        winEffects: { money: 500, trainPokemon: true },
                        lossEffects: { money: -200 }
                    }
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
                        { weight: 40, narration: "Your Pokemon takes a hit defending you!", effects: { partyDamageAll: 1 } },
                        { weight: 30, narration: "A nasty scratch! But you drive it off.", effects: { partyDamageAll: 1, food: -3 } },
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
                        { weight: 40, narration: "The sand tears at your team! A Pokemon is badly hurt!", effects: { partyDamageAll: 1, food: -5 } },
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
                        { weight: 35, narration: "Falling debris hits your team! Everyone takes damage!", effects: { partyDamageAll: 2, food: -10 } },
                        { weight: 30, narration: "The shaking stops. You're rattled but okay.", effects: { partyDamageAll: 1 } }
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
                        { weight: 35, narration: "Frostbite! Your team is badly hurt by the cold!", effects: { partyDamageAll: 2, food: -10 } },
                        { weight: 35, narration: "You push through! Cold and hungry, but alive.", effects: { partyDamageAll: 1, food: -5 } }
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
                        { weight: 30, narration: "Ghost Pokemon torment your team all night! Everyone is exhausted.", effects: { partyDamageAll: 1, daysLost: 1 } },
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
                    { weight: 50, narration: "You barely escape the toxic cloud!", effects: { partyDamageAll: 1 } }
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
                    { weight: 60, narration: "You drive the Fearow away, but your team is shaken.", effects: { partyDamageAll: 1 } }
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
                    { weight: 55, narration: "Everyone makes it through coughing and wheezing!", effects: { partyDamageAll: 1 } }
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
                    { weight: 50, narration: "You free your Pokemon just in time!", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "Your Pokemon recovers after a rough night.", effects: { partyDamageAll: 1, daysLost: 1 } },
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
                    { weight: 40, narration: "Your team fights bravely through the swarm!", effects: { partyDamageAll: 2 } },
                    { weight: 20, narration: "You scatter the swarm and find some dropped items!", effects: { partyDamageAll: 1, potions: 1 } }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 90, narration: "The Repel drives the Beedrill away!", effects: { repels: -1 } },
                    { weight: 10, narration: "The swarm is too large for the Repel to handle!", effects: { repels: -1, partyDamageAll: 1 } }
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
                    { weight: 40, narration: "You find your Pokemon scared but alive!", effects: { daysLost: 1, partyDamageAll: 1 } },
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
                    { weight: 60, narration: "You find shelter just in time! Rocks crash around you.", effects: { partyDamageAll: 1 } }
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
                    { weight: 50, narration: "You catch your Pokemon just before they fall!", effects: { partyDamageAll: 1 } },
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
                    { weight: 20, narration: "Your team impresses the Onix! It calms down.", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Flee immediately", outcomes: [
                    { weight: 70, narration: "You escape the rampaging Onix!", effects: {} },
                    { weight: 30, narration: "The Onix blocks your escape route!", effects: { partyDamageAll: 1, daysLost: 1 } }
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
                    { weight: 55, narration: "You pull your Pokemon out just as a Graveler explodes!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Wait for it to end", outcomes: [
                    { weight: 60, narration: "The brawl settles down. Your Pokemon is bruised but okay.", effects: { partyDamageAll: 1 } },
                    { weight: 40, narration: "A stray Self-Destruct hits your team!", effects: { partyDamageAll: 2 } }
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
                    { weight: 50, narration: "You grab your Pokemon just in time!", effects: { partyDamageAll: 1 } },
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
                    { weight: 20, narration: "Your team's courage impresses the Gyarados. It retreats!", effects: { partyDamageAll: 1 } }
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
                    { weight: 55, narration: "You pull them out covered in stings but alive!", effects: { partyDamageAll: 1 } }
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
                    { weight: 60, narration: "Everyone holds on! Bruised but alive.", effects: { partyDamageAll: 2 } }
                ]},
                { text: "Swim for calmer water", outcomes: [
                    { weight: 50, narration: "You reach calmer waters safely!", effects: { partyDamageAll: 1 } },
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
                    { weight: 40, narration: "Everyone makes it through battered and exhausted!", effects: { partyDamageAll: 2, food: -5 } },
                    { weight: 20, narration: "The storm passes quickly. You're okay!", effects: { partyDamageAll: 1 } }
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
                    { weight: 45, narration: "You endure the hurricane! Your team is beaten but alive.", effects: { partyDamageAll: 2, food: -5 } },
                    { weight: 20, narration: "The Dragonite flies off. The winds calm.", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Try to befriend it", outcomes: [
                    { weight: 20, narration: "The Dragonite is impressed by your courage and calms down!", effects: { seePokemon: 149 } },
                    { weight: 80, narration: "The Dragonite ignores you and the winds intensify!", effects: { partyDamageAll: 2 } }
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
                    { weight: 65, narration: "Your team pushes through the swarm!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 95, narration: "The Repel disperses the Zubat swarm!", effects: { repels: -1 } },
                    { weight: 5, narration: "There are too many! The Repel barely helps!", effects: { repels: -1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "Everyone makes it out as the cave collapses behind you!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Take shelter in an alcove", outcomes: [
                    { weight: 60, narration: "The alcove holds! You wait out the collapse.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The alcove crumbles too. Your team takes hits!", effects: { partyDamageAll: 2 } }
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
                    { weight: 55, narration: "You recall your Pokemon just in time! They're weak but alive.", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 85, narration: "The Repel drives the Golbat back to their roost!", effects: { repels: -1 } },
                    { weight: 15, narration: "The Golbat are too enraged! The Repel only partly works.", effects: { repels: -1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "Rocks rain down but everyone dodges!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You rappel to safety through a side tunnel!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The tunnel collapses before you can escape fully!", effects: { escapeRope: -1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "The Tauros thunder over you! Everyone survives!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Try to divert them", outcomes: [
                    { weight: 30, narration: "You successfully redirect the herd!", effects: {} },
                    { weight: 70, narration: "Nothing can stop a Tauros stampede! Your team takes hits!", effects: { partyDamageAll: 2 } }
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
                    { weight: 45, narration: "You drive the Arbok away but it left a nasty bite!", effects: { partyDamageAll: 1 } },
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
                    { weight: 60, narration: "Your Pokemon recovers after being violently sick.", effects: { partyDamageAll: 1 } },
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
                    { weight: 40, narration: "Your team drives the Nidoking back!", effects: { partyDamageAll: 2 } },
                    { weight: 20, narration: "The Nidoking decides you're not worth the fight.", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Abandon camp and flee", outcomes: [
                    { weight: 60, narration: "You flee! The Nidoking destroys your camp supplies.", effects: { food: -15 } },
                    { weight: 40, narration: "The Nidoking chases you! Everyone takes hits!", effects: { partyDamageAll: 1, food: -5 } }
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
                    { weight: 30, narration: "It pounces as you turn your back!", effects: { partyDamageAll: 1 } }
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
                    { weight: 60, narration: "Everyone leaps clear as the ground cracks!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Run from the area", outcomes: [
                    { weight: 50, narration: "You escape the volcanic zone!", effects: { daysLost: 1 } },
                    { weight: 50, narration: "The tremors chase you! Your team takes damage fleeing.", effects: { partyDamageAll: 2 } }
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
                    { weight: 50, narration: "Your Pokemon recovers after resting in the shade.", effects: { daysLost: 1, partyDamageAll: 1 } },
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
                    { weight: 55, narration: "You shield your team from the worst of it!", effects: { partyDamageAll: 2 } }
                ]},
                { text: "Evacuate immediately", outcomes: [
                    { weight: 60, narration: "You flee the volcanic zone!", effects: { food: -5, daysLost: 1 } },
                    { weight: 40, narration: "Lava blocks your escape route! Your team takes burns!", effects: { partyDamageAll: 2 } }
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
                    { weight: 55, narration: "You yank them away just as the edge crumbles!", effects: { partyDamageAll: 1 } }
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
                    { weight: 60, narration: "You burst through the flames singed but alive!", effects: { partyDamageAll: 2, food: -5 } }
                ]},
                { text: "Take cover and wait", outcomes: [
                    { weight: 50, narration: "The firestorm passes. Your camp is destroyed but everyone's okay.", effects: { food: -10, daysLost: 1 } },
                    { weight: 50, narration: "The fire spreads to your shelter!", effects: { partyDamageAll: 2, food: -10 } }
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
                    { weight: 55, narration: "You perform a cleansing ritual and free your Pokemon!", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "You find your Pokemon in a trance but snap them out of it!", effects: { partyDamageAll: 1 } },
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
                    { weight: 55, narration: "You catch up and calm your terrified Pokemon.", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Call out to them", outcomes: [
                    { weight: 50, narration: "Your Pokemon hears your voice and comes back trembling.", effects: { partyDamageAll: 1 } },
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
                    { weight: 55, narration: "Your team's combined strength drives the shadow away!", effects: { partyDamageAll: 1 } }
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
                    { weight: 60, narration: "You block most of the flying debris!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Run from the tower!", outcomes: [
                    { weight: 70, narration: "You escape the poltergeist's range!", effects: {} },
                    { weight: 30, narration: "The poltergeist follows you outside! Debris strikes your team!", effects: { partyDamageAll: 2 } }
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
                    { weight: 65, narration: "The lightning misses! Everyone is shaken but alive.", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Lie flat on the ground", outcomes: [
                    { weight: 70, narration: "The lightning passes overhead. Smart thinking!", effects: {} },
                    { weight: 30, narration: "Ground current zaps your team!", effects: { partyDamageAll: 2 } }
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
                    { weight: 50, narration: "Rest helps, but your Pokemon is still weak.", effects: { daysLost: 1, partyDamageAll: 1 } },
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
                    { weight: 40, narration: "After a rough night, your Pokemon recovers.", effects: { daysLost: 1, partyDamageAll: 1 } },
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
                    { weight: 50, narration: "Everyone goes hungry but survives.", effects: { food: -10, partyDamageAll: 1 } },
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
                    { weight: 30, narration: "Your Pokemon fights off the illness on their own!", effects: { partyDamageAll: 1 } },
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
                    { weight: 65, narration: "You gather everyone back together by morning.", effects: { daysLost: 1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "You catch them and rescue your Pokemon!", effects: { partyDamageAll: 1 } }
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
                    { weight: 55, narration: "You carefully disarm the trap and free your Pokemon!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Use Escape Rope", requiresItem: "escapeRope", outcomes: [
                    { weight: 85, narration: "You use the rope to safely trigger and disable the trap!", effects: { escapeRope: -1 } },
                    { weight: 15, narration: "The trap was more complex than expected.", effects: { escapeRope: -1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "You absorb the blast! Your team is hurt but alive.", effects: { partyDamageAll: 2 } }
                ]},
                { text: "Flee the lab!", outcomes: [
                    { weight: 50, narration: "You escape before the explosion!", effects: {} },
                    { weight: 50, narration: "The explosion catches your team as you flee!", effects: { partyDamageAll: 2 } }
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
                    { weight: 40, narration: "You rescue your Pokemon from a cage!", effects: { partyDamageAll: 1 } },
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
                    { weight: 60, narration: "The storm passes. Everyone survived the electric onslaught!", effects: { partyDamageAll: 2, seePokemon: 145 } }
                ]},
                { text: "Take shelter!", outcomes: [
                    { weight: 60, narration: "You find cover as Zapdos soars overhead!", effects: { seePokemon: 145 } },
                    { weight: 40, narration: "Lightning destroys your shelter!", effects: { partyDamageAll: 2, food: -5, seePokemon: 145 } }
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
                    { weight: 60, narration: "Everyone survives the freezing winds!", effects: { partyDamageAll: 2, seePokemon: 144 } }
                ]},
                { text: "Find a cave!", outcomes: [
                    { weight: 60, narration: "You find shelter from the blizzard!", effects: { daysLost: 1, seePokemon: 144 } },
                    { weight: 40, narration: "The cave is frozen too. It's bitter cold.", effects: { daysLost: 1, partyDamageAll: 1, seePokemon: 144 } }
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
                    { weight: 60, narration: "Moltres soars away. Your team is scorched but alive!", effects: { partyDamageAll: 2, seePokemon: 146 } }
                ]},
                { text: "Dive into water!", outcomes: [
                    { weight: 70, narration: "The water protects you from the worst of the flames!", effects: { partyDamageAll: 1, seePokemon: 146 } },
                    { weight: 30, narration: "The water itself starts to boil!", effects: { partyDamageAll: 2, seePokemon: 146 } }
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
                    { weight: 60, narration: "The shockwave passes. Everyone is dazed but alive.", effects: { partyDamageAll: 2, seePokemon: 150 } }
                ]},
                { text: "Flee immediately!", outcomes: [
                    { weight: 50, narration: "You escape Mewtwo's range!", effects: { seePokemon: 150 } },
                    { weight: 50, narration: "You can't outrun a psychic attack!", effects: { partyDamageAll: 2, seePokemon: 150 } }
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
                    { weight: 65, narration: "The light fades. Your team is shaken but okay. What was that?!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "Reach out to it", outcomes: [
                    { weight: 20, narration: "The Pokemon seems to acknowledge you... then vanishes. Your team feels energized!", effects: { healAll: true } },
                    { weight: 80, narration: "The energy is too intense! Your team takes damage.", effects: { partyDamageAll: 2 } }
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
                    { weight: 15, narration: "Even the Potion can't fix this level of gluttony. Your Pokemon is very sick.", effects: { potions: -1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "You drag your battered Pokemon away from the fight!", effects: { partyDamageAll: 1 } }
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
                    { weight: 50, narration: "You peer over the edge... they're on a ledge below, scared but alive!", effects: { partyDamageAll: 1 } },
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
                    { weight: 30, narration: "A Voltorb! It Self-Destructs!", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "Your Pokemon defeats it! Impressed, it joins you!", effects: { catchPokemon: 66, partyDamageAll: 1 } },
                    { weight: 40, narration: "A tough fight! It retreats with respect.", effects: { partyDamageAll: 1 } },
                    { weight: 20, narration: "Your team is overpowered!", effects: { partyDamage: 2 } }
                ]},
                { text: "Throw a Pokeball mid-roar!", requiresItem: "pokeballs", outcomes: [
                    { weight: 40, narration: "Caught while its guard was down!", effects: { pokeballs: -1, catchPokemon: 56 } },
                    { weight: 60, narration: "It swats the ball away angrily!", effects: { pokeballs: -1, partyDamageAll: 1 } }
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
                    { weight: 10, narration: "It was a trap! Team Rocket ambushes you!", effects: { partyDamageAll: 1, money: -200 } }
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
                    { weight: 20, narration: "Good instinct! A Voltorb was hiding among them!", effects: { partyDamageAll: 1, pokeballs: 2 } }
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
                    { weight: 10, narration: "Some berries were toxic! One Pokemon gets sick.", effects: { food: 5, partyDamageAll: 1 } }
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
                    { weight: 10, narration: "They share food but their fire attracted wild Pokemon!", effects: { food: 5, partyDamageAll: 1 } }
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
                    { weight: 20, narration: "A wild Pokemon was nesting inside! It attacks!", effects: { partyDamageAll: 1 } },
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
                    { weight: 20, narration: "Ghost Pokemon haunt the ruins! Your team is spooked!", effects: { partyDamageAll: 1 } },
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
                    { weight: 20, narration: "Wild Pokemon attack in the darkness!", effects: { partyDamageAll: 1 } },
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
                    { weight: 30, narration: "Mining disturbs wild Pokemon! They attack!", effects: { partyDamageAll: 1, money: 300 } }
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
                    { weight: 30, narration: "Strange shapes in the fog — Ghost Pokemon swirl around you!", effects: { partyDamageAll: 1 } }
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
                    { weight: 20, narration: "An escaped lab Pokemon attacks!", effects: { partyDamageAll: 1 } },
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
                    { weight: 40, narration: "Brock's Onix is tough but you win! He rewards you.", effects: { money: 500, partyDamageAll: 1 } },
                    { weight: 60, narration: "Brock's rock-solid defense beats you. Good practice though!", effects: { partyDamageAll: 1 } }
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
                { text: "\"You're Team Rocket!\"",
                    eventBattle: {
                        pool: "jessie_james",
                        difficulty: "easy",
                        trainerName: "Disguised Rocket",
                        winNarration: "\"How did you know?!\" They drop everything and blast off!",
                        lossNarration: "\"Ha! Even in disguise we're strong!\" They grab some supplies and flee.",
                        winEffects: { money: 300, pokeballs: 2 },
                        lossEffects: { food: -5 }
                    }
                },
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
                { text: "Challenge them instead",
                    eventBattle: {
                        pool: "trainer",
                        difficulty: "easy",
                        trainerName: "Wandering Trainer",
                        winNarration: "You win! The intense battle strengthens your Pokemon!",
                        lossNarration: "They're tougher than they look. \"Keep training, kid!\"",
                        winEffects: { money: 400, trainPokemon: true },
                        lossEffects: { money: -100 }
                    }
                }
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
                    { weight: 50, narration: "Should have listened to the Ranger.", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "Their Beedrill put up a surprising fight!", effects: { money: 300, partyDamageAll: 1 } }
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
                { text: "Battle your rival!",
                    eventBattle: {
                        pool: "gary",
                        difficulty: "medium",
                        trainerName: "Rival",
                        winNarration: "\"Smell ya later!\" Your rival storms off. The fierce battle makes your team stronger!",
                        lossNarration: "\"Is that the best you've got?!\" Your rival laughs and walks away.",
                        winEffects: { money: 800, trainPokemon: true },
                        lossEffects: { money: -300 }
                    }
                },
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
                { text: "\"Not you two again...\"",
                    eventBattle: {
                        pool: "jessie_james",
                        difficulty: "easy",
                        trainerName: "Jessie & James",
                        winNarration: "\"We're blasting off agaaaaain!\" ✨ They drop some items as they fly away.",
                        lossNarration: "\"We actually won?!\" Jessie and James are as surprised as you are. They grab some supplies and run.",
                        winEffects: { pokeballs: 2, money: 200 },
                        lossEffects: { food: -5, pokeballs: -2 }
                    }
                },
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
                    { weight: 40, narration: "You slog through the storm and lose a day.", effects: { daysLost: 1, partyDamageAll: 1 } },
                    { weight: 60, narration: "The storm passes quicker than expected!", effects: { partyDamageAll: 1 } }
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
                    { weight: 30, narration: "They attack at dawn! Quick battle!", effects: { partyDamageAll: 1 } },
                    { weight: 20, narration: "They lose interest and wander away.", effects: {} }
                ]},
                { text: "Use a Repel", requiresItem: "repels", outcomes: [
                    { weight: 90, narration: "The Repel keeps them away all night!", effects: { repels: -1 } },
                    { weight: 10, narration: "The Repel wears off at dawn. They charge!", effects: { repels: -1, partyDamageAll: 1 } }
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
                    { weight: 40, narration: "A rough shortcut, but you rejoin the trail!", effects: { partyDamageAll: 1 } },
                    { weight: 60, narration: "The wilderness is harsh. Your team suffers.", effects: { partyDamageAll: 1, food: -5 } }
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
                    { weight: 20, narration: "Tricky climb but you make it over!", effects: { escapeRope: -1, partyDamageAll: 1 } }
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
                    { weight: 60, narration: "The makeshift bridge holds just long enough!", effects: { partyDamageAll: 1 } }
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
                    { weight: 70, narration: "Your Pokemon get sick from the contaminated food.", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "You drive them off but they got some food!", effects: { food: -5, partyDamageAll: 1 } },
                    { weight: 40, narration: "You protect everything! Your team stands guard.", effects: { partyDamageAll: 1 } },
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
                    { weight: 40, narration: "You make it through but everyone is battered.", effects: { partyDamageAll: 2 } },
                    { weight: 60, narration: "The storm weakens and you pass through.", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "The current is strong! Your team struggles!", effects: { partyDamageAll: 1, food: -3 } },
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
                    { weight: 40, narration: "Your team battles bravely and drives them away!", effects: { partyDamageAll: 1 } },
                    { weight: 40, narration: "A tough fight from all angles!", effects: { partyDamageAll: 2 } },
                    { weight: 20, narration: "You scatter the ambush and find one wants to join you!", effects: { partyDamageAll: 1, catchPokemon: 23 } }
                ]},
                { text: "Use a Repel to escape", requiresItem: "repels", outcomes: [
                    { weight: 80, narration: "The Repel creates a path through the wild Pokemon!", effects: { repels: -1 } },
                    { weight: 20, narration: "Too many to repel! You still take some hits.", effects: { repels: -1, partyDamageAll: 1 } }
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
                    { weight: 30, narration: "A close call — rocks crumble but everyone makes it!", effects: { partyDamageAll: 1 } },
                    { weight: 20, narration: "Part of the path gives way!", effects: { partyDamageAll: 2 } }
                ]},
                { text: "Use Escape Rope for safety", requiresItem: "escapeRope", outcomes: [
                    { weight: 90, narration: "You use the rope as a safety line. Everyone crosses!", effects: { escapeRope: -1 } },
                    { weight: 10, narration: "The rope helps but the path is still treacherous.", effects: { escapeRope: -1, partyDamageAll: 1 } }
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
                    { weight: 30, narration: "A section collapses but everyone jumps clear!", effects: { partyDamageAll: 1 } },
                    { weight: 20, narration: "The whole area gives way! Rough tumble!", effects: { partyDamageAll: 2 } }
                ]},
                { text: "Find a way around", outcomes: [
                    { weight: 60, narration: "A longer route but much safer.", effects: { daysLost: 1 } },
                    { weight: 40, narration: "The detour has its own hazards.", effects: { partyDamageAll: 1 } }
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
                    { weight: 30, narration: "It's a wild Pokemon! It attacks!", effects: { partyDamageAll: 1 } },
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
                    { weight: 30, narration: "You glimpse Zapdos at the storm's center! Awe-inspiring!", effects: { seePokemon: 145, partyDamageAll: 1 } },
                    { weight: 70, narration: "The storm is too dangerous to approach. You take shelter.", effects: { daysLost: 1 } }
                ]},
                { text: "Take cover immediately", outcomes: [
                    { weight: 70, narration: "You shelter until the unnatural storm passes.", effects: { daysLost: 1 } },
                    { weight: 30, narration: "Even in shelter, the storm's power is felt!", effects: { partyDamageAll: 1 } }
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
                    { weight: 70, narration: "The cold is unbearable. Your team shivers and presses on.", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "Wild Pokemon in the area are spooked and aggressive!", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "The wave passes. Your team is dazed but okay.", effects: { partyDamageAll: 1 } },
                    { weight: 30, narration: "The psychic energy actually strengthens your bond!", effects: { healOne: true } },
                    { weight: 30, narration: "You glimpse a vision of Mewtwo's cave!", effects: { seePokemon: 150, partyDamageAll: 1 } }
                ]},
                { text: "Take shelter", outcomes: [
                    { weight: 60, narration: "You shield your team from the worst of it.", effects: {} },
                    { weight: 40, narration: "The psychic power penetrates even shelter.", effects: { partyDamageAll: 1 } }
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
                    { weight: 30, narration: "The residual heat is dangerous! Pokemon get burned!", effects: { partyDamageAll: 1 } }
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
                    { weight: 30, narration: "The energy is too intense! Your team is knocked back!", effects: { partyDamageAll: 1 } }
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
                    { weight: 40, narration: "The storm unleashes fury but passes quickly!", effects: { partyDamageAll: 1 } },
                    { weight: 30, narration: "Lightning strikes reveal a nearby supply cache!", effects: { partyDamageAll: 1, potions: 2, money: 300 } },
                    { weight: 30, narration: "The storm scatters some of your supplies!", effects: { food: -5 } }
                ]},
                { text: "Run for cover!", outcomes: [
                    { weight: 60, narration: "You find shelter just in time!", effects: {} },
                    { weight: 40, narration: "Can't outrun this storm!", effects: { partyDamageAll: 1 } }
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
                    { weight: 50, narration: "The sulking is contagious. Everyone's moody now.", effects: { partyDamageAll: 1 } }
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
                    { weight: 30, narration: "They're so hyper they exhaust themselves.", effects: { partyDamageAll: 1 } },
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
                    { weight: 30, narration: "There IS something ahead — wild Pokemon blocking the path!", effects: { partyDamageAll: 1 } }
                ]},
                { text: "\"It's fine, let's go\"", outcomes: [
                    { weight: 60, narration: "It was fine. Your Pokemon relaxes eventually.", effects: {} },
                    { weight: 40, narration: "Maybe you should have listened...", effects: { partyDamageAll: 1 } }
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
        },

        // ===== SCRIPTED SPECIAL ENCOUNTERS =====

        // #3 - Cubone's Mother (Lavender Town)
        {
            id: "cubone_mother",
            type: "story",
            name: "The Ghost of Marowak!",
            description: "The top floor of Pokemon Tower is ice cold. A spectral Marowak materializes, bone raised, blocking the stairway. Behind her, a small Cubone whimpers. She died protecting her child from Team Rocket. She won't let anyone pass — dead or alive.",
            weight: 8,
            oneTime: true,
            locationIds: ["lavender_town"],
            choices: [
                {
                    text: "Fight through the ghost",
                    outcomes: [
                        { weight: 35, narration: "Your Pokemon battles the spectral Marowak. It's brutal — she fights with the fury of a mother. Your Pokemon is badly hurt, but the ghost finally fades. The Cubone looks at you with wide, tearful eyes... and follows you. It has no one else.", effects: { partyDamage: 2, catchPokemon: 104 } },
                        { weight: 35, narration: "The ghost Marowak is relentless. Your Pokemon takes devastating hits. One doesn't survive the onslaught. But the ghost finally finds peace, and the orphaned Cubone joins you.", effects: { pokemonDeath: true, catchPokemon: 104 } },
                        { weight: 30, narration: "Marowak's ghost is too powerful. Your team is battered and you're forced to retreat. The Cubone watches you go.", effects: { partyDamage: 3 } }
                    ]
                },
                {
                    text: "Leave them in peace",
                    outcomes: [
                        { weight: 100, narration: "You bow your head and back away slowly. Some bonds shouldn't be broken. The ghost cradles her child as you descend the tower. You feel... lighter, somehow.", effects: { healOne: true } }
                    ]
                }
            ]
        },

        // #4 - Game Corner Porygon (Celadon City)
        {
            id: "game_corner_porygon",
            type: "special",
            name: "Shady Porygon Deal!",
            description: "In the back room of the Celadon Game Corner, a Rocket grunt pulls you aside. \"Psst. I got something special. A Porygon — digital Pokemon, one of a kind. But nothing's free, kid. I want $1500 AND one of your Pokemon. A trade's a trade.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["celadon_city"],
            choices: [
                {
                    text: "Pay $1500 and trade a Pokemon",
                    requiresMoney: 1500,
                    requiresPartySize: 2,
                    outcomes: [
                        { weight: 70, narration: "The grunt snatches your money and takes one of your Pokemon. He slides a Poke Ball across the table. Inside, a Porygon hums with digital energy. The deal stings, but Porygon is genuinely remarkable.", effects: { money: -1500, pokemonDeath: true, catchPokemon: 137 } },
                        { weight: 30, narration: "You hand over the cash and a Pokemon. The grunt grins — then the Porygon's ball clicks open. It's real, and it's powerful. But as you leave, you can't shake the guilt of what you traded away.", effects: { money: -1500, pokemonDeath: true, catchPokemon: 137 } }
                    ]
                },
                {
                    text: "\"I don't deal with Rockets.\"",
                    outcomes: [
                        { weight: 70, narration: "\"Your loss, kid.\" The grunt melts back into the shadows. You leave the Game Corner with your conscience and your team intact.", effects: {} },
                        { weight: 30, narration: "The grunt doesn't take rejection well. \"Nobody says no to us.\" You're shoved out and lose some cash in the scuffle.", effects: { money: -200 } }
                    ]
                }
            ]
        },

        // #5 - Eevee's Burden (Celadon City)
        {
            id: "eevee_rooftop",
            type: "story",
            name: "Abandoned Eevee!",
            description: "On the rooftop of the Celadon Mansion, you find a small Eevee shivering in a cardboard box. It's been abandoned — malnourished, sick, barely clinging to life. Its eyes meet yours. It needs help desperately, but nursing it back to health will drain your supplies.",
            weight: 6,
            oneTime: true,
            locationIds: ["celadon_city"],
            choices: [
                {
                    text: "Take Eevee in",
                    outcomes: [
                        { weight: 60, narration: "You scoop up the trembling Eevee and use your potions to stabilize it. It's weak — barely standing — but alive. It nuzzles into your arms. This one's going to need a lot of care.", effects: { catchPokemon: 133, potions: -2 } },
                        { weight: 40, narration: "You don't have enough potions, so you share your food instead. A lot of it. Eevee slowly recovers enough to stand and follows you, wobbly but determined. It'll be a burden for now.", effects: { catchPokemon: 133, food: -15 } }
                    ]
                },
                {
                    text: "You can't afford another mouth to feed",
                    outcomes: [
                        { weight: 100, narration: "You close the box gently and walk away. The sound of Eevee's cries follows you down the stairs. Sometimes survival means making choices that haunt you.", effects: {} }
                    ]
                }
            ]
        },

        // #6 - Mew Apparition (Anywhere)
        {
            id: "mew_apparition",
            type: "legendary",
            name: "Mew!",
            description: "The air shimmers. A pink, cat-like Pokemon materializes out of thin air, floating inches from your face. It giggles — actually giggles — and does a backflip. This is Mew. The original. The mythical ancestor of all Pokemon. You have one shot.",
            weight: 1,
            oneTime: true,
            minDay: 10,
            choices: [
                {
                    text: "Throw your best ball!",
                    requiresItem: "ultraballs",
                    outcomes: [
                        { weight: 5, narration: "The Ultra Ball connects. Mew looks at it curiously... and lets itself be caught. It CHOSE you. The ball clicks shut and glows with ancient power. You just caught a god.", effects: { ultraballs: -1, catchPokemon: 151 } },
                        { weight: 55, narration: "The Ultra Ball phases right through Mew like it isn't there. Mew giggles again, and a psychic shockwave ripples through your team. Then it vanishes. Gone. Forever.", effects: { ultraballs: -1, partyDamageAll: 2 } },
                        { weight: 40, narration: "Mew bats the ball away playfully. Then its eyes glow, and your entire team is hit with a psychic pulse. Pokemon cry out in pain. Mew tilts its head, waves goodbye, and disappears.", effects: { ultraballs: -1, partyDamageAll: 3 } }
                    ]
                },
                {
                    text: "Just... watch it",
                    outcomes: [
                        { weight: 60, narration: "Mew floats around you, examining your Pokemon with ancient curiosity. It touches your lead Pokemon's forehead — a warm glow spreads through them. Then Mew vanishes in a flash of light. You'll never see it again, but you'll never forget.", effects: { healAll: true, seePokemon: 151 } },
                        { weight: 40, narration: "Mew studies you for a long moment, as if deciding something. Then it waves a tiny paw and disappears. Your team feels strangely energized, like they've been blessed by something beyond understanding.", effects: { healAll: true, boostPokemonMaxHp: 1, seePokemon: 151 } }
                    ]
                }
            ]
        },

        // #7 - Magikarp Salesman (Vermilion City)
        {
            id: "magikarp_salesman",
            type: "story",
            name: "The Magikarp Salesman!",
            description: "A shifty man in a trench coat blocks your path. \"Hey kid! You look like a smart trainer. Have I got a deal for you! This Magikarp — this SPECIFIC Magikarp — is absolutely one of a kind! Only $500! You won't regret it!\" He's sweating.",
            weight: 7,
            oneTime: true,
            locationIds: ["vermilion_city"],
            choices: [
                {
                    text: "Buy the Magikarp ($500)",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 60, narration: "You hand over the cash. The man practically runs away. You're now the proud owner of... a Magikarp. It flops pathetically in its ball. What have you done. But hey — Magikarp evolves into Gyarados. Right? ...Right?", effects: { money: -500, catchPokemon: 129 } },
                        { weight: 40, narration: "\"SOLD!\" He grabs your money and shoves a Poke Ball into your hands. The Magikarp inside looks completely ordinary. You feel like an idiot. But deep down, something tells you this fish has potential.", effects: { money: -500, catchPokemon: 129 } }
                    ]
                },
                {
                    text: "\"Do I look stupid to you?\"",
                    outcomes: [
                        { weight: 70, narration: "\"Your loss, kid! This is a PREMIUM fish!\" He shuffles off to find his next victim. Your wallet thanks you.", effects: {} },
                        { weight: 30, narration: "\"Fine! How about a discount — $200! No? Okay here, just take this junk.\" He throws some Poke Balls at you and storms off.", effects: { pokeballs: 3 } }
                    ]
                }
            ]
        },

        // #8 - Drowzee's Dream (Lavender Town)
        {
            id: "drowzee_dream",
            type: "story",
            name: "Drowzee's Dream!",
            description: "A wild Drowzee emerges from the fog and locks eyes with your lead Pokemon. Before you can react, your Pokemon's eyes glaze over — it's been put into a deep, unnatural sleep. The Drowzee is feeding on its dreams. You need to act fast.",
            weight: 5,
            oneTime: true,
            locationIds: ["lavender_town"],
            choices: [
                {
                    text: "Use food to lure Drowzee away (20 food)",
                    outcomes: [
                        { weight: 100, narration: "You spread out your supplies — the smell breaks Drowzee's concentration. It shuffles toward the food, gorging itself. Your Pokemon wakes up, shaken but unharmed. Twenty rations gone to save one Pokemon. Worth it.", effects: { food: -20 } }
                    ]
                },
                {
                    text: "Let your Pokemon dream",
                    outcomes: [
                        { weight: 45, narration: "Your Pokemon writhes in its sleep. The dream goes deeper. When it finally wakes, something has changed — it feels STRONGER. The nightmare forged it. Drowzee flees, overfed.", effects: { boostPokemonMaxHp: 1 } },
                        { weight: 55, narration: "The dream turns into a nightmare. Your Pokemon screams in its sleep. When it wakes, it's dazed and weakened. The Drowzee drained something vital. Your Pokemon will never be quite the same.", effects: { partyDamage: 2 } }
                    ]
                }
            ]
        },

        // #9 - Lt. Surge's Minefield (Vermilion City)
        {
            id: "surge_minefield",
            type: "hazard",
            name: "Lt. Surge's Minefield!",
            description: "The road ahead crackles with residual electricity — Lt. Surge's old training ground. Electric traps are scattered across the path. \"DANGER: LIVE CURRENT\" reads a rusted sign. You can see the safe route, but it'll take time to navigate. Or you could just run for it.",
            weight: 6,
            oneTime: true,
            locationIds: ["vermilion_city"],
            choices: [
                {
                    text: "Navigate carefully (lose 1 day)",
                    bonusAbility: "flash",
                    outcomes: [
                        { weight: 70, narration: "Step by careful step, you weave through the electric traps. It takes all day, but you and your team make it through unscathed.", effects: { daysLost: 1 } },
                        { weight: 30, narration: "You're almost through when a hidden trap triggers! A small shock, but nothing serious. Better than rushing.", effects: { daysLost: 1, partyDamageAll: 1 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Electric-type senses the current and guides you through safely in no time!", effects: {} }
                },
                {
                    text: "Sprint through!",
                    outcomes: [
                        { weight: 25, narration: "You bolt through the minefield, dodging sparks left and right. By some miracle, you make it! Your heart is pounding out of your chest.", effects: {} },
                        { weight: 40, narration: "ZAP! ZAP! ZAP! Your Pokemon take hits from all sides! You make it through, but everyone's hurting.", effects: { partyDamageAll: 2 } },
                        { weight: 35, narration: "A massive surge hits your team! A Pokemon is paralyzed and badly injured. You barely make it to the other side.", effects: { partyDamageAll: 3, statusRandom: "paralyzed" } }
                    ]
                }
            ]
        },

        // #10 - Mr. Fuji's Blessing (Lavender Town)
        {
            id: "mr_fuji_blessing",
            type: "story",
            name: "Mr. Fuji's Offer!",
            description: "The kind old Mr. Fuji tends to abandoned Pokemon in his home. He looks at your battered team with gentle concern. \"I can heal all of your Pokemon completely — I have the medicine and the skill. But I must ask something in return. One of your Pokemon... let me care for it here. It will live peacefully. I promise.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["lavender_town"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Accept — release a Pokemon for a full heal",
                    requiresPartySize: 2,
                    outcomes: [
                        { weight: 100, narration: "You choose one of your Pokemon and hand its ball to Mr. Fuji. It looks back at you one last time before being led inside. Mr. Fuji keeps his word — your remaining team is healed completely. The house is warm. Your Pokemon will be safe. But the team feels smaller.", effects: { pokemonDeath: true, healAll: true } }
                    ]
                },
                {
                    text: "Decline his offer",
                    outcomes: [
                        { weight: 60, narration: "\"I understand, dear child. Your bond with them is strong.\" He gives you a single potion and a sad smile. \"Take care of them.\"", effects: { potions: 1 } },
                        { weight: 40, narration: "Mr. Fuji nods understandingly. \"Then at least take this.\" He hands you some medicine and food from his own supplies.", effects: { potions: 2, food: 5 } }
                    ]
                }
            ]
        },

        // #11 - Team Rocket Shakedown (Celadon City)
        {
            id: "rocket_shakedown",
            type: "combat",
            name: "Rocket Shakedown!",
            description: "Three Rocket grunts corner you in an alley behind the Game Corner. \"Nice Pokemon you got there. Here's how this works: give us one of your Pokemon as a 'protection fee,' and we'll let you into our stash. Refuse, and we take one anyway. Your call, trainer.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["celadon_city"],
            choices: [
                {
                    text: "Hand over a Pokemon willingly",
                    requiresPartySize: 2,
                    outcomes: [
                        { weight: 100, narration: "You hand over a Poke Ball. The grunt inspects it, nods, and opens a hidden door. Inside: cash, candy, the works. It's a king's ransom. But on the walk home, you keep reaching for a Poke Ball that isn't there anymore.", effects: { pokemonDeath: true, money: 1000, rareCandy: 1 } }
                    ]
                },
                {
                    text: "Fight your way out!",
                    eventBattle: {
                        pool: "rocket_grunt",
                        difficulty: "medium",
                        trainerName: "Rocket Grunt",
                        winNarration: "Your Pokemon sends the grunts scrambling! You grab what you can from the chaos and run. You kept your team intact.",
                        lossNarration: "Three on one was too much. The grunts overpower you and raid your supplies.",
                        winEffects: { money: 400 },
                        lossEffects: { money: -500, food: -10 }
                    }
                }
            ]
        },

        // #12 - Cinnabar Lab Experiment (Cinnabar Island)
        {
            id: "cinnabar_experiment",
            type: "special",
            name: "Cinnabar Lab Experiment!",
            description: "In the ruins of the Cinnabar Research Lab, you find scientists continuing their work in secret. \"We've perfected our enhancement serum — the same research that created Mewtwo, refined and safer. We can make one of your Pokemon significantly stronger. But there's a 30% chance of... cellular rejection. We've lost subjects before. Your choice.\"",
            weight: 4,
            oneTime: true,
            locationIds: ["cinnabar_island"],
            choices: [
                {
                    text: "Enhance a Pokemon",
                    outcomes: [
                        { weight: 70, narration: "Your Pokemon is strapped into the machine. Lights flash. It screams. Then silence. When the pod opens, your Pokemon stands taller, stronger. Its eyes glow briefly. The enhancement worked. +2 max HP. The scientists cheer.", effects: { boostPokemonMaxHp: 2 } },
                        { weight: 30, narration: "The machine sparks. Your Pokemon convulses. Alarms blare. The scientists scramble but it's too late. \"Cellular rejection...\" one whispers. Your Pokemon is gone. The same technology that created Mewtwo just destroyed one of yours.", effects: { pokemonDeath: true } }
                    ]
                },
                {
                    text: "Walk away from this madness",
                    outcomes: [
                        { weight: 100, narration: "\"This is what created Mewtwo. No thanks.\" You leave the lab. The lead scientist calls after you: \"It's SAFE now!\" You don't look back.", effects: {} }
                    ]
                }
            ]
        },

        // #13 - Copycat's Trick (Saffron City)
        {
            id: "copycat_ditto",
            type: "special",
            name: "Copycat's Ditto!",
            description: "The famous Copycat girl of Saffron City finds you. \"My Ditto can copy ANY Pokemon perfectly! Want to test your strongest against its own mirror?\" Her Ditto transforms into an exact copy of your lead Pokemon. A mirror match — your Pokemon versus itself.",
            weight: 5,
            oneTime: true,
            locationIds: ["saffron_city"],
            choices: [
                {
                    text: "Accept the mirror match!",
                    outcomes: [
                        { weight: 35, narration: "Your Pokemon faces its perfect clone. The battle is surreal — identical moves, identical strength. But YOUR Pokemon has heart. The real thing beats the copy. Copycat is thrilled: \"Amazing! Ditto, go with them!\" Ditto joins your team!", effects: { catchPokemon: 132 } },
                        { weight: 35, narration: "The mirror match is brutal. Your Pokemon fights itself to a standstill. Both collapse. Your Pokemon recovers, but something's been drained — permanently. Copycat recalls her Ditto sheepishly. \"Sorry... Ditto doesn't hold back.\"", effects: { partyDamageAll: 1, reducePokemonMaxHp: 1 } },
                        { weight: 30, narration: "Your Pokemon wins! Barely. The effort was immense. Copycat laughs and hands over Ditto's ball. \"You earned it!\" But your team is exhausted from watching.", effects: { catchPokemon: 132, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Decline the challenge",
                    outcomes: [
                        { weight: 100, narration: "\"Aww, no fun!\" Copycat pouts. Her Ditto reverts to a pink blob and waves at you as they leave.", effects: {} }
                    ]
                }
            ]
        },

        // #14 - Nugget Bridge Gauntlet (Cerulean City)
        {
            id: "nugget_bridge_gauntlet",
            type: "combat",
            name: "Nugget Bridge Gauntlet!",
            description: "Five trainers stand in a line across Nugget Bridge. A sign reads: \"DEFEAT ALL 5 TRAINERS, WIN THE NUGGET! $500 PER WIN! $5000 COMPLETION BONUS!\" The first trainer cracks their knuckles. Once you start, there's no turning back. Each round hits harder.",
            weight: 6,
            oneTime: true,
            locationIds: ["cerulean_city"],
            choices: [
                {
                    text: "Take on the gauntlet!",
                    outcomes: [
                        { weight: 15, narration: "You are UNSTOPPABLE. Five trainers, five victories. Your Pokemon barely breaks a sweat. The final trainer hands you the Nugget and a fat stack of cash. \"Nobody's ever swept us like that!\" Your team is battle-hardened and your wallet is full.", effects: { money: 7500, rareCandy: 1, trainPokemon: true } },
                        { weight: 25, narration: "Four down, one to go — but the fifth trainer is brutal. Your Pokemon wins by a thread. You collect the full prize, but your team is battered. Every dollar was earned in blood.", effects: { money: 7500, rareCandy: 1, partyDamage: 2, trainPokemon: true } },
                        { weight: 30, narration: "You beat three trainers before your Pokemon can't continue. $1500 earned, but the Nugget slips through your fingers. Your team took a serious beating on the bridge.", effects: { money: 1500, partyDamage: 2 } },
                        { weight: 20, narration: "The second trainer wipes the floor with you. $500 for one win, and your team is wrecked. You limp off the bridge, humbled.", effects: { money: 500, partyDamage: 2 } },
                        { weight: 10, narration: "A complete disaster. The first trainer's Pokemon lands a devastating critical hit. Yours doesn't get up. You're carried off the bridge. No money. No Nugget. Just loss.", effects: { pokemonDeath: true } }
                    ]
                },
                {
                    text: "Not worth the risk",
                    outcomes: [
                        { weight: 100, narration: "\"Smart move,\" mutters a trainer who looks like he's seen better days. You cross the bridge quietly and move on.", effects: {} }
                    ]
                }
            ]
        },

        // #15 - Ghost of Rival Past (Lavender Town)
        {
            id: "ghost_rival_past",
            type: "story",
            name: "A Familiar Grave...",
            description: "In Pokemon Tower, a small gravestone catches your eye. The name on it is... your rival's Pokemon. The one from your first battle. Did it... die? A spectral shape rises from the grave — not a ghost type, but something worse. A memory. It attacks, driven by guilt and grief. There is no winning this fight.",
            weight: 3,
            oneTime: true,
            locationIds: ["lavender_town"],
            minDay: 8,
            choices: [
                {
                    text: "Endure the haunting",
                    outcomes: [
                        { weight: 50, narration: "The spectral Pokemon rages against your team. It can't be fought — only survived. Your Pokemon take hits. Your food scatters. When it finally fades, the tower is silent. The grave is just a grave again. But the question remains: was it your fault?", effects: { partyDamageAll: 2, food: -8 } },
                        { weight: 50, narration: "The ghost tears through your supplies in blind fury. A Pokemon cries out in pain. When the haunting ends, you're shaken to your core. Some victories have consequences you never see.", effects: { partyDamageAll: 1, food: -10, money: -200 } }
                    ]
                },
                {
                    text: "Use a Potion as an offering",
                    requiresItem: "potions",
                    outcomes: [
                        { weight: 60, narration: "You place the potion at the gravestone. The ghost pauses. Studies it. The rage fades from its eyes. It dissolves peacefully, and you find $300 scattered where it stood — left by previous trainers who weren't as kind.", effects: { potions: -1, money: 300 } },
                        { weight: 40, narration: "The potion offering angers it further — you can't heal the dead. The ghost lashes out before finally dissipating. You managed to calm it eventually, but not before taking damage.", effects: { potions: -1, partyDamageAll: 1 } }
                    ]
                }
            ]
        },

        // #16 - Power Plant Overload (Cerulean City area)
        {
            id: "power_plant_overload",
            type: "hazard",
            name: "Power Plant Overload!",
            description: "The abandoned Power Plant is surging with uncontrolled energy. Sparks fly from every surface. An electric overload is building — someone needs to absorb the excess current or it'll fry everything in the area. An Electric-type Pokemon could channel it, but the voltage is dangerous.",
            weight: 4,
            oneTime: true,
            locationIds: ["cerulean_city"],
            choices: [
                {
                    text: "Send in a Pokemon to absorb it",
                    outcomes: [
                        { weight: 50, narration: "Your Pokemon charges into the plant and absorbs the overload! The electricity courses through it — agonizing, but empowering. It emerges stronger than before, crackling with residual energy. But the strain took a physical toll.", effects: { boostPokemonMaxHp: 1, partyDamage: 2 } },
                        { weight: 30, narration: "The voltage is too much! Your Pokemon absorbs what it can but gets badly shocked in the process. No permanent boost — just pain.", effects: { partyDamage: 3 } },
                        { weight: 20, narration: "Your Pokemon channels the electricity perfectly! The overload stabilizes. Your Pokemon THRIVES on the energy, emerging significantly stronger.", effects: { boostPokemonMaxHp: 1, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Stay clear of the plant",
                    outcomes: [
                        { weight: 60, narration: "The overload discharges on its own in a massive explosion. Debris and sparks fly — your supplies take the hit.", effects: { food: -5, money: -200 } },
                        { weight: 40, narration: "You keep your distance. The surge eventually dies down. No harm done, but no gain either. The Power Plant falls silent.", effects: {} }
                    ]
                }
            ]
        },

        // ============================================
        // NEW EVENTS: Filling underserved locations
        // ============================================

        // #17 - Old Man's Parting Gift (Viridian City)
        {
            id: "old_man_last_lesson",
            type: "story",
            name: "The Old Man's Parting Gift!",
            description: "The old man who once taught you how to catch Pokemon stops you on the road out of Viridian. \"I'm retiring, kid. Heading to Cinnabar to live out my days. But I've got one last thing — my Abra. He's a good one. Teleported me out of more scrapes than I can count. I'll sell him to you for $800. Or... I can teach your lead Pokemon one last trick. Free of charge.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["viridian_city"],
            choices: [
                {
                    text: "Buy his Abra ($800)",
                    requiresMoney: 800,
                    outcomes: [
                        { weight: 60, narration: "You hand over the cash. The old man pats the Poke Ball fondly before giving it up. \"Take care of him.\" The Abra inside immediately teleports to the top of your head, then back into its ball. It's going to be a handful.", effects: { money: -800, catchPokemon: 63 } },
                        { weight: 40, narration: "\"Good choice, kid.\" The Abra is strong — clearly well-trained over decades. It regards you with sleepy but intelligent eyes. The old man walks away without looking back.", effects: { money: -800, catchPokemon: 63 } }
                    ]
                },
                {
                    text: "Take the free training",
                    outcomes: [
                        { weight: 100, narration: "The old man spends an hour with your lead Pokemon, drilling techniques you've never seen. Ancient battle wisdom, passed down from a lifetime of training. Your Pokemon emerges tougher, harder, BETTER. \"That's my legacy now,\" the old man says, tipping his hat. \"Make it count.\"", effects: { boostPokemonMaxHp: 1 } }
                    ]
                },
                {
                    text: "\"Thanks, but I'm good.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Suit yourself.\" He shuffles off toward Route 1. You wonder if you'll regret that.", effects: {} }
                    ]
                }
            ]
        },

        // #18 - Pikachu in the Forest (Viridian City)
        {
            id: "viridian_pikachu_chase",
            type: "special",
            name: "Pikachu in the Forest!",
            description: "A flash of yellow darts through the tall grass at the edge of Viridian Forest. A wild Pikachu — and not just any Pikachu. This one is FAST. Its cheeks spark dangerously as it watches you from behind a tree. You've heard stories about powerful wild Pikachu in this forest. This could be your only chance.",
            weight: 6,
            oneTime: true,
            locationIds: ["viridian_city"],
            choices: [
                {
                    text: "Chase it down! (5 Poke Balls)",
                    requiresItem: "pokeballs",
                    outcomes: [
                        { weight: 30, narration: "You tear through the undergrowth, burning through Poke Balls. The Pikachu zips left, right, up a tree — but your fifth ball catches it mid-leap! The ball shakes once... twice... CLICK. You've got a Pikachu! Your team took some Thundershocks during the chase though.", effects: { pokeballs: -5, catchPokemon: 25, partyDamageAll: 1 } },
                        { weight: 40, narration: "Five Poke Balls, five misses. The Pikachu Thundershocks your whole team on its way out, laughing — actually laughing — as it vanishes into the forest. Five balls wasted and your Pokemon are scorched.", effects: { pokeballs: -5, partyDamageAll: 2 } },
                        { weight: 30, narration: "The chase is on! Branches whip your face, your Pokemon take electric shocks — but that last ball connects! Pikachu glares at you from inside the Poke Ball, then settles down. Hard-won, but worth every bruise.", effects: { pokeballs: -5, catchPokemon: 25, partyDamageAll: 2 } }
                    ]
                },
                {
                    text: "Leave out food as bait (12 food)",
                    outcomes: [
                        { weight: 60, narration: "You pile up your best rations and wait. The Pikachu's nose twitches. It creeps closer... closer... and starts eating. You gently roll a Poke Ball. It barely resists. Sometimes patience beats speed.", effects: { food: -12, catchPokemon: 25 } },
                        { weight: 40, narration: "The Pikachu eats every last scrap of your food — then bolts. Not even a backward glance. Twelve rations gone for nothing. You can almost hear it mocking you from the forest.", effects: { food: -12 } }
                    ]
                },
                {
                    text: "Let it go",
                    outcomes: [
                        { weight: 100, narration: "The Pikachu watches you for a long moment, cheeks sparking. Then it nods — almost respectfully — and disappears into the forest. Not every encounter needs to end in a catch.", effects: {} }
                    ]
                }
            ]
        },

        // #19 - Museum Heist (Pewter City)
        {
            id: "pewter_museum_heist",
            type: "combat",
            name: "Museum Heist!",
            description: "You stumble into chaos at the Pewter Museum. Three Team Rocket grunts are trying to steal the Aerodactyl fossil from the back room. A grunt spots you: \"Hey kid, help us crack this display case and we'll split the goods. Or try to stop us — see how that goes.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["pewter_city"],
            minDay: 3,
            choices: [
                {
                    text: "Help Team Rocket",
                    outcomes: [
                        { weight: 60, narration: "You help the grunts smash the case. The Aerodactyl fossil crumbles — but inside is a perfectly preserved Poke Ball. An actual living Aerodactyl! The grunts toss you the ball and $1000. \"Pleasure doing business, kid.\" You feel dirty. But powerful.", effects: { catchPokemon: 142, money: 1000 } },
                        { weight: 40, narration: "You help break the case, but it's a double-cross. The grunts grab the fossil AND your money. \"Thanks for the help, sucker!\" They shove you into the display and bolt. The museum guard finds you covered in glass.", effects: { money: -500, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Defend the museum!",
                    outcomes: [
                        { weight: 30, narration: "You and your Pokemon fight off all three grunts! The museum curator is overjoyed. \"Take this — you've earned it.\" He hands you a rare fossil specimen and a cash reward. Your Pokemon are battered but proud.", effects: { money: 800, rareCandy: 1, partyDamage: 2 } },
                        { weight: 40, narration: "You drive them off, but not before they trash the place. The curator gives you what he can — some cash and supplies — but your team took a beating in the three-on-one brawl.", effects: { money: 400, potions: 2, partyDamage: 2 } },
                        { weight: 30, narration: "Three against one isn't fair. Your Pokemon fights bravely but gets overwhelmed. The grunts escape with the fossil while you nurse your wounded team. At least you tried.", effects: { partyDamage: 3 } }
                    ]
                }
            ]
        },

        // #20 - Brock's Breeding Program (Pewter City)
        {
            id: "brock_secret_breeder",
            type: "special",
            name: "Brock's Breeding Program!",
            description: "Behind Pewter Gym, Brock is tending to a nest of Pokemon eggs. He waves you over. \"Hey — I've been working on a breeding program. Got an Onix egg here that's about to hatch. Strong bloodline. I'll let you have it, but raising an Onix takes serious food. 25 rations and one day's rest for the hatching. Deal?\"",
            weight: 5,
            oneTime: true,
            locationIds: ["pewter_city"],
            choices: [
                {
                    text: "Take the Onix egg (25 food, 1 day)",
                    outcomes: [
                        { weight: 70, narration: "You hand over the food and make camp. The egg cracks at dawn — a baby Onix bursts free, already six feet long and solid as granite. Brock grins: \"She's got good genes.\" The food investment stings, but this Onix is a wall.", effects: { food: -25, daysLost: 1, catchPokemon: 95 } },
                        { weight: 30, narration: "The egg hatches into a massive Onix — even Brock is surprised. \"This one's special. Extra tough.\" It immediately starts eating rocks. Your food stores are depleted but your team just got a LOT harder to kill.", effects: { food: -25, daysLost: 1, catchPokemon: 95, boostPokemonMaxHp: 1 } }
                    ]
                },
                {
                    text: "\"Can't spare the food, sorry.\"",
                    outcomes: [
                        { weight: 100, narration: "Brock nods understandingly. \"Survival comes first. I respect that.\" He gives you a few potions for the road. \"Good luck out there.\"", effects: { potions: 1 } }
                    ]
                }
            ]
        },

        // #21 - Warden's Gold Teeth (Fuchsia City)
        {
            id: "warden_gold_teeth",
            type: "story",
            name: "The Warden's Gold Teeth!",
            description: "The Safari Zone Warden grabs your arm. \"MY TEEF! I lost my gold dentures somewhere in the Safari Zone! Find them and I'll give you HM03 — Surf! But the Zone is dangerous. Your Pokemon WILL get hurt in there. Or... you could just explore and keep whatever rare Pokemon you find instead.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["fuchsia_city"],
            choices: [
                {
                    text: "Search for the teeth",
                    outcomes: [
                        { weight: 50, narration: "Hours of searching through swamps and tall grass. Your Pokemon fend off wild attacks the whole time. Finally — gold glinting in the mud! The Warden is thrilled. \"SURF IS YOURS!\" Your team is exhausted but you've got a key item.", effects: { keyItem: "HM Surf", partyDamage: 2 } },
                        { weight: 30, narration: "You find the teeth quickly — wedged in a Victreebel's mouth. Getting them OUT is the hard part. Your Pokemon take a beating, but the Warden gives you Surf AND throws in some cash. \"You're braver than you look!\"", effects: { keyItem: "HM Surf", money: 500, partyDamageAll: 1 } },
                        { weight: 20, narration: "The search drags on for a full day. Wild Pokemon attack relentlessly. You finally find the teeth, but your team is wrecked. The Warden hands you Surf with a toothless grin. Was it worth it?", effects: { keyItem: "HM Surf", partyDamage: 3, daysLost: 1 } }
                    ]
                },
                {
                    text: "Explore the Safari Zone instead",
                    outcomes: [
                        { weight: 25, narration: "Forget the teeth — the Safari Zone has DRATINI! You spot one near the lake and carefully lure it in. A rare catch! The Warden is disappointed but you've got something better.", effects: { catchPokemon: 147, partyDamageAll: 1 } },
                        { weight: 35, narration: "You explore deep into the Zone and find a Scyther! Fast, fierce, and yours. The Warden grumbles about his teeth but you're too busy admiring your new bug.", effects: { catchPokemon: 123, partyDamageAll: 1 } },
                        { weight: 40, narration: "The Safari Zone is a bust. You wander for hours, find nothing rare, and your Pokemon get beat up by wild Tauros. No teeth, no rare catch, just bruises.", effects: { partyDamageAll: 2, food: -5 } }
                    ]
                }
            ]
        },

        // #22 - Koga's Invisible Trial (Fuchsia City)
        {
            id: "koga_invisible_trial",
            type: "special",
            name: "Koga's Invisible Trial!",
            description: "Koga appears from thin air — literally. \"You seek strength? My invisible maze holds a prize at its center. Walk it blindfolded, and what you find is yours. But the walls are laced with poison. Or... pay $1000 and I'll show you the safe path. Choose wisely, trainer.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["fuchsia_city"],
            minBadges: 4,
            choices: [
                {
                    text: "Walk the maze blindfolded",
                    bonusAbility: "psychic",
                    bonusOutcome: { narration: "Your Psychic-type senses the walls before you hit them! You glide through the maze untouched and find the prize: a Rare Candy AND a Venomoth, trained by Koga himself. \"Impressive,\" he admits. \"The psychic's foresight serves you well.\"", effects: { rareCandy: 1, catchPokemon: 49 } },
                    outcomes: [
                        { weight: 25, narration: "You stumble, you slam into walls, poison seeps through your clothes — but you make it! At the center: a Rare Candy and one of Koga's own Venomoth. \"You have the heart of a ninja,\" Koga says approvingly.", effects: { rareCandy: 1, catchPokemon: 49, partyDamageAll: 1 } },
                        { weight: 40, narration: "The maze is brutal. Poison barbs catch your Pokemon at every turn. You reach the center and grab the Rare Candy, but the toll is severe.", effects: { rareCandy: 1, partyDamageAll: 2 } },
                        { weight: 35, narration: "You're hopelessly lost. The invisible walls close in. Poison damage accumulates. By the time Koga pulls you out, your team is in rough shape and you found nothing.", effects: { partyDamageAll: 3 } }
                    ]
                },
                {
                    text: "Pay for the safe path ($1000)",
                    requiresMoney: 1000,
                    outcomes: [
                        { weight: 100, narration: "Koga nods and reveals the path with a wave of his hand. You walk straight to the center and collect a Rare Candy. \"Money buys safety,\" Koga says. \"But not respect.\" Still — you're alive and richer in candy.", effects: { money: -1000, rareCandy: 1 } }
                    ]
                },
                {
                    text: "\"I'll pass on the death maze.\"",
                    outcomes: [
                        { weight: 70, narration: "\"A wise choice... or a cowardly one.\" Koga vanishes. As you leave, you notice 5 of your Poke Balls are missing. Ninja theft. Classic Koga.", effects: { pokeballs: -5 } },
                        { weight: 30, narration: "Koga shrugs and disappears. You check your bag — everything's intact. Maybe he respects the honest answer.", effects: {} }
                    ]
                }
            ]
        },

        // #23 - The Frozen Trainer (Seafoam Islands)
        {
            id: "seafoam_frozen_trainer",
            type: "discovery",
            name: "The Frozen Trainer!",
            description: "Deep in the Seafoam caves, you find something horrifying: a trainer frozen solid in a block of ancient ice. They've been here for... years? Decades? But their belt still holds two Poke Balls, and inside, you can see Pokemon — alive, preserved by the cold. You could thaw them out.",
            weight: 4,
            oneTime: true,
            locationIds: ["seafoam_islands"],
            choices: [
                {
                    text: "Carefully thaw one Poke Ball",
                    outcomes: [
                        { weight: 35, narration: "You use your Pokemon's warmth to slowly thaw one ball. It pops open — a Dewgong emerges, confused but healthy. It's been frozen for who knows how long. It looks at the frozen trainer, then at you, and accepts its new reality.", effects: { catchPokemon: 87, partyDamageAll: 1 } },
                        { weight: 35, narration: "The ice cracks and releases — a Jynx! It shivers violently, then steadies itself. It examines the frozen trainer with what looks like grief, then turns to you. A new partner, born from tragedy.", effects: { catchPokemon: 124, partyDamageAll: 1 } },
                        { weight: 30, narration: "A Lapras emerges from the thawed ball! Rare and powerful. It sings a mournful note toward the frozen trainer — a farewell — then nuzzles against you. The cold damaged your team slightly during the thawing.", effects: { catchPokemon: 131, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Thaw BOTH Poke Balls",
                    outcomes: [
                        { weight: 30, narration: "Greedy but effective! Both balls crack open. A Dewgong and a Jynx emerge, shaken but alive. The effort drains your team — thawing that much ice takes everything. But two new Pokemon is two new Pokemon.", effects: { catchPokemon: 87, catchPokemon2: 124, partyDamage: 3 } },
                        { weight: 70, narration: "The second ball shatters during thawing — too much thermal shock. The Pokemon inside doesn't make it. Your team watches in horror. At least the first one survived: a Dewgong, traumatized but alive.", effects: { catchPokemon: 87, partyDamage: 2, pokemonDeath: true } }
                    ]
                },
                {
                    text: "Leave them frozen",
                    outcomes: [
                        { weight: 100, narration: "Some things are better left undisturbed. You bow your head to the frozen trainer and move on. The cold seems to ease around your team — as if the cave approves of your restraint.", effects: { healOne: true } }
                    ]
                }
            ]
        },

        // #24 - The Killing Current (Seafoam Islands)
        {
            id: "seafoam_current_sacrifice",
            type: "hazard",
            name: "The Killing Current!",
            description: "A raging underground river blocks your path through Seafoam Islands. The current is VICIOUS — it's already swept away debris, supplies, maybe trainers. A massive boulder could redirect the flow, but pushing it requires serious strength. Your other options aren't great either.",
            weight: 5,
            oneTime: true,
            locationIds: ["seafoam_islands"],
            choices: [
                {
                    text: "Push the boulder",
                    bonusAbility: "strength",
                    bonusOutcome: { narration: "Your Strength-user slams into the boulder and it MOVES. The current redirects perfectly. Your team crosses safely. Brute force wins again.", effects: {} },
                    outcomes: [
                        { weight: 40, narration: "Your Pokemon heaves against the boulder. It moves — barely — redirecting enough of the current to cross. But the strain is immense. Your Pokemon's muscles are torn from the effort.", effects: { reducePokemonMaxHp: 1, partyDamageAll: 1 } },
                        { weight: 35, narration: "The boulder shifts! The current weakens just enough to wade through. Your team gets soaked and battered but makes it across in one piece.", effects: { partyDamage: 2 } },
                        { weight: 25, narration: "The boulder won't budge. Your Pokemon exhausts itself trying. You're forced to wade through the current anyway. Supplies are swept away in the torrent.", effects: { partyDamage: 2, food: -8, pokeballs: -3 } }
                    ]
                },
                {
                    text: "Use Escape Ropes to cross (2 ropes)",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 100, narration: "You tie the ropes across the river — one as a handhold, one as a safety line. Your team crosses carefully. The ropes fray and snap behind you, but everyone makes it. Smart use of resources.", effects: { escapeRope: -2 } }
                    ]
                },
                {
                    text: "Wait for the current to die down",
                    outcomes: [
                        { weight: 100, narration: "You make camp and wait. Two days pass. The current finally weakens. You cross safely, but the delay cost you time and food. Sometimes patience is just another word for losing.", effects: { daysLost: 2, food: -10 } }
                    ]
                }
            ]
        },

        // #25 - Giovanni's Final Offer (Viridian City Return)
        {
            id: "giovanni_final_offer",
            type: "story",
            name: "Giovanni's Final Offer!",
            description: "After defeating his gym, Giovanni catches you outside. He's not angry — he's impressed. \"You beat me fairly. That's rare. I'm disbanding Team Rocket.\" He pauses. \"But before I go... I have an offer. Join me. Not Rocket — something new. I'll give you $5000, a Rare Candy, and make your strongest Pokemon even stronger. All I need is... one of your Pokemon. A show of loyalty.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["viridian_city_return"],
            choices: [
                {
                    text: "Accept Giovanni's offer",
                    requiresPartySize: 2,
                    outcomes: [
                        { weight: 50, narration: "Giovanni takes one of your Pokemon — you don't get to choose which. The money appears in your account. The Rare Candy is real. Your lead Pokemon glows with new power. But as Giovanni walks away with your Pokemon, you wonder what you've become.", effects: { money: 5000, rareCandy: 1, boostPokemonMaxHp: 1, pokemonDeath: true } },
                        { weight: 50, narration: "You shake his hand. The deal is done. $5000, candy, and raw power. But the Pokemon he takes cries out as he walks away. The other members of your team look at you differently now. Was this worth it?", effects: { money: 5000, rareCandy: 1, boostPokemonMaxHp: 1, pokemonDeath: true } }
                    ]
                },
                {
                    text: "\"I'll never join you.\"",
                    outcomes: [
                        { weight: 25, narration: "Giovanni smiles — genuinely. \"I hoped you'd say that.\" He snaps his fingers. Nothing happens. \"Just testing you. The world needs trainers with conviction, not sellouts. Go win the League.\" He walks into the sunset.", effects: {} },
                        { weight: 75, narration: "\"Disappointing.\" Giovanni whistles. Three Rocket grunts emerge from the shadows and rough up your team. \"Consider that a parting gift.\" By the time you recover, Giovanni is gone. Your team is battered but your soul is intact.", effects: { partyDamageAll: 2, money: -300 } }
                    ]
                }
            ]
        },

        // #26 - Rival's Last Stand (Viridian City Return)
        {
            id: "gary_last_stand",
            type: "combat",
            name: "Rival's Last Stand!",
            description: "Gary blocks Victory Road. He looks different — older, harder. \"One more time. You and me. Right here. No badges on the line, no prize money — just proof of who's the better trainer. Unless you want to shake hands and walk into the League together. Your call.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["viridian_city_return"],
            minBadges: 7,
            choices: [
                {
                    text: "Battle Gary one last time!",
                    eventBattle: {
                        pool: "gary",
                        difficulty: "hard",
                        trainerName: "Rival Gary",
                        winNarration: "\"I knew it. You're better than me. Always were.\" Gary hands over prize money and a Rare Candy. Your Pokemon grew from the rivalry.",
                        lossNarration: "Gary wins. Fair and square. He doesn't gloat — just nods. \"See you at the League.\" The fire to win has never burned hotter.",
                        winEffects: { money: 2000, rareCandy: 1, trainPokemon: true },
                        lossEffects: { money: -1000 }
                    }
                },
                {
                    text: "Shake hands and call a truce",
                    outcomes: [
                        { weight: 100, narration: "Gary hesitates... then grips your hand. \"Partners. Just this once.\" He patches up your Pokemon and shares his supplies. It feels strange — good strange. You walk toward Victory Road together. Rivals turned allies, at least for now.", effects: { healAll: true, food: 10, potions: 2 } }
                    ]
                }
            ]
        },

        // #27 - Victory Road Guardian (Indigo Plateau)
        {
            id: "victory_road_guardian",
            type: "combat",
            name: "Victory Road Guardian!",
            description: "A massive Machamp blocks the exit of Victory Road. It's been here for years — a self-appointed guardian that tests every trainer who passes. Its four arms crack menacingly. No trainer has EVER just walked past it. You either fight, or you find another way.",
            weight: 4,
            oneTime: true,
            locationIds: ["indigo_plateau"],
            minBadges: 7,
            choices: [
                {
                    text: "Challenge the Machamp!",
                    bonusAbility: "psychic",
                    bonusOutcome: { narration: "Your Psychic-type reaches into Machamp's mind. It freezes. Its eyes go wide. Then it steps aside, bowing deeply. Psychic trumps Fighting — every time. You walk through untouched, and Machamp joins your team out of respect.", effects: { catchPokemon: 68 } },
                    outcomes: [
                        { weight: 15, narration: "An INCREDIBLE battle! Your Pokemon matches Machamp blow for blow and lands the final hit. Machamp kneels. It's been defeated for the first time in years. It offers its Poke Ball — it WANTS to join a trainer this strong. Your lead Pokemon grew from the fight.", effects: { catchPokemon: 68, trainPokemon: true, partyDamageAll: 1 } },
                        { weight: 20, narration: "Your Pokemon wins, but barely. Machamp is a monster. It nods respectfully and steps aside, but the fight cost you dearly. Your team can barely stand.", effects: { partyDamage: 3, trainPokemon: true } },
                        { weight: 35, narration: "Machamp is too strong. Four arms, four times the punishment. Your Pokemon fights bravely but gets overwhelmed. Machamp lets you pass — you proved your courage — but a Pokemon didn't make it.", effects: { pokemonDeath: true, partyDamage: 2 } },
                        { weight: 30, narration: "A grueling fight that leaves both sides damaged. Machamp finally steps aside, breathing hard. You're through, but your team paid the price.", effects: { partyDamage: 3 } }
                    ]
                },
                {
                    text: "Squeeze through the side passage",
                    outcomes: [
                        { weight: 50, narration: "You find a narrow crack in the wall. Your Pokemon squeeze through one by one. It's tight, dark, and your supplies get scraped off — but you make it past the Machamp unscathed.", effects: { food: -5 } },
                        { weight: 30, narration: "The side passage is tighter than it looks. A rockslide catches your team mid-squeeze. Minor injuries, lost supplies, but you're through.", effects: { partyDamageAll: 1, food: -8, pokeballs: -2 } },
                        { weight: 20, narration: "The passage collapses! You barely escape as rocks rain down. Your team takes hits, food and balls scatter into the rubble. But you're past the guardian.", effects: { partyDamageAll: 2, food: -10, pokeballs: -3 } }
                    ]
                }
            ]
        },

        // #28 - The Champion's Ghost (Indigo Plateau)
        {
            id: "champion_ghost",
            type: "story",
            name: "The Champion's Ghost!",
            description: "At the entrance to the Pokemon League, a translucent figure materializes. An old Champion — from a generation long past — stands before you. \"I've watched you, trainer. You've earned the right to be here.\" The ghost smiles. \"Let me give you one last gift. Strength of body... or wisdom of mind. Choose.\"",
            weight: 4,
            oneTime: true,
            locationIds: ["indigo_plateau"],
            minBadges: 8,
            choices: [
                {
                    text: "\"Give me strength.\"",
                    outcomes: [
                        { weight: 50, narration: "The ghost touches your lead Pokemon. A golden light surges through it — muscles tighten, bones harden, resolve deepens. Your Pokemon is PERMANENTLY stronger. The ghost fades with a smile. \"Win it for both of us.\"", effects: { boostPokemonMaxHp: 1, healAll: true } },
                        { weight: 50, narration: "Power floods through your entire team. Every Pokemon stands taller, heals completely. The ghost nods. \"Strength is nothing without the heart to use it. You have both.\" Then it's gone.", effects: { boostPokemonMaxHp: 1, healAll: true } }
                    ]
                },
                {
                    text: "\"Give me wisdom.\"",
                    outcomes: [
                        { weight: 50, narration: "The ghost whispers battle strategies from a bygone era. Your bag fills with supplies — Super Potions, a Rare Candy, knowledge crystallized into items. \"The mind outlasts the body,\" the ghost says. \"Remember that against the Elite Four.\"", effects: { superPotions: 3, rareCandy: 1 } },
                        { weight: 50, narration: "Ancient knowledge pours into you. Your supplies multiply — potions, food, the accumulated wisdom of a Champion's lifetime distilled into resources. \"Wisdom is knowing when NOT to fight,\" the ghost says, fading. \"Good luck.\"", effects: { potions: 3, food: 15, rareCandy: 1 } }
                    ]
                }
            ]
        },
        // ===== SACRIFICE / SOPHIE'S CHOICE EVENTS =====

        // Seafoam Islands - Drowning Rescue
        {
            id: "seafoam_drowning",
            type: "hazard",
            name: "Drowning in the Current!",
            description: "A massive wave crashes through the Seafoam cave! Two of your Pokemon are swept into the raging underground river, clinging to rocks as the freezing current pulls them under. You can only reach one in time. The other will be lost to the sea.",
            weight: 6,
            oneTime: true,
            locationIds: ["seafoam_islands"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "Save the one closest to you",
                    outcomes: [
                        { weight: 100, narration: "You dive in and grab the nearest Pokemon, hauling it to safety. But you can only watch as the current drags the other beneath the waves. It's gone. The cave echoes with silence.", effects: { pokemonDeath: true, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Swim for the one further away",
                    outcomes: [
                        { weight: 60, narration: "You fight the current with everything you have and reach the far Pokemon just in time. But the closer one lost its grip waiting. It slips beneath the water without a sound.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 40, narration: "The current is too strong. You don't reach either in time. One is dragged under. You barely pull yourself and the other to shore, battered and broken.", effects: { pokemonDeath: true, partyDamage: 2 } }
                    ]
                }
            ]
        },

        // Cinnabar Island - Volcano's Edge
        {
            id: "cinnabar_volcano_edge",
            type: "hazard",
            name: "The Volcano's Edge!",
            description: "The ground shakes violently on Cinnabar! A fissure cracks open and two of your Pokemon tumble toward the edge, dangling over a river of molten lava below. The rock is crumbling fast — you can pull one back, but reaching both is impossible.",
            weight: 6,
            oneTime: true,
            locationIds: ["cinnabar_island"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "Grab the one on the left",
                    outcomes: [
                        { weight: 100, narration: "You lunge left and grab hold. The other Pokemon looks at you with understanding as the ledge crumbles beneath it. It falls silently into the lava below. You hold the survivor tight, both trembling.", effects: { pokemonDeath: true, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Grab the one on the right",
                    outcomes: [
                        { weight: 100, narration: "You reach right and pull with all your strength. The rock beneath the other Pokemon gives way instantly — it's gone before you can even scream. The heat from below scorches your entire team.", effects: { pokemonDeath: true, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Try to save both",
                    outcomes: [
                        { weight: 25, narration: "Against all odds, you stretch between them, grabbing one in each hand. Your arms nearly tear from their sockets, but you haul them both back. The fissure seals behind you. A miracle.", effects: { partyDamageAll: 1 } },
                        { weight: 75, narration: "You overreach and the ledge collapses under your weight. You fall, catching one Pokemon, but the other plummets into the lava. The heat blast sears your entire team.", effects: { pokemonDeath: true, partyDamage: 2 } }
                    ]
                }
            ]
        },

        // Mt. Moon - Cave Collapse Sacrifice
        {
            id: "mt_moon_collapse_sacrifice",
            type: "hazard",
            name: "The Cave is Collapsing!",
            description: "A massive cave-in seals the exit! Boulders rain from the ceiling. One of your Pokemon could hold back the rocks long enough for the rest to escape — but it would be crushed. Or you all try to run together, and pray.",
            weight: 5,
            oneTime: true,
            locationIds: ["mt_moon"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "One Pokemon holds the line",
                    outcomes: [
                        { weight: 100, narration: "Your Pokemon braces against the falling stone, roaring with defiance as the rest of you scramble to safety. The tunnel collapses behind you. When the dust settles, there's only silence from the other side. It gave its life for the team.", effects: { pokemonDeath: true } }
                    ]
                },
                {
                    text: "Everyone runs together!",
                    outcomes: [
                        { weight: 30, narration: "You all sprint for it! Rocks crash around you, but somehow everyone makes it through a narrow gap just before the ceiling comes down. Battered, but alive.", effects: { partyDamageAll: 1 } },
                        { weight: 45, narration: "You run, but the slowest Pokemon doesn't make it. A boulder pins it and the tunnel seals. The rest of your team is bruised and bleeding from the debris.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 25, narration: "The collapse is too fast. Rocks crush from every direction. Two of your Pokemon go down before you reach daylight. The survivors are badly hurt.", effects: { pokemonDeath: true, pokemonDeath2: true, partyDamageAll: 1 } }
                    ]
                }
            ]
        },

        // Rock Tunnel - Toxic Gas Sacrifice
        {
            id: "rock_tunnel_gas",
            type: "hazard",
            name: "Toxic Gas Fills the Tunnel!",
            description: "A pocket of poisonous gas erupts from a crack in the tunnel wall! The fumes are spreading fast. You have one Escape Rope — but it can only carry half your team to safety. The others would have to brave the gas.",
            weight: 5,
            oneTime: true,
            locationIds: ["rock_tunnel"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "Use the Escape Rope for half",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 60, narration: "You rope half your team to safety. The others struggle through the gas, choking and stumbling. One doesn't make it out. The gas was too thick.", effects: { escapeRope: -1, pokemonDeath: true } },
                        { weight: 40, narration: "Half your team escapes via rope. The others fight through the poison, barely emerging alive but deeply weakened.", effects: { escapeRope: -1, partyDamage: 3 } }
                    ]
                },
                {
                    text: "Everyone holds their breath and runs",
                    outcomes: [
                        { weight: 25, narration: "You all charge through together, eyes burning, lungs screaming. Somehow everyone makes it to fresh air. Barely.", effects: { partyDamageAll: 1 } },
                        { weight: 50, narration: "The gas is overwhelming. One of your Pokemon collapses and can't be revived. The rest are badly poisoned.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 25, narration: "It's a slaughter. The gas is far worse than you thought. Two Pokemon suffocate before you reach the exit. The survivors wheeze and collapse.", effects: { pokemonDeath: true, pokemonDeath2: true, partyDamageAll: 1 } }
                    ]
                }
            ]
        },

        // Lavender Town - Spirit Possession
        {
            id: "lavender_spirit_choice",
            type: "hazard",
            name: "A Spirit Demands a Host!",
            description: "In the Pokemon Tower, a powerful ghost blocks your path. \"ONE WILL STAY WITH ME,\" it hisses. \"Choose which Pokemon remains... or I take TWO by force.\" The spirit's eyes burn with cold fire. This is no bluff.",
            weight: 5,
            oneTime: true,
            locationIds: ["lavender_town"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Offer one willingly",
                    outcomes: [
                        { weight: 100, narration: "You choose. The spirit wraps around your Pokemon like a cold wind and they fade together into the tower walls. The remaining team shivers. \"A fair trade,\" echoes through the darkness. \"Leave. Now.\"", effects: { pokemonDeath: true } }
                    ]
                },
                {
                    text: "Refuse — fight the spirit!",
                    outcomes: [
                        { weight: 25, narration: "Your team battles the spirit with everything they have! Against all odds, they drive it back into the shadows. But the effort leaves everyone drained.", effects: { partyDamageAll: 1 } },
                        { weight: 50, narration: "You fight, but the spirit is too powerful. It seizes one of your Pokemon and drags it into the walls. Your team takes spiritual damage from the battle.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 25, narration: "The spirit is furious. \"THEN I TAKE WHAT I WANT!\" Two of your Pokemon are pulled screaming into the walls. The rest flee in terror.", effects: { pokemonDeath: true, pokemonDeath2: true } }
                    ]
                },
                {
                    text: "Use Silph Scope to weaken it",
                    requiresKeyItem: "silph_scope",
                    outcomes: [
                        { weight: 70, narration: "The Silph Scope reveals the spirit's true form — a tormented Marowak. It calms, weeping. \"I just miss my child...\" The spirit fades peacefully. Your team is shaken but alive.", effects: { partyDamageAll: 1 } },
                        { weight: 30, narration: "The Silph Scope reveals its form but the spirit resists! It lashes out before fading, injuring your team badly.", effects: { partyDamageAll: 2 } }
                    ]
                }
            ]
        },

        // Viridian Forest - Beedrill Swarm Sacrifice
        {
            id: "viridian_beedrill_swarm",
            type: "hazard",
            name: "Beedrill Swarm!",
            description: "You've stumbled into a massive Beedrill nest! Hundreds of them swarm toward you, stingers gleaming. One of your Pokemon could create a distraction to let the rest escape, but it would be overwhelmed.",
            weight: 6,
            oneTime: true,
            locationIds: ["viridian_forest"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "Send one as a distraction",
                    outcomes: [
                        { weight: 100, narration: "Your Pokemon charges bravely into the swarm, drawing them away with attacks and noise. You hear its cries grow weaker as you flee. By the time the swarm disperses... it's too late. A hero's sacrifice.", effects: { pokemonDeath: true } }
                    ]
                },
                {
                    text: "Everyone runs together!",
                    outcomes: [
                        { weight: 20, narration: "You sprint as a group! The Beedrill give chase but lose interest as you leave their territory. Everyone is stung but alive.", effects: { partyDamageAll: 1 } },
                        { weight: 50, narration: "The swarm descends on your slowest Pokemon. It goes down under a cloud of stingers. The rest of you barely escape, badly stung.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 30, narration: "The swarm is relentless. Two Pokemon are overwhelmed before you escape the forest. Poison courses through the survivors.", effects: { pokemonDeath: true, pokemonDeath2: true, partyDamageAll: 1 } }
                    ]
                }
            ]
        },

        // Power Plant - Electrical Overload
        {
            id: "power_plant_overload",
            type: "hazard",
            name: "Electrical Overload!",
            description: "The Power Plant's generators are going critical! Arcs of electricity leap across the floor. The main circuit breaker is on the far wall — one of your Pokemon could absorb the surge to shut it down, but the voltage would be lethal.",
            weight: 5,
            oneTime: true,
            locationIds: ["power_plant"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "One Pokemon absorbs the surge",
                    outcomes: [
                        { weight: 80, narration: "Your Pokemon grabs the circuit breaker. Electricity engulfs its body — it convulses, screams, and finally goes still as the generators spin down. The lights flicker off. It saved everyone. But it's gone.", effects: { pokemonDeath: true } },
                        { weight: 20, narration: "Your Pokemon grabs the breaker and somehow survives the surge! It's badly burned and barely breathing, but alive. The generators shut down safely.", effects: { partyDamage: 3 } }
                    ]
                },
                {
                    text: "Everyone runs for the exit",
                    outcomes: [
                        { weight: 30, narration: "You all bolt for the door as electricity arcs everywhere. Everyone takes jolts but nobody goes down. Lucky.", effects: { partyDamageAll: 1 } },
                        { weight: 40, narration: "An arc catches one of your Pokemon square in the chest. It drops instantly. The rest of you make it out, tingling and burned.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 30, narration: "The overload cascades. Lightning bounces between your Pokemon like a pinball. Two go down before the breaker trips on its own. The survivors are in shock.", effects: { pokemonDeath: true, pokemonDeath2: true } }
                    ]
                }
            ]
        },

        // Victory Road - Rockslide Gauntlet (rare multi-kill)
        {
            id: "victory_road_gauntlet",
            type: "hazard",
            name: "Victory Road Gauntlet!",
            description: "The final stretch of Victory Road triggers a chain reaction! The ceiling is crumbling, lava seeps through cracks, and a wild Onix rampages through the chaos. This is the road's final test — and it's brutal.",
            weight: 4,
            oneTime: true,
            locationIds: ["victory_road"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "Charge straight through!",
                    outcomes: [
                        { weight: 20, narration: "You run. Your Pokemon shield you with their bodies. Rocks bounce off, lava hisses past, the Onix barely misses. Somehow, impossibly, you all emerge on the other side. Battered beyond belief, but alive. Victory Road earned its name.", effects: { partyDamageAll: 1 } },
                        { weight: 40, narration: "You charge into the chaos. One Pokemon is crushed by a falling boulder. The rest push through, dodging lava and the rampaging Onix. It's hell, but you make it.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 25, narration: "The gauntlet is merciless. Rocks fall. Lava flows. The Onix strikes. Two of your Pokemon don't make it through. You crawl out the other side, clutching the survivors.", effects: { pokemonDeath: true, pokemonDeath2: true, partyDamageAll: 1 } },
                        { weight: 15, narration: "Victory Road shows no mercy. The chain reaction is catastrophic. Three Pokemon are lost — to rocks, to lava, to the Onix. You emerge with barely anyone left, shaking. The Indigo Plateau looms ahead, and you have almost nothing left.", effects: { pokemonDeath: true, pokemonDeath2: true, pokemonDeath3: true, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Take it slow and careful",
                    outcomes: [
                        { weight: 35, narration: "You inch forward carefully, dodging debris and routing around the Onix. It takes ages but your team makes it through in one piece. Barely.", effects: { partyDamageAll: 1, daysLost: 2 } },
                        { weight: 40, narration: "Careful doesn't help when the ceiling collapses. One Pokemon is buried. The rest escape, but the trauma lingers.", effects: { pokemonDeath: true, daysLost: 1 } },
                        { weight: 25, narration: "The road punishes caution too. The Onix finds you hiding and attacks. Two Pokemon fall before you can flee to safety.", effects: { pokemonDeath: true, pokemonDeath2: true } }
                    ]
                }
            ]
        },

        // S.S. Anne - Ship Sinking
        {
            id: "ss_anne_sinking",
            type: "hazard",
            name: "The S.S. Anne is Sinking!",
            description: "An explosion rocks the S.S. Anne! Water floods the lower decks. Two of your Pokemon are trapped in separate compartments — water rushing in fast. You can only pry one door open before the ship goes under.",
            weight: 5,
            oneTime: true,
            locationIds: ["vermilion_city"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "Pry open the left door",
                    outcomes: [
                        { weight: 100, narration: "You wrench the left door open and your Pokemon swims out gasping. From behind the right door, you hear frantic splashing that slowly goes silent. The ship groans and lists. You escape to the deck, one Pokemon fewer.", effects: { pokemonDeath: true, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Pry open the right door",
                    outcomes: [
                        { weight: 100, narration: "The right door gives way and your Pokemon bursts through. Water surges through the left corridor — there's no going back. You swim for the surface knowing one of your team is still down there. Gone.", effects: { pokemonDeath: true, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Use Surf to flood both rooms equally",
                    bonusAbility: "surf",
                    bonusOutcome: { narration: "Your Surf Pokemon creates a controlled current, equalizing the pressure on both doors! They burst open simultaneously. Everyone swims to safety — soaked and terrified, but alive.", effects: { partyDamageAll: 1 } },
                    outcomes: [
                        { weight: 100, narration: "Without a Surf Pokemon, the water wins. You manage to open one door but the other is sealed by pressure. One Pokemon is lost to the deep.", effects: { pokemonDeath: true, partyDamageAll: 1 } }
                    ]
                }
            ]
        },

        // Safari Zone - Stampede
        {
            id: "safari_stampede",
            type: "hazard",
            name: "Safari Zone Stampede!",
            description: "A herd of Tauros stampedes through the Safari Zone! Your team is directly in their path. You could shield your team behind a single Pokemon to absorb the charge, or scatter and hope for the best.",
            weight: 5,
            oneTime: true,
            locationIds: ["fuchsia_city"],
            requiresPartySize: 3,
            choices: [
                {
                    text: "One Pokemon stands as a shield",
                    outcomes: [
                        { weight: 70, narration: "Your Pokemon stands its ground as the Tauros herd crashes over it like a wave. The rest of your team shelters behind its body. When the dust clears... the shield Pokemon is gone. Trampled flat. But everyone else is alive.", effects: { pokemonDeath: true } },
                        { weight: 30, narration: "Incredibly, your Pokemon holds! The Tauros part around it like water around a rock. It's battered beyond belief, but still breathing. A true tank.", effects: { partyDamage: 3 } }
                    ]
                },
                {
                    text: "SCATTER!",
                    outcomes: [
                        { weight: 25, narration: "Everyone dives in different directions! The Tauros thunder past, missing everyone by inches. Hearts pounding, your team regroups. All present and accounted for.", effects: { partyDamageAll: 1 } },
                        { weight: 45, narration: "Most of your team dodges, but one isn't fast enough. The herd runs it down. The rest are bruised from diving into rocks and trees.", effects: { pokemonDeath: true, partyDamageAll: 1 } },
                        { weight: 30, narration: "Scattering was a mistake. The herd splits and catches Pokemon on both flanks. Two go down under thundering hooves. The survivors limp together, bloodied and grieving.", effects: { pokemonDeath: true, pokemonDeath2: true } }
                    ]
                }
            ]
        }
        // ===== DILEMMA EVENTS =====
        ,{
            id: "daycare_dilemma",
            type: "story",
            name: "The Daycare Couple!",
            description: "The Daycare couple blocks the road. \"We're overworked and our Pokemon are restless! We'll train one of yours to full evolution — but it'll take 3 days. OR, we can give your whole team a quick boost right now, but no evolution.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["cerulean_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Leave one to evolve (lose 3 days)",
                    outcomes: [
                        { weight: 70, narration: "Three days later, you return. Your Pokemon has evolved! The Daycare couple wave goodbye with tired smiles.", effects: { daysLost: 3, trainPokemon: true } },
                        { weight: 30, narration: "Three days later, your Pokemon evolved — but it also picked up some bad habits at the Daycare. It seems roughed up.", effects: { daysLost: 3, trainPokemon: true, partyDamage: 1 } }
                    ]
                },
                {
                    text: "Quick boost for everyone",
                    outcomes: [
                        { weight: 60, narration: "The couple feeds your team rare vitamins. Everyone feels stronger!", effects: { boostPokemonMaxHp: 1, healAll: true } },
                        { weight: 40, narration: "The couple's care revitalizes your team. Full health and some extra food for the road!", effects: { healAll: true, food: 10 } }
                    ]
                }
            ]
        },
        {
            id: "stranded_swimmer",
            type: "story",
            name: "Stranded Swimmer!",
            description: "A swimmer clings to a rock in the freezing current, blue-lipped and shaking. \"Help me! I'll give you everything I have!\" But the current is brutal — rescuing them will hurt your team. You could also just take the long way around.",
            weight: 7,
            oneTime: true,
            locationIds: ["seafoam_islands"],
            choices: [
                {
                    text: "Rescue the swimmer",
                    bonusAbility: "surf",
                    outcomes: [
                        { weight: 40, narration: "Your team braves the current and pulls the swimmer to safety. He's a diver — he gives you a rare Staryu and his emergency supplies. Your team is battered but alive.", effects: { partyDamageAll: 1, catchPokemon: 120, potions: 3 } },
                        { weight: 35, narration: "You save the swimmer, but the current smashes your team against the rocks. He thanks you profusely and gives you everything he has.", effects: { partyDamage: 3, money: 1500, food: 15 } },
                        { weight: 25, narration: "The rescue goes badly. A Pokemon is swept away and doesn't come back. The swimmer weeps. \"I'm so sorry...\"", effects: { pokemonDeath: true, money: 2000, superPotions: 3 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Water-type ferries the swimmer to safety with ease! He's a professional diver and gives you his prized Staryu and supplies.", effects: { catchPokemon: 120, potions: 3, money: 800 } }
                },
                {
                    text: "Throw an Escape Rope",
                    requiresItem: "escapeRope",
                    outcomes: [
                        { weight: 100, narration: "You throw the Escape Rope to the swimmer. He grabs it and you haul him in. \"Thank you! Here, take this.\"", effects: { escapeRope: -1, money: 800, potions: 2 } }
                    ]
                },
                {
                    text: "Keep moving (leave him)",
                    outcomes: [
                        { weight: 70, narration: "You look away and keep walking. His cries echo behind you. You try not to think about it.", effects: {} },
                        { weight: 30, narration: "You walk past. Guilt gnaws at your team. Morale drops.", effects: { partyDamage: 1 } }
                    ]
                }
            ]
        },
        {
            id: "power_plant_meltdown",
            type: "hazard",
            name: "Power Plant Meltdown!",
            description: "The Vermilion Power Plant alarms are blaring! An engineer screams: \"The Voltorb containment failed! If they self-destruct, the whole plant goes! We need someone to absorb the blast — or we evacuate and lose the plant's supplies!\"",
            weight: 6,
            oneTime: true,
            locationIds: ["vermilion_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Send your team to contain it",
                    bonusAbility: "flash",
                    outcomes: [
                        { weight: 35, narration: "Your team absorbs the Voltorb explosions! The plant is saved. The engineer rewards you handsomely, but your team is in rough shape.", effects: { partyDamageAll: 2, money: 2000, superPotions: 3, catchPokemon: 100 } },
                        { weight: 35, narration: "The explosions are devastating. Your team barely holds. One Pokemon takes the worst of it. But the plant survives.", effects: { partyDamage: 3, money: 2500, potions: 5 } },
                        { weight: 30, narration: "Too many Voltorb. The chain reaction can't be stopped. One of your Pokemon shields the others and doesn't make it. The engineer weeps.", effects: { pokemonDeath: true, money: 3000, superPotions: 5 } }
                    ],
                    bonusOutcome: { weight: 100, narration: "Your Electric-type speaks the Voltorb's language! It calms them down one by one. Crisis averted — no damage to anyone.", effects: { money: 2000, superPotions: 3, rareCandy: 1 } }
                },
                {
                    text: "Evacuate (grab supplies and run)",
                    outcomes: [
                        { weight: 60, narration: "You grab what you can and run. The plant explodes behind you. Supplies scatter everywhere — you snatch some mid-sprint.", effects: { pokeballs: 5, potions: 3, food: 10 } },
                        { weight: 40, narration: "Evacuation is chaos. You grab some supplies but the blast wave hits your team.", effects: { partyDamageAll: 1, pokeballs: 3, food: 5 } }
                    ]
                }
            ]
        },
        {
            id: "pokeflute_busker",
            type: "story",
            name: "The Pokeflute Player!",
            description: "A gaunt musician plays a Pokeflute on the steps of Pokemon Tower. \"This melody can wake any sleeping Pokemon... or put one to sleep forever. I'll sell it for $1000, or I'll play a healing song for your team right now — for free. But the Flute leaves with me.\"",
            weight: 7,
            oneTime: true,
            locationIds: ["lavender_town"],
            choices: [
                {
                    text: "Buy the Pokeflute ($1000)",
                    requiresMoney: 1000,
                    outcomes: [
                        { weight: 100, narration: "The musician hands over the Pokeflute with a sad smile. \"Take care of it. It belonged to someone who loved Pokemon more than life.\" You now have the Poke Flute.", effects: { money: -1000, keyItem: "Poke Flute" } }
                    ]
                },
                {
                    text: "Take the free healing song",
                    outcomes: [
                        { weight: 70, narration: "The melody washes over your team. Every wound closes, every ailment fades. Your Pokemon look renewed.", effects: { healAll: true, boostPokemonMaxHp: 1 } },
                        { weight: 30, narration: "The song heals your team completely. As the musician leaves, one of your Pokemon cries after him.", effects: { healAll: true } }
                    ]
                },
                {
                    text: "\"I don't need either.\"",
                    outcomes: [
                        { weight: 100, narration: "The musician shrugs and keeps playing. The tower's ghosts seem to sway to the tune.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "cinnabar_gene_splice",
            type: "special",
            name: "Dr. Fuji's Experiment!",
            description: "In the ruins of the Pokemon Mansion, you find Dr. Fuji's old gene-splicing lab still powered on. A recording plays: \"This machine can permanently enhance a Pokemon's vitality — but the process is painful. I abandoned this research for good reason.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["cinnabar_island"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Use the machine on a Pokemon",
                    outcomes: [
                        { weight: 40, narration: "The machine hums and your Pokemon screams — then emerges stronger than ever. Its cells have been permanently enhanced.", effects: { boostPokemonMaxHp: 2 } },
                        { weight: 35, narration: "Something goes wrong. The enhancement works, but the process damages another Pokemon who was too close.", effects: { boostPokemonMaxHp: 2, partyDamage: 2 } },
                        { weight: 25, narration: "Catastrophic failure. The machine sparks and explodes. One Pokemon's cellular structure degrades permanently. Dr. Fuji abandoned this for a reason.", effects: { reducePokemonMaxHp: 2, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Scavenge the lab for supplies",
                    outcomes: [
                        { weight: 50, narration: "You find old potions, Rare Candy, and research notes worth selling.", effects: { superPotions: 3, rareCandy: 1, money: 500 } },
                        { weight: 50, narration: "Old lab supplies — mostly expired, but some are still good.", effects: { potions: 4, money: 300 } }
                    ]
                },
                {
                    text: "Destroy the machine",
                    outcomes: [
                        { weight: 100, narration: "You smash the controls. Sparks fly, then silence. Some things are better left buried. You feel a weight lift.", effects: { healAll: true } }
                    ]
                }
            ]
        },
        {
            id: "fighting_dojo_choice",
            type: "special",
            name: "The Fighting Dojo!",
            description: "The Karate Master bows. \"You've proven yourself, trainer. Choose your reward: Hitmonlee, the kicking fiend — or Hitmonchan, the punching demon. I can only part with one.\"",
            weight: 8,
            oneTime: true,
            locationIds: ["saffron_city"],
            minBadges: 3,
            choices: [
                {
                    text: "Choose Hitmonlee (Fighting, Strength)",
                    outcomes: [
                        { weight: 100, narration: "\"Hitmonlee's legs can stretch to kick from any distance. Train it well.\" Hitmonlee joins your team!", effects: { catchPokemon: 106 } }
                    ]
                },
                {
                    text: "Choose Hitmonchan (Fighting, Guard)",
                    outcomes: [
                        { weight: 100, narration: "\"Hitmonchan's fists move faster than the eye can follow. A true boxer's Pokemon.\" Hitmonchan joins your team!", effects: { catchPokemon: 107 } }
                    ]
                },
                {
                    text: "\"I'm not worthy yet.\"",
                    outcomes: [
                        { weight: 100, narration: "The Karate Master smiles. \"Humility is strength. Take these instead.\"", effects: { superPotions: 2, food: 10 } }
                    ]
                }
            ]
        },

        // ===== TRADE EVENTS =====
        {
            id: "trade_pewter_collector",
            type: "trade",
            name: "Rock Collector's Offer!",
            description: "A grizzled collector outside the Pewter Museum eyes your team. \"I've got an Onix that's outgrown my house. Literally. I'll trade it for any Pokemon you've got — I just need a new companion. Onix is tough, knows these caves inside out.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["pewter_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Trade a Pokemon for Onix",
                    outcomes: [
                        { weight: 100, narration: "The collector examines your Pokemon gently, then hands you Onix's Poke Ball. \"Take good care of the big fella. He likes to be scratched under the chin... all 28 feet of it.\"", effects: { pokemonTrade: 95 } }
                    ]
                },
                {
                    text: "\"No thanks, I'm attached to my team.\"",
                    outcomes: [
                        { weight: 100, narration: "\"I understand. A trainer's bond is sacred.\" He tips his hat and returns to polishing rocks.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "trade_vermilion_sailor",
            type: "trade",
            name: "Sailor's Farfetch'd!",
            description: "A sailor on the docks holds a Farfetch'd that keeps whacking him with its leek. \"OW! I can't take this bird anymore! It won't listen to me! I'll trade it for ANY Pokemon. Please. I'm desperate.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["vermilion_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Trade a Pokemon for Farfetch'd",
                    outcomes: [
                        { weight: 70, narration: "The sailor practically throws the Poke Ball at you. Farfetch'd eyes you suspiciously, then taps you with its leek — gently. A test. You passed.", effects: { pokemonTrade: 83 } },
                        { weight: 30, narration: "The trade is done. The sailor sprints away before you can change your mind. Farfetch'd stares at you, leek raised. Temperamental, but loyal to those who earn it.", effects: { pokemonTrade: 83 } }
                    ]
                },
                {
                    text: "\"That bird looks like trouble.\"",
                    outcomes: [
                        { weight: 100, narration: "\"You're smarter than you look, kid.\" The sailor winces as Farfetch'd whacks him again. \"OW!\"", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "trade_celadon_breeder",
            type: "trade",
            name: "Pokemon Breeder's Offer!",
            description: "A Pokemon Breeder in the Celadon gardens cradles a Growlithe puppy. \"I breed these beauties, but I've got too many. This one's special — strong stock, loyal temperament. I'd trade her for one of yours. I like variety in my kennel.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["celadon_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Trade a Pokemon for Growlithe",
                    outcomes: [
                        { weight: 100, narration: "The breeder inspects your offered Pokemon carefully, then nods. \"Good stock.\" The Growlithe puppy wags its tail and immediately nuzzles against you. It can evolve into Arcanine — one of the strongest Fire-types in Kanto.", effects: { pokemonTrade: 58 } }
                    ]
                },
                {
                    text: "\"She's cute, but I can't part with anyone.\"",
                    outcomes: [
                        { weight: 80, narration: "The breeder nods understandingly. \"Bond with your team. That's what matters.\"", effects: {} },
                        { weight: 20, narration: "\"Well, take some food for the road at least.\" The breeder hands you some Pokemon treats.", effects: { food: 5 } }
                    ]
                }
            ]
        },
        {
            id: "trade_fuchsia_warden",
            type: "trade",
            name: "Warden's Rhyhorn!",
            description: "The Safari Zone Warden finds you outside the gates. \"My Rhyhorn pen is overcrowded! These beasts eat more than a Snorlax. Trade me one of your Pokemon — I need something that fits in my office — and you can have a Rhyhorn. They're tough as nails.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["fuchsia_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Trade a Pokemon for Rhyhorn",
                    outcomes: [
                        { weight: 100, narration: "The Warden examines your Pokemon, then bellows a laugh. \"Perfect! Much more manageable!\" He leads a Rhyhorn over — it snorts and stamps impatiently. \"She's feisty. Evolves into Rhydon if you treat her right.\"", effects: { pokemonTrade: 111 } }
                    ]
                },
                {
                    text: "\"I'll pass for now.\"",
                    outcomes: [
                        { weight: 100, narration: "The Warden sighs and trudges back to the pen, where several Rhyhorn are headbutting the fence.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "trade_saffron_psychic",
            type: "trade",
            name: "Psychic's Abra!",
            description: "A young psychic outside Sabrina's gym holds an Abra that keeps teleporting out of her hands. \"I've raised six of these and I'm going insane! This one has incredible potential — evolves into Alakazam. But I need a Pokemon that actually STAYS in one place. Trade me?\"",
            weight: 6,
            oneTime: true,
            locationIds: ["saffron_city"],
            requiresPartySize: 2,
            choices: [
                {
                    text: "Trade a Pokemon for Abra",
                    outcomes: [
                        { weight: 70, narration: "The Abra teleports into your arms mid-trade. The psychic sighs with relief. \"It already likes you more than me. It'll evolve into something extraordinary if you can keep it alive.\"", effects: { pokemonTrade: 63 } },
                        { weight: 30, narration: "The trade completes. Abra immediately teleports to your shoulder and falls asleep. The psychic mutters, \"Good riddance.\" Abra's evolution line is one of the strongest in Kanto.", effects: { pokemonTrade: 63 } }
                    ]
                },
                {
                    text: "\"I've got enough to manage.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Smart. These things are a nightmare.\" The Abra teleports onto the psychic's head. She screams.", effects: {} }
                    ]
                }
            ]
        },

        // ===== STORY EVENTS =====
        {
            id: "bill_teleporter",
            type: "story",
            name: "Bill's Experiment!",
            description: "The famous Pokemon researcher Bill is fused with a Clefairy after a teleporter accident! \"Please! Hit the button on the other machine to separate us! I'll reward you — but the machine has been acting strange. There's a small chance it could... affect your team.\"",
            weight: 7,
            oneTime: true,
            locationIds: ["cerulean_city"],
            choices: [
                {
                    text: "Help Bill (use the machine)",
                    outcomes: [
                        { weight: 50, narration: "The machine whirs, flashes — and Bill stumbles out, human again. \"Thank you! Here, take this S.S. Anne ticket, and I insist you take a Clefairy. The heal ability can save your life on the road.\"", effects: { catchPokemon: 35, money: 500 } },
                        { weight: 30, narration: "Success! Bill is separated. He's so grateful he gives you rare supplies and tips about Kanto's secrets.", effects: { rareCandy: 1, money: 1000, food: 10 } },
                        { weight: 20, narration: "The machine malfunctions mid-separation! Bill is fine, but the energy surge hits your team. Bill is mortified. \"I'm so sorry! Here, take everything I have.\"", effects: { partyDamageAll: 1, rareCandy: 2, money: 1500 } }
                    ]
                },
                {
                    text: "\"I'm not touching that machine.\"",
                    outcomes: [
                        { weight: 100, narration: "Bill's Clefairy ears droop. \"I understand... I'll figure it out myself.\" You hear an explosion as you leave. Probably fine.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "ghost_trainer_lament",
            type: "story",
            name: "The Forgotten Trainer!",
            description: "In Pokemon Tower, you find a journal beside a faded trainer card. The last entry reads: \"Day 47. Out of food. Team is gone. If anyone finds this — my last Pokemon is still loyal. She waits at the top of the tower. Please take care of her.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["lavender_town"],
            choices: [
                {
                    text: "Climb to find the Cubone",
                    outcomes: [
                        { weight: 50, narration: "You find the Cubone at the top, still guarding its trainer's bag. It looks up at you with hollow eyes, then slowly approaches. It joins your team. The bag contains the trainer's last supplies.", effects: { catchPokemon: 104, food: 8, potions: 2 } },
                        { weight: 30, narration: "The Cubone is hostile at first — it attacks! But after a brief struggle, it follows you, clutching its bone. The trainer's bag has a few items.", effects: { partyDamage: 1, catchPokemon: 104, potions: 1 } },
                        { weight: 20, narration: "You reach the top. The Cubone is there, but so are ghosts — furious at the intrusion. You grab the Cubone and run.", effects: { catchPokemon: 104, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Leave the journal as a memorial",
                    outcomes: [
                        { weight: 60, narration: "You place the trainer card back respectfully. The tower grows quieter, as if the spirits acknowledge your respect. You feel at peace.", effects: { healAll: true } },
                        { weight: 40, narration: "As you set the journal down, a chill passes through you. A ghostly voice whispers, \"Thank you.\" A Rare Candy materializes where the journal lay.", effects: { rareCandy: 1 } }
                    ]
                }
            ]
        },
        {
            id: "old_man_last_lesson",
            type: "story",
            name: "The Old Man's Last Lesson!",
            description: "The old man who taught you how to catch Pokemon sits by the road, looking frail. \"I used to be a champion, long time ago. My last Pokemon passed last winter.\" He coughs. \"I can train your team — but it'll take 2 days. Or I can just tell you stories. The stories of a champion are worth something too.\"",
            weight: 5,
            oneTime: true,
            locationIds: ["viridian_city"],
            choices: [
                {
                    text: "\"Teach my team.\" (Lose 2 days)",
                    outcomes: [
                        { weight: 50, narration: "The old man spends two days drilling your team mercilessly. He may be frail, but his battle knowledge is legendary. Your team evolves under his guidance.", effects: { daysLost: 2, trainPokemon: true, boostPokemonMaxHp: 1 } },
                        { weight: 50, narration: "Two days of grueling training. The old man pushes your team to its limits. They're exhausted but fundamentally stronger.", effects: { daysLost: 2, trainPokemon: true } }
                    ]
                },
                {
                    text: "\"Tell me your stories.\"",
                    outcomes: [
                        { weight: 40, narration: "He talks for hours about the old days — strategies, hidden paths, the secret of the Elite Four. His words are worth more than any item.", effects: { food: 10, money: 500 } },
                        { weight: 30, narration: "\"The trick to Victory Road,\" he says, leaning close, \"is that it's not about strength. It's about not dying.\" He gives you his emergency supplies.", effects: { superPotions: 3, escapeRope: 2 } },
                        { weight: 30, narration: "He tells you about a secret: a rare candy hidden in every major city if you know where to look. Then he falls asleep mid-sentence.", effects: { rareCandy: 1 } }
                    ]
                }
            ]
        },

        // ===== BATTLE STAR EVENTS =====
        {
            id: "dojo_master",
            type: "dilemma",
            name: "The Wandering Dojo Master!",
            description: "A weathered martial artist stands in a clearing, surrounded by defeated wild Pokemon. \"I travel Kanto seeking worthy trainers. Show me your strongest — if they impress me, I'll teach them the way of the warrior.\"",
            weight: 6,
            oneTime: false,
            minDay: 8,
            choices: [
                {
                    text: "Accept his challenge",
                    eventBattle: {
                        pool: "fighting_wild",
                        difficulty: "hard",
                        trainerName: "Dojo Master",
                        winNarration: "The master bows deeply. \"Excellent form. Your Pokemon has true fighting spirit.\" He spends hours honing their battle instincts.",
                        lossNarration: "\"Not yet ready,\" the master says. \"But defeat is a teacher too.\"",
                        winEffects: { grantStar: true },
                        lossEffects: { partyDamage: 1 }
                    }
                },
                {
                    text: "\"We'll pass, thanks.\"",
                    outcomes: [
                        { weight: 100, narration: "The master nods. \"The wise trainer knows when to fight and when to walk away.\" He returns to his meditation.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "victory_road_trial",
            type: "story",
            name: "The Victory Road Trial!",
            description: "Deep in a mountain cave, you find an ancient stone altar covered in claw marks from generations of powerful Pokemon. An inscription reads: \"Those who survive the trial of endurance emerge stronger.\" The cave rumbles ominously.",
            weight: 5,
            oneTime: true,
            minDay: 15,
            choices: [
                {
                    text: "Take the trial",
                    outcomes: [
                        { weight: 50, narration: "The cave collapses around you! Your team fights through falling rocks and wild Onix. They emerge battered but battle-hardened — true veterans.", effects: { partyDamage: 2, grantStar: true } },
                        { weight: 30, narration: "Wild Pokemon attack from all sides! Your team barely makes it through, but the experience forges them into seasoned fighters.", effects: { partyDamage: 1, grantStar: true } },
                        { weight: 20, narration: "The trial is brutal. Rocks fall and wild Pokemon swarm. Your team suffers heavy injuries pushing through.", effects: { partyDamage: 3 } }
                    ]
                },
                {
                    text: "Leave it alone",
                    outcomes: [
                        { weight: 100, narration: "You back away from the altar. Some things are better left undisturbed.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "retired_ace_trainer",
            type: "story",
            name: "The Retired Ace Trainer!",
            description: "A former Ace Trainer sits by a campfire, polishing old badges. \"I used to be #3 in all of Kanto. My training days are over, but I can still teach a thing or two. It won't be easy though — real training never is.\"",
            weight: 6,
            oneTime: false,
            minDay: 10,
            choices: [
                {
                    text: "\"Train my team!\" (Costs $500)",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 60, narration: "The Ace Trainer runs brutal drills until sundown. Your Pokemon are exhausted, but one of them breaks through to a new level of strength.", effects: { money: -500, grantStar: true } },
                        { weight: 40, narration: "The training is intense. Your team improves overall, but nobody quite reaches that breakthrough moment. \"Come back when they're ready,\" she says.", effects: { money: -500, food: 5 } }
                    ]
                },
                {
                    text: "\"Any tips for free?\"",
                    outcomes: [
                        { weight: 60, narration: "She laughs. \"Free advice? Fine — stock up on potions before Victory Road. That one's free.\" She tosses you a spare.", effects: { potions: 2 } },
                        { weight: 40, narration: "\"Nothing in life is free, kid.\" She turns back to her badges.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "wild_tournament",
            type: "combat",
            name: "The Underground Pokemon Tournament!",
            description: "You stumble upon a secret underground tournament. Trainers from all over Kanto have gathered. \"Entry fee is $300,\" says the organizer. \"Winner takes glory and their Pokemon gets recognized as a true champion fighter.\"",
            weight: 5,
            oneTime: false,
            minDay: 12,
            choices: [
                {
                    text: "Enter the tournament ($300)",
                    requiresMoney: 300,
                    eventBattle: {
                        pool: "trainer_battle",
                        difficulty: "hard",
                        trainerName: "Tournament Fighter",
                        winNarration: "Your Pokemon dominates the bracket! The crowd erupts. Your fighter is recognized as a tournament champion — a true battle-tested warrior.",
                        lossNarration: "A tough loss in the semi-finals. The crowd groans. \"Better luck next time, kid.\"",
                        winEffects: { money: 400, grantStar: true },
                        lossEffects: { money: -300, partyDamage: 1 }
                    }
                },
                {
                    text: "Watch from the crowd",
                    outcomes: [
                        { weight: 70, narration: "You watch some incredible battles. Studying the techniques gives you ideas for your own team.", effects: { money: -50 } },
                        { weight: 30, narration: "You spot a trainer drop some cash in the chaos. Finders keepers.", effects: { money: 100 } }
                    ]
                }
            ]
        },
        {
            id: "legendary_shrine",
            type: "story",
            name: "The Shrine of Trials!",
            description: "Hidden behind a waterfall, an ancient shrine glows with mysterious energy. Stone carvings depict Pokemon growing stronger through sacrifice. An offering bowl sits before the shrine — it seems to want food.",
            weight: 4,
            oneTime: true,
            minDay: 10,
            choices: [
                {
                    text: "Offer 20 food to the shrine",
                    requiresItem: "food",
                    outcomes: [
                        { weight: 70, narration: "The shrine erupts with light! Ancient energy flows through your team. One of your Pokemon absorbs it fully — their battle instincts sharpen to a razor's edge.", effects: { food: -20, grantStar: true } },
                        { weight: 30, narration: "The shrine glows briefly, then fades. The energy heals your team and blesses your journey, but the ancient power wasn't quite enough for a breakthrough.", effects: { food: -20, healAll: true, money: 200 } }
                    ]
                },
                {
                    text: "Pray without offering",
                    outcomes: [
                        { weight: 50, narration: "A warm light washes over your team. You feel refreshed.", effects: { healOne: true } },
                        { weight: 50, narration: "Nothing happens. The shrine seems to be waiting for something more.", effects: {} }
                    ]
                }
            ]
        },

        // ===== VICTORY ROAD EVENTS =====
        {
            id: "vr_fallen_trainer",
            type: "discovery",
            name: "Fallen Trainer's Camp",
            description: "You stumble across an abandoned campsite. A trainer's bag lies open — they clearly left in a hurry. Scratch marks line the walls. Whatever happened here, they didn't make it to the end.",
            weight: 10,
            oneTime: false,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Search the camp for supplies",
                    outcomes: [
                        { weight: 40, narration: "You find a stash of food and some potions tucked behind a rock. This trainer was well-prepared... just not prepared enough.", effects: { food: 12, potions: 2 } },
                        { weight: 30, narration: "The bag has some food left and a few Poke Balls. Better than nothing.", effects: { food: 8, pokeballs: 3 } },
                        { weight: 20, narration: "Mostly empty. You find a bit of food and some spare change.", effects: { food: 5, money: 100 } },
                        { weight: 10, narration: "As you reach into the bag, a wild Golbat screeches from the darkness! It attacks!", effects: { partyDamage: 1, food: 3 } }
                    ]
                },
                {
                    text: "Leave it. Bad luck to loot the fallen.",
                    outcomes: [
                        { weight: 100, narration: "You walk past the camp. Some things aren't worth the risk. Your Pokemon seem to respect the decision.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "vr_underground_stream",
            type: "discovery",
            name: "Underground Stream!",
            description: "The sound of rushing water echoes through the cave. You discover a hidden underground stream — clean, cold water flows through the rock. Berries grow along the banks, nourished by the moisture.",
            weight: 8,
            oneTime: true,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Rest and forage by the stream",
                    outcomes: [
                        { weight: 60, narration: "Your team rests by the water. The berries are surprisingly nutritious. A rare oasis in this brutal cave.", effects: { food: 15, healAll: true } },
                        { weight: 40, narration: "The berries are plentiful and your Pokemon drink deeply. You gather as much as you can carry.", effects: { food: 20 } }
                    ]
                },
                {
                    text: "Fill up quickly and keep moving",
                    outcomes: [
                        { weight: 100, narration: "You grab what you can and press on. No time to waste — the exit has to be close.", effects: { food: 8 } }
                    ]
                }
            ]
        },
        {
            id: "vr_rival_campfire",
            type: "story",
            name: "Rival's Campfire",
            description: "A small fire flickers ahead. It's your rival, sitting alone in the dark. For once, he doesn't look cocky. \"Brutal in here, isn't it? I've lost two Pokemon already.\" He looks at your team. \"...You want to share my fire for a bit? I've got food.\"",
            weight: 8,
            oneTime: true,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Sit and share the fire",
                    outcomes: [
                        { weight: 70, narration: "You sit together in silence, sharing food. For the first time, your rival feels like a friend. \"See you at the top,\" he says as you leave. Your Pokemon seem calmer.", effects: { food: 10, healAll: true } },
                        { weight: 30, narration: "You share a meal. \"Here, take some of my supplies. I packed too much anyway.\" A rare moment of generosity from your rival.", effects: { food: 15, potions: 1 } }
                    ]
                },
                {
                    text: "Challenge him to a battle",
                    eventBattle: {
                        pool: "ace_trainer",
                        difficulty: "hard",
                        trainerName: "Rival",
                        winNarration: "Your rival grins despite losing. \"Still got it. Here — you earned this.\" He hands you supplies.",
                        lossNarration: "\"I'll see you at the League... if you make it.\" He packs up and disappears into the dark.",
                        winEffects: { money: 800, food: 8, grantStar: true },
                        lossEffects: { food: -5 }
                    }
                }
            ]
        },
        {
            id: "vr_cave_in",
            type: "combat",
            name: "Cave-In!",
            description: "The ground trembles violently. Rocks crash down from the ceiling! The path ahead is collapsing — you need to move NOW!",
            weight: 10,
            oneTime: false,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Sprint through the falling rocks!",
                    outcomes: [
                        { weight: 40, narration: "You dash through the chaos! Rocks slam down around you but your team makes it through unscathed. Barely.", effects: {} },
                        { weight: 35, narration: "A boulder clips one of your Pokemon as you run! You make it through, but not unharmed.", effects: { partyDamage: 1 } },
                        { weight: 25, narration: "The collapse is massive. Your team is battered by debris, but you're alive.", effects: { partyDamage: 2 } }
                    ]
                },
                {
                    text: "Shield your Pokemon and wait it out",
                    outcomes: [
                        { weight: 50, narration: "You hunker down and protect your team. The collapse subsides. You lost some time but everyone's safe.", effects: { daysLost: 1 } },
                        { weight: 30, narration: "The rocks keep falling longer than expected. Dust fills the air. A day lost, and some food buried under rubble.", effects: { daysLost: 1, food: -5 } },
                        { weight: 20, narration: "You shield your team well. When the dust clears, you spot supplies from another trainer buried in the debris.", effects: { daysLost: 1, food: 6, potions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "vr_veteran_trainer",
            type: "combat",
            name: "Victory Road Veteran!",
            description: "A grizzled trainer blocks the narrow path. Battle scars mark his face. \"I've been waiting here for twenty years. Nobody passes without proving themselves. Show me what you've got, kid.\"",
            weight: 8,
            oneTime: true,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Accept his challenge",
                    eventBattle: {
                        pool: "ace_trainer",
                        difficulty: "hard",
                        trainerName: "Veteran Drake",
                        winNarration: "The veteran smiles for the first time in years. \"You remind me of the Champion when he first came through. Take these — you'll need them.\"",
                        lossNarration: "\"Not ready. Come back when you are.\" He turns his back on you.",
                        winEffects: { money: 1000, superPotions: 3, food: 10, grantStar: true },
                        lossEffects: { partyDamage: 1 }
                    }
                },
                {
                    text: "\"I need to conserve my strength for the E4.\"",
                    outcomes: [
                        { weight: 60, narration: "The veteran nods slowly. \"Smart. Knowing when not to fight is a skill too.\" He steps aside.", effects: {} },
                        { weight: 40, narration: "\"Wise choice. Take this for the road.\" He tosses you a ration pack.", effects: { food: 5 } }
                    ]
                }
            ]
        },
        {
            id: "vr_fossil_cache",
            type: "discovery",
            name: "Ancient Fossil Cache!",
            description: "Deep in the cave, the walls glitter with embedded fossils and crystals. A section of the wall has crumbled, revealing what looks like an ancient offering site. Old Poke Balls and supplies sit untouched for centuries.",
            weight: 6,
            oneTime: true,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Carefully excavate the cache",
                    outcomes: [
                        { weight: 50, narration: "You extract supplies carefully from the ancient site. Whoever left these here wanted future trainers to find them.", effects: { food: 10, superPotions: 2, greatballs: 3 } },
                        { weight: 30, narration: "The fossils are worthless, but the supplies are still good. A generous haul!", effects: { food: 12, potions: 3, money: 500 } },
                        { weight: 20, narration: "As you reach in, the wall shifts! Debris falls, but you grab what you can.", effects: { food: 6, partyDamage: 1 } }
                    ]
                },
                {
                    text: "Take only what you need",
                    outcomes: [
                        { weight: 100, narration: "You grab a few essentials and leave the rest for the next trainer who needs it.", effects: { food: 6, potions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "vr_moltres_shadow",
            type: "story",
            name: "Shadow in the Flames!",
            description: "A searing heat fills the cavern. Through a crack in the rock, you glimpse a massive winged silhouette wreathed in fire. Moltres. It hasn't noticed you — but its presence warms the entire chamber. Your Pokemon are drawn to the heat.",
            weight: 5,
            oneTime: true,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Bask in the warmth silently",
                    outcomes: [
                        { weight: 70, narration: "The legendary fire washes over your team like a blessing. Your Pokemon feel invigorated, their wounds soothed by the sacred heat. Moltres takes flight, disappearing into the mountain.", effects: { healAll: true } },
                        { weight: 30, narration: "Moltres's flame is rejuvenating. Your whole party feels renewed. A once-in-a-lifetime moment.", effects: { healAll: true, food: 5 } }
                    ]
                },
                {
                    text: "Try to get closer",
                    outcomes: [
                        { weight: 40, narration: "You inch forward. Moltres turns its piercing gaze on you — but doesn't attack. It lets out a cry that shakes the cave, then soars away. The heat lingers, healing your team.", effects: { healAll: true } },
                        { weight: 60, narration: "Too close! Moltres shrieks and a blast of fire scorches the cavern before it vanishes. Your team takes the heat.", effects: { partyDamage: 2 } }
                    ]
                }
            ]
        },
        {
            id: "vr_darkness_maze",
            type: "dilemma",
            name: "The Darkness Splits!",
            description: "The path forks into two tunnels. The left tunnel has fresh air flowing through it — a good sign. The right tunnel is warmer but you hear distant Pokemon cries echoing from within. Both could lead forward... or to a dead end.",
            weight: 10,
            oneTime: false,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Take the left tunnel (fresh air)",
                    outcomes: [
                        { weight: 50, narration: "The fresh air leads to a wide chamber. You find an old supply cache left by previous challengers!", effects: { food: 8, potions: 1 } },
                        { weight: 30, narration: "The tunnel opens to a safe passage. Nothing exciting, but nothing dangerous either.", effects: {} },
                        { weight: 20, narration: "Dead end! You have to backtrack. Hours wasted.", effects: { daysLost: 1 } }
                    ]
                },
                {
                    text: "Take the right tunnel (warmth)",
                    outcomes: [
                        { weight: 35, narration: "The warmth comes from a geothermal vent. Your Pokemon relax in the heat and recover their strength.", effects: { healAll: true } },
                        { weight: 35, narration: "The cries were wild Machoke training. They ignore you as you pass through safely.", effects: {} },
                        { weight: 30, narration: "A territorial Onix blocks the path! It strikes before you can react!", effects: { partyDamage: 2 } }
                    ]
                }
            ]
        },
        {
            id: "vr_last_chance_merchant",
            type: "story",
            name: "The Black Market Merchant!",
            description: "A shady figure crouches behind a boulder, a blanket of goods spread before him. \"Psst! Need supplies? I'm the last shop before the League, kid. Prices ain't pretty, but what choice do you have?\"",
            weight: 7,
            oneTime: true,
            locationIds: ["victory_road"],
            choices: [
                {
                    text: "Buy food ($300)",
                    requiresMoney: 300,
                    outcomes: [
                        { weight: 100, narration: "Highway robbery, but you need it. The merchant grins as he hands over a bundle of rations. \"Pleasure doing business.\"", effects: { money: -300, food: 15 } }
                    ]
                },
                {
                    text: "Buy potions ($400)",
                    requiresMoney: 400,
                    outcomes: [
                        { weight: 100, narration: "He hands over a bag of potions. \"Freshly... acquired. Don't ask questions.\"", effects: { money: -400, superPotions: 3, potions: 2 } }
                    ]
                },
                {
                    text: "\"Get lost, I don't deal with crooks.\"",
                    outcomes: [
                        { weight: 70, narration: "\"Your loss, kid.\" He packs up and vanishes into the shadows.", effects: {} },
                        { weight: 30, narration: "\"Suit yourself. But take this — free sample.\" He flicks a potion at you before disappearing.", effects: { potions: 1 } }
                    ]
                }
            ]
        },

        // ===== ROUTE 1 EVENTS =====
        {
            id: "joey_rattata",
            type: "story",
            name: "Youngster Joey!",
            description: "A kid in shorts sprints up to you, clutching a Poke Ball like it's the Holy Grail. \"HEY! My Rattata is in the TOP PERCENTAGE of Rattata! You GOTTA see this!\"",
            weight: 8,
            oneTime: true,
            locationIds: ["route_1"],
            choices: [
                {
                    text: "Battle Joey's Rattata",
                    outcomes: [
                        { weight: 40, narration: "Joey's Rattata is... actually really good? It lands a critical Hyper Fang! Your Pokemon wins, but barely. Joey's in tears. \"I'll train harder! Here — take my lunch money.\" He shoves cash at you and runs off.", effects: { partyDamageAll: 1, money: 200 } },
                        { weight: 35, narration: "Your Pokemon wipes the floor with Joey's Rattata. He sniffles. \"It's still top percentage...\" He hands you a potion and shuffles away, defeated but not broken.", effects: { potions: 1, money: 100 } },
                        { weight: 25, narration: "Joey's Rattata CRITS on the first turn! Your Pokemon goes down HARD. Joey is ecstatic. \"I TOLD YOU! TOP! PERCENTAGE!\" He's so happy he gives you his spare Rattata. It is, admittedly, pretty good.", effects: { partyDamageAll: 1, catchPokemon: 19 } }
                    ]
                },
                {
                    text: "\"That's great, Joey. I gotta go.\"",
                    outcomes: [
                        { weight: 70, narration: "\"Wait! At least take my number! I'll call you about my Rattata!\" You walk faster.", effects: {} },
                        { weight: 30, narration: "Joey shoves a potion into your hands. \"For the road! And remember — TOP PERCENTAGE!\" He seems like a good kid.", effects: { potions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "route1_ledge_shortcut",
            type: "discovery",
            name: "The Ledge",
            description: "A series of rocky ledges lines the route — you can jump down them, but there's no climbing back up. Between the ledges, you spot something shiny in the tall grass below.",
            weight: 7,
            locationIds: ["route_1"],
            choices: [
                {
                    text: "Jump the ledge to grab it",
                    outcomes: [
                        { weight: 35, narration: "You leap down! It's a stash of Poke Balls someone dropped. Nice find! The landing is rough though.", effects: { pokeballs: 5, partyDamageAll: 1 } },
                        { weight: 35, narration: "A pile of coins scattered in the grass! Someone's wallet must have fallen. Finders keepers.", effects: { money: 300 } },
                        { weight: 30, narration: "It's just a bottle cap. But a wild Pidgey startles from the grass — and it looks strong!", effects: { catchPokemon: 16 } }
                    ]
                },
                {
                    text: "Stay on the main path",
                    outcomes: [
                        { weight: 100, narration: "You stick to the safe route. No point risking a twisted ankle this early.", effects: {} }
                    ]
                }
            ]
        },

        // ===== VIRIDIAN FOREST EVENTS =====
        {
            id: "forest_samurai",
            type: "combat",
            name: "Samurai Boy!",
            description: "A kid in samurai armor leaps from behind a tree! \"HALT! I am the Samurai of Viridian Forest! I challenge all trainers who pass through! None have bested my Pinsir!\" He's dead serious.",
            weight: 6,
            oneTime: true,
            locationIds: ["viridian_forest"],
            choices: [
                {
                    text: "Accept the Samurai's challenge!",
                    outcomes: [
                        { weight: 30, narration: "Your Pokemon outmaneuvers the Pinsir! The Samurai bows deeply. \"You are a TRUE warrior. Take my Pinsir — it will serve you well on your journey.\" An incredible gift from a worthy rival.", effects: { catchPokemon: 127, partyDamageAll: 1, trainPokemon: true } },
                        { weight: 40, narration: "A brutal fight! Your Pokemon wins but is battered. The Samurai nods respectfully. \"You have earned safe passage. And this.\" He hands you a Rare Candy he's been saving.", effects: { partyDamageAll: 1, rareCandy: 1 } },
                        { weight: 30, narration: "Pinsir's Vice Grip is devastating. Your Pokemon fights hard but loses. The Samurai lets you pass anyway. \"Train harder. Return when you are worthy.\" Your team is roughed up.", effects: { partyDamageAll: 2 } }
                    ]
                },
                {
                    text: "\"I don't have time for this.\"",
                    outcomes: [
                        { weight: 60, narration: "The Samurai scoffs. \"A coward! Viridian Forest remembers the unworthy!\" He vanishes into the trees.", effects: {} },
                        { weight: 40, narration: "\"Then pay the toll!\" The Samurai blocks your path. You toss him some cash to pass. Highway robbery, honestly.", effects: { money: -200 } }
                    ]
                }
            ]
        },

        // ===== ROUTE 5 EVENTS =====
        {
            id: "underground_path_dealer",
            type: "story",
            name: "Underground Path Merchant",
            description: "In the dim underground passage connecting Cerulean to Vermilion, a figure sits against the wall with a trench coat full of goods. \"Psst. You look like a trainer who appreciates... OFF-MENU items. I got what the Poke Marts won't sell.\"",
            weight: 7,
            oneTime: true,
            locationIds: ["route_5"],
            choices: [
                {
                    text: "Buy Great Balls ($600 for 5)",
                    requiresMoney: 600,
                    outcomes: [
                        { weight: 75, narration: "\"Pleasure doing business.\" He slides you five Great Balls. They look legit. Better than anything the Marts carry at this point.", effects: { money: -600, greatballs: 5 } },
                        { weight: 25, narration: "\"And because I like your face — a bonus.\" He throws in an extra one. Six Great Balls total. Not bad.", effects: { money: -600, greatballs: 6 } }
                    ]
                },
                {
                    text: "Buy a Rare Candy ($1500)",
                    requiresMoney: 1500,
                    outcomes: [
                        { weight: 100, narration: "He pulls a glowing candy from his coat like a jeweler showing a diamond. \"Pure. Uncut. The real deal.\" It IS a real Rare Candy. Expensive, but legit.", effects: { money: -1500, rareCandy: 1 } }
                    ]
                },
                {
                    text: "\"Not interested.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Your loss, kid. I'll be here... probably.\" He tips his hat as you walk past.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "pokemon_fan_club",
            type: "story",
            name: "Pokemon Fan Club Chairman!",
            description: "An elderly man in a suit practically tackles you on the road. \"Oh! A trainer! Please, PLEASE let me tell you about my precious Rapidash! She's the most beautiful Pokemon in the WORLD! Her mane! Her speed! Her ELEGANCE!\"",
            weight: 6,
            oneTime: true,
            locationIds: ["route_5"],
            choices: [
                {
                    text: "Listen to him ramble (patiently)",
                    outcomes: [
                        { weight: 100, narration: "He talks for FORTY FIVE MINUTES about his Rapidash. You learn more about horse Pokemon than any human should know. Finally, he notices your glazed eyes. \"Oh! You listened to the whole thing! You're wonderful! Here — take this!\" He hands you a Bike Voucher worth $2000. Patience pays.", effects: { money: 2000 } }
                    ]
                },
                {
                    text: "\"Sorry, I'm in a hurry!\"",
                    outcomes: [
                        { weight: 60, narration: "\"Oh... nobody ever wants to hear about Rapidash...\" He looks so sad. You feel terrible but you've got a journey to finish.", effects: {} },
                        { weight: 40, narration: "\"Wait! At least take this! For the road!\" He presses some food into your hands before you can escape. Bless his heart.", effects: { food: 5 } }
                    ]
                }
            ]
        },

        // ===== ROUTE 6 EVENTS =====
        {
            id: "digletts_cave_detour",
            type: "discovery",
            name: "Diglett's Cave!",
            description: "A hole in the ground leads to Diglett's Cave! Dozens of Diglett pop up and down like a living minefield. One particularly large Dugtrio blocks the main path and seems to be guarding something.",
            weight: 7,
            oneTime: true,
            locationIds: ["route_6"],
            choices: [
                {
                    text: "Dig through with your team",
                    bonusAbility: "dig",
                    bonusOutcome: { narration: "Your Dig Pokemon burrows right past the Dugtrio! Underground, you find a hidden cache — someone's buried stash from years ago. Jackpot!", effects: { money: 500, superPotions: 2, pokeballs: 5 } },
                    outcomes: [
                        { weight: 40, narration: "Your team digs carefully past the Dugtrio and finds a cache of supplies buried by a previous trainer!", effects: { food: 10, potions: 2 } },
                        { weight: 35, narration: "The Dugtrio doesn't appreciate trespassers! It Earthquakes your team before you grab some supplies and flee.", effects: { partyDamageAll: 1, food: 8 } },
                        { weight: 25, narration: "The tunnel collapses behind you! You escape with your life and a wild Diglett that seems oddly attached to you.", effects: { partyDamageAll: 1, catchPokemon: 50 } }
                    ]
                },
                {
                    text: "Leave the cave alone",
                    outcomes: [
                        { weight: 100, narration: "You leave the Diglett in peace. The main road is safer anyway.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "vermilion_dock_workers",
            type: "story",
            name: "Dock Workers' Request",
            description: "A group of dock workers are struggling to load heavy crates onto a ship. \"Hey kid! Your Pokemon look strong! Help us load these crates and we'll make it worth your while. Captain's paying double today.\"",
            weight: 7,
            locationIds: ["route_6"],
            choices: [
                {
                    text: "Help load the crates",
                    bonusAbility: "strength",
                    bonusOutcome: { narration: "Your Strength Pokemon lifts crates like they're pillows! The workers are stunned. \"That Pokemon's worth ten men!\" They pay you double AND throw in some ship rations.", effects: { money: 600, food: 15 } },
                    outcomes: [
                        { weight: 50, narration: "Hard work, but your team gets it done. The foreman pays you fairly and shares some of the ship's food supplies.", effects: { money: 300, food: 10 } },
                        { weight: 30, narration: "A crate slips and crashes! Your Pokemon catches it but gets hurt. The foreman pays you extra for saving the cargo.", effects: { money: 500, partyDamageAll: 1 } },
                        { weight: 20, narration: "The work takes all day but the pay is good. Your team is exhausted.", effects: { money: 400, food: 8, daysLost: 1 } }
                    ]
                },
                {
                    text: "\"I've got my own journey to worry about.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Fair enough, kid. Good luck out there.\" The workers wave you off.", effects: {} }
                    ]
                }
            ]
        },

        // ===== ROUTE 8 EVENTS =====
        {
            id: "route8_gambler",
            type: "story",
            name: "The Gambler!",
            description: "A man in a fedora leans against a signpost, flipping a coin. \"Hey kid! I'm feeling lucky today. Bet me $500 on a coin flip — heads you double it, tails you lose it. Or if you're REALLY brave... $1000. What do you say?\"",
            weight: 7,
            locationIds: ["route_8"],
            choices: [
                {
                    text: "Bet $500",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 50, narration: "HEADS! \"Well well! Lucky kid!\" He grudgingly counts out your winnings. $500 profit, just like that.", effects: { money: 500 } },
                        { weight: 50, narration: "TAILS! \"Haha! Better luck next time, kid!\" He pockets your money with a grin. You feel sick.", effects: { money: -500 } }
                    ]
                },
                {
                    text: "Bet $1000 (high roller)",
                    requiresMoney: 1000,
                    outcomes: [
                        { weight: 45, narration: "HEADS! The Gambler's smile drops. \"...Double or nothing?\" You grab your $2000 and walk. What a rush.", effects: { money: 1000 } },
                        { weight: 55, narration: "TAILS! \"THE HOUSE ALWAYS WINS, BABY!\" He snatches your money and vanishes before you can change your mind. $1000 gone in a coin flip.", effects: { money: -1000 } }
                    ]
                },
                {
                    text: "\"Gambling's a fool's game.\"",
                    outcomes: [
                        { weight: 70, narration: "\"Smart kid. Smarter than me, anyway.\" He goes back to flipping his coin.", effects: {} },
                        { weight: 30, narration: "\"Here — for being the FIRST person to say no today.\" He flips you a coin. It's gold! Worth something.", effects: { money: 100 } }
                    ]
                }
            ]
        },
        {
            id: "route8_ditto_encounter",
            type: "special",
            name: "The Ditto Mimic!",
            description: "Your lead Pokemon spots what looks like ANOTHER one of itself up ahead. Same species, same posture, same everything. Then it wobbles. Its face goes blank for a split second. That's no copy — that's a Ditto!",
            weight: 5,
            locationIds: ["route_8", "route_8_celadon"],
            choices: [
                {
                    text: "Try to catch the Ditto!",
                    outcomes: [
                        { weight: 40, narration: "The Ditto transforms into a Geodude and tries to roll away, but your Poke Ball connects! A Ditto is incredibly useful — it can become anything!", effects: { catchPokemon: 132, pokeballs: -1 } },
                        { weight: 35, narration: "Ditto transforms into a Fearow and FLIES away! Your Poke Ball misses entirely. That sneaky blob.", effects: { pokeballs: -2 } },
                        { weight: 25, narration: "Ditto transforms into your lead Pokemon and FIGHTS you! It's an even match — your Pokemon wins but barely. The Ditto oozes away.", effects: { partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Let it be",
                    outcomes: [
                        { weight: 100, narration: "The Ditto wobbles, transforms into a rock, and sits there. You pretend not to notice. It pretends to be a rock. Everyone's happy.", effects: {} }
                    ]
                }
            ]
        },

        // ===== ROCK TUNNEL EVENTS =====
        {
            id: "rock_tunnel_hiker",
            type: "story",
            name: "The Lost Hiker",
            description: "A Hiker sits against the cave wall, his flashlight flickering. \"I've been lost in here for THREE DAYS. My food's gone. My Geodude fainted. I can barely see. Please... can you help me find the exit?\"",
            weight: 7,
            oneTime: true,
            locationIds: ["rock_tunnel"],
            choices: [
                {
                    text: "Guide him to the exit",
                    bonusAbility: "flash",
                    bonusOutcome: { narration: "Your Flash Pokemon lights up the entire tunnel! The Hiker follows you out in minutes. \"You saved my life! Take everything I have!\" He hands you his entire pack — food, potions, cash. His Geodude even seems to want to come with you.", effects: { food: 15, potions: 3, money: 500, catchPokemon: 74 } },
                    outcomes: [
                        { weight: 50, narration: "It takes hours, but you guide him through the maze of tunnels. At the exit, he weeps with gratitude. \"Take these — I won't need them now that I'm never coming back to this hellhole.\" He gives you his supplies.", effects: { food: 10, potions: 2, money: 300, daysLost: 1 } },
                        { weight: 30, narration: "You find the way out, but the detour costs you. Wild Zubats attack in the dark. The Hiker gives you what he can.", effects: { partyDamageAll: 1, food: 8, money: 200 } },
                        { weight: 20, narration: "You get lost together. An entire day wasted before you find the exit. At least the Hiker shares his last rations.", effects: { daysLost: 1, food: 5, partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Share some food and move on",
                    outcomes: [
                        { weight: 100, narration: "You can't spare the time, but you leave him some food and point him in the right direction. \"Bless you, kid!\" Hopefully he makes it.", effects: { food: -5 } }
                    ]
                }
            ]
        },
        {
            id: "rock_tunnel_fossil_wall",
            type: "discovery",
            name: "Fossil Imprints!",
            description: "Your Pokemon brushes against the cave wall and loose rock crumbles away, revealing ancient fossil imprints! Prehistoric Pokemon were embedded here millions of years ago. Some of the fossils look intact enough to extract...",
            weight: 5,
            oneTime: true,
            locationIds: ["rock_tunnel"],
            choices: [
                {
                    text: "Carefully extract a fossil",
                    bonusAbility: "strength",
                    bonusOutcome: { narration: "Your Strength Pokemon delicately — yes, delicately — chips away the rock. A perfect Helix Fossil emerges! Somewhere, a scientist is going to lose their mind.", effects: { rareCandy: 1, money: 1000 } },
                    outcomes: [
                        { weight: 40, narration: "You pry out a partial fossil. It's not complete enough to revive, but a collector would pay good money for it.", effects: { money: 600 } },
                        { weight: 30, narration: "The extraction goes wrong — the wall collapses! But in the rubble, you find some rare minerals and a Super Potion wedged in the rock.", effects: { partyDamageAll: 1, superPotions: 1, money: 300 } },
                        { weight: 30, narration: "You extract a beautiful fossil! A passing scientist identifies it and gives you a Rare Candy in exchange for letting him study it.", effects: { rareCandy: 1 } }
                    ]
                },
                {
                    text: "Leave them for science",
                    outcomes: [
                        { weight: 100, narration: "Some things are better left to professionals. You take a mental note of the location — maybe someday a research team will thank you.", effects: {} }
                    ]
                }
            ]
        },

        // ===== ROUTE 7 (route_8_celadon) EVENTS =====
        {
            id: "route7_snorlax_roadblock",
            type: "special",
            name: "Snorlax Roadblock!",
            description: "A MASSIVE Snorlax is sleeping in the middle of the road. It's blocking the entire path. Trainers are lined up behind it, frustrated. One guy's been waiting since yesterday. There's no way around it.",
            weight: 5,
            oneTime: true,
            locationIds: ["route_8_celadon"],
            choices: [
                {
                    text: "Use a Poke Flute (if you have one)",
                    requiresKeyItem: "Poke Flute",
                    outcomes: [
                        { weight: 40, narration: "The Poke Flute's melody fills the air. Snorlax yawns, stretches, and looks at you. It seems grateful to be woken! It follows you, ready to eat everything in sight.", effects: { catchPokemon: 143 } },
                        { weight: 60, narration: "Snorlax wakes up, yawns, and wanders off the road. The line of trainers CHEERS. One tips you some cash. \"THANK YOU!\"", effects: { money: 400, food: 5 } }
                    ]
                },
                {
                    text: "Try to wake it up the hard way",
                    outcomes: [
                        { weight: 30, narration: "Your Pokemon attacks! Snorlax wakes up ANGRY, swats your entire team, then rolls over and goes back to sleep. At least it rolled off the road.", effects: { partyDamageAll: 2 } },
                        { weight: 40, narration: "You blast it with everything. Snorlax slowly stands up, stretches, and ambles away like nothing happened. It left behind some berries it was sleeping on.", effects: { food: 8, partyDamageAll: 1 } },
                        { weight: 30, narration: "After an hour of prodding, Snorlax rolls to the side. A grateful trainer behind you shares supplies for your effort.", effects: { potions: 2, food: 5, daysLost: 1 } }
                    ]
                },
                {
                    text: "Wait it out",
                    outcomes: [
                        { weight: 50, narration: "A full day later, Snorlax finally wakes and wanders off. You've wasted a day, but at least you're not hurt.", effects: { daysLost: 1 } },
                        { weight: 50, narration: "While waiting, you trade stories with other trainers. One shares food and healing items. Silver lining.", effects: { daysLost: 1, food: 8, potions: 2 } }
                    ]
                }
            ]
        },

        // ===== MT. MOON EVENT =====
        {
            id: "clefairy_moon_dance",
            type: "special",
            name: "Clefairy Moon Dance!",
            description: "Deep in Mt. Moon, you find an open cavern lit by a crack in the ceiling. Moonlight streams down onto a Moon Stone. And there — a ring of Clefairy, dancing in a circle around it. It's magical. They haven't noticed you yet.",
            weight: 5,
            oneTime: true,
            locationIds: ["mt_moon"],
            choices: [
                {
                    text: "Watch quietly from the shadows",
                    outcomes: [
                        { weight: 50, narration: "The dance reaches its crescendo. The Moon Stone GLOWS and splits into fragments! A Clefairy notices you and shyly offers a piece. Your whole team feels energized by the moonlight. A once-in-a-lifetime moment.", effects: { healAll: true, rareCandy: 1 } },
                        { weight: 50, narration: "The Clefairy dance until dawn. As they disperse, one walks up to you. It wants to come along! It touches the Moon Stone one last time, then joins your party.", effects: { catchPokemon: 35, healAll: true } }
                    ]
                },
                {
                    text: "Sneak up and grab the Moon Stone",
                    outcomes: [
                        { weight: 30, narration: "You grab the Moon Stone! The Clefairy SHRIEK! They attack in unison — tiny fists, Metronome chaos, Moonblasts everywhere! You escape with the stone but your team is WRECKED.", effects: { rareCandy: 1, partyDamageAll: 2 } },
                        { weight: 70, narration: "A Clefairy spots you and they scatter! In the panic, the Moon Stone cracks. You salvage a fragment — it sells well, but you feel like a monster.", effects: { money: 800 } }
                    ]
                },
                {
                    text: "Try to catch a Clefairy",
                    outcomes: [
                        { weight: 40, narration: "You toss a ball at the closest one. CLICK! The others flee, and the dance is over forever. But you've got a Clefairy. Was it worth it?", effects: { catchPokemon: 35, pokeballs: -1 } },
                        { weight: 60, narration: "The Clefairy see the ball coming and scatter in every direction! They use Metronome — and by sheer luck, it's Teleport. Every last one vanishes. Dance over.", effects: { pokeballs: -1 } }
                    ]
                }
            ]
        },

        // ===== CYCLING ROAD EVENTS =====
        {
            id: "cycling_road_bikers",
            type: "combat",
            name: "Biker Gang Showdown!",
            description: "A gang of bikers blocks the entire Cycling Road. Their leader — a huge guy with a Weezing on his shoulder — revs his engine. \"Nobody rides OUR road without paying the toll! $500, or we take it outta your Pokemon!\" The anime taught you this might happen.",
            weight: 6,
            oneTime: true,
            locationIds: ["cycling_road"],
            choices: [
                {
                    text: "Fight the whole gang!",
                    outcomes: [
                        { weight: 25, narration: "Your Pokemon DESTROYS them. One by one, their Koffings and Grimers fall. The leader's Weezing puts up a fight but goes down too. \"You're... you're INSANE!\" They scatter, dropping cash and items. You're a legend on Cycling Road now.", effects: { money: 800, potions: 3, food: 10, trainPokemon: true } },
                        { weight: 35, narration: "You beat most of them, but the leader's Weezing uses Self-Destruct! Your whole team takes the blast! The bikers flee in the chaos. Pyrrhic victory.", effects: { partyDamageAll: 2, money: 500 } },
                        { weight: 25, narration: "Too many of them. Your Pokemon fights bravely but gets overwhelmed. They take your money AND rough up your team. Cycling Road is harsh.", effects: { partyDamageAll: 2, money: -300 } },
                        { weight: 15, narration: "Your Pokemon takes down the leader's Weezing in one shot! The gang is stunned. \"Boss got ONE-SHOT?!\" They hand you their stash out of pure shock. A Koffing follows you, apparently switching allegiance.", effects: { money: 600, catchPokemon: 109 } }
                    ]
                },
                {
                    text: "Pay the $500 toll",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 70, narration: "\"Smart choice, kid.\" They pocket your money and part like the Red Sea. Extortion at its finest.", effects: { money: -500 } },
                        { weight: 30, narration: "\"Smart choice. And since you're cool about it — here.\" The leader tosses you some Super Potions. \"Road gets rough ahead. You'll need those.\"", effects: { money: -500, superPotions: 2 } }
                    ]
                },
                {
                    text: "Try to speed past them!",
                    bonusAbility: "fly",
                    bonusOutcome: { narration: "Your Fly Pokemon LAUNCHES you over the entire gang! They stare up in disbelief as you soar over their blockade. \"WHAT THE—\" Beautiful.", effects: {} },
                    outcomes: [
                        { weight: 40, narration: "You gun it downhill! The bikers can't keep up — you're too fast! Wind in your hair, freedom in your heart.", effects: {} },
                        { weight: 35, narration: "Almost made it! A Koffing Smokescreen blinds you and you crash. The bikers laugh and take some of your supplies.", effects: { partyDamageAll: 1, food: -5 } },
                        { weight: 25, narration: "You slam right into a biker. Everyone goes down in a pile of bikes and Pokemon. The bikers are too busy untangling themselves to chase you.", effects: { partyDamageAll: 1 } }
                    ]
                }
            ]
        },
        {
            id: "cycling_road_downhill",
            type: "hazard",
            name: "Downhill Wipeout!",
            description: "The slope of Cycling Road gets STEEP. You're picking up speed — way too much speed. Your Pokemon are struggling to keep up. A sharp curve is coming up fast. There are no brakes.",
            weight: 7,
            locationIds: ["cycling_road"],
            choices: [
                {
                    text: "Lean into the turn!",
                    outcomes: [
                        { weight: 40, narration: "You carve the turn PERFECTLY! The speed boost launches you ahead — you cover extra ground today! What a rush!", effects: { food: -3 } },
                        { weight: 35, narration: "You skid but hold it! Sparks fly off the guard rail. Your Pokemon flinch but nobody's hurt. Your food bag slipped off though.", effects: { food: -8 } },
                        { weight: 25, narration: "WIPEOUT! You and your Pokemon tumble across the asphalt. Road rash for everyone. At least you stopped.", effects: { partyDamageAll: 1 } }
                    ]
                },
                {
                    text: "Bail off the road into the grass!",
                    outcomes: [
                        { weight: 50, narration: "You dive off the road and roll into soft grass. Bumps and bruises, but nothing broken. Your supplies scatter everywhere — you recover most of them.", effects: { food: -5 } },
                        { weight: 30, narration: "You crash into a bush that turns out to be a wild Doduo's nest! It's furious! But at least you're off the road.", effects: { partyDamageAll: 1, catchPokemon: 84 } },
                        { weight: 20, narration: "You bail and tumble into a ditch. Your team is roughed up but you find some items another cyclist lost here.", effects: { partyDamageAll: 1, potions: 2 } }
                    ]
                }
            ]
        },

        // ===== SEA ROUTE 19 EVENTS =====
        {
            id: "tentacool_swarm",
            type: "hazard",
            name: "Tentacool Swarm!",
            description: "The water around you turns PURPLE. Tentacool. Hundreds of them. They're migrating and you're right in their path. Stingers out, drifting closer. This is the Gen 1 experience — Tentacool as far as the eye can see.",
            weight: 7,
            locationIds: ["sea_route_19"],
            choices: [
                {
                    text: "Swim through the swarm",
                    bonusAbility: "surf",
                    bonusOutcome: { narration: "Your Surf Pokemon creates a wake that parts the Tentacool like Moses at the Red Sea! You blast through untouched. A few Tentacool look impressed.", effects: {} },
                    outcomes: [
                        { weight: 30, narration: "Stingers everywhere! Your team gets peppered but you push through. Everyone's poisoned and hurting by the time you're clear.", effects: { partyDamageAll: 1, statusRandom: "poisoned" } },
                        { weight: 40, narration: "Most of the Tentacool ignore you — they're too busy migrating. A few curious ones sting your team. Annoying but survivable.", effects: { partyDamageAll: 1 } },
                        { weight: 30, narration: "The swarm engulfs you! Your team fights frantically. When it's over, one Tentacool is tangled in your gear. It decides to stick around.", effects: { partyDamageAll: 1, catchPokemon: 72 } }
                    ]
                },
                {
                    text: "Wait for the swarm to pass",
                    outcomes: [
                        { weight: 50, narration: "Hours pass. The swarm finally clears. You've lost a day but you're unscathed.", effects: { daysLost: 1 } },
                        { weight: 50, narration: "The swarm takes half a day to pass. While waiting, you fish up some food. Not the worst delay.", effects: { daysLost: 1, food: 5 } }
                    ]
                }
            ]
        },
        {
            id: "sea_route19_swimmers",
            type: "story",
            name: "Swimmer's Challenge!",
            description: "A group of competitive Swimmers treading water nearby. Their leader shouts: \"Hey! We do relay races against travelers! Beat us and win a prize! Lose and... well, hope your Pokemon can swim!\"",
            weight: 6,
            locationIds: ["sea_route_19"],
            choices: [
                {
                    text: "Accept the relay race!",
                    bonusAbility: "surf",
                    bonusOutcome: { narration: "Your Surf Pokemon DOMINATES the relay! The Swimmers are humiliated. \"That's not fair! That thing's a torpedo!\" They pay up, embarrassed. One of them hands you an extra prize — they respect the speed.", effects: { money: 600, food: 10, superPotions: 2 } },
                    outcomes: [
                        { weight: 35, narration: "Your team barely wins! A photo finish! The Swimmers are good sports and hand over the prize money and some ocean-foraged food.", effects: { money: 400, food: 8 } },
                        { weight: 35, narration: "Close race but you lose! The Swimmers dunk your team in celebration. Everyone's fine, just wet and embarrassed.", effects: { partyDamageAll: 1, food: 5 } },
                        { weight: 30, narration: "You WIN! The lead Swimmer is so impressed she gives you a Staryu she trained. \"It's fast — use it well!\"", effects: { money: 300, catchPokemon: 120 } }
                    ]
                },
                {
                    text: "\"I'll pass. Got a League to win.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Suit yourself, landlubber!\" They splash off, laughing. You save your energy.", effects: {} }
                    ]
                }
            ]
        },

        // ===== SEA ROUTE 20 EVENTS =====
        {
            id: "sea_route20_shipwreck",
            type: "discovery",
            name: "The Sunken Ship!",
            description: "Through the crystal-clear water, you spot it — a ship resting on the ocean floor. It's old, barnacle-covered, but the cargo hold looks intact. There could be treasure down there... or danger.",
            weight: 5,
            oneTime: true,
            locationIds: ["sea_route_20"],
            choices: [
                {
                    text: "Dive down to explore",
                    bonusAbility: "surf",
                    bonusOutcome: { narration: "Your Surf Pokemon guides you expertly through the wreck! In the captain's quarters, you find a locked chest. Inside: a stash of Poke Balls, gold coins, and a preserved Super Potion. The haul of a lifetime!", effects: { money: 1500, superPotions: 3, greatballs: 5 } },
                    outcomes: [
                        { weight: 35, narration: "You explore the cargo hold and find preserved supplies! The ship was a trade vessel — crates of food and Poke Balls still sealed.", effects: { food: 15, pokeballs: 5, money: 500 } },
                        { weight: 35, narration: "You find some gold coins and supplies, but a wild Tentacruel guards the deeper rooms! You grab what you can and flee.", effects: { money: 800, partyDamageAll: 1 } },
                        { weight: 30, narration: "The ship is more collapsed than it looked. A wall caves in and your team barely escapes! You grab a single chest on the way out.", effects: { partyDamageAll: 2, money: 600, potions: 2 } }
                    ]
                },
                {
                    text: "Too risky. Keep swimming.",
                    outcomes: [
                        { weight: 100, narration: "You swim past the wreck. Some treasures aren't worth drowning over.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "sea_route20_lapras_pod",
            type: "special",
            name: "Lapras Pod!",
            description: "A haunting melody drifts across the water. Through the waves, you see them — a pod of Lapras, singing together as they migrate. One of them, smaller than the rest, is falling behind. It looks exhausted and scared.",
            weight: 4,
            oneTime: true,
            locationIds: ["sea_route_20"],
            choices: [
                {
                    text: "Help the little Lapras catch up",
                    outcomes: [
                        { weight: 40, narration: "Your team helps push the Lapras through the current toward its family. But the pod is moving too fast. The little Lapras watches them disappear over the horizon... then turns to you. It has nobody else now. It joins your team.", effects: { catchPokemon: 131, food: -5 } },
                        { weight: 35, narration: "You guide the Lapras back to its pod! The mother Lapras sings a beautiful note — your entire team feels healed and refreshed. They disappear into the waves, a family reunited.", effects: { healAll: true } },
                        { weight: 25, narration: "The Lapras is too weak. You feed it and nurse it back to health, but its family is gone. It nuzzles you gratefully and follows. A bittersweet rescue.", effects: { food: -10, catchPokemon: 131 } }
                    ]
                },
                {
                    text: "Try to catch the straggler",
                    outcomes: [
                        { weight: 35, narration: "The Lapras is too tired to resist. The ball clicks shut. But the pod's song turns mournful as they realize they've lost one of their own. You try not to think about it.", effects: { catchPokemon: 131, pokeballs: -1 } },
                        { weight: 65, narration: "The mother Lapras sees you coming and BLASTS you with Ice Beam! The whole pod rallies to defend the straggler. Your team is frozen and battered as the Lapras escape with their young one.", effects: { partyDamageAll: 2 } }
                    ]
                },
                {
                    text: "Watch them pass",
                    outcomes: [
                        { weight: 100, narration: "You float in the waves and listen to their song. It's the most beautiful thing you've heard on this entire journey. The melody lingers long after they're gone.", effects: { healOne: true } }
                    ]
                }
            ]
        },

        // ===== ROUTE 21 EVENTS =====
        {
            id: "route21_fisherman",
            type: "story",
            name: "The Fishing Guru!",
            description: "An old fisherman sits on a raft in the middle of the ocean, six rods cast in every direction. \"Hey there! I'm the FISHING GURU! Been fishing these waters for 40 years. Want me to teach you the art of the rod? I'll even let you use my Super Rod — ONE cast!\"",
            weight: 7,
            oneTime: true,
            locationIds: ["route_21"],
            choices: [
                {
                    text: "Cast the Super Rod!",
                    outcomes: [
                        { weight: 10, narration: "The rod BENDS double! You fight it for twenty minutes! It's a GYARADOS! The Guru helps you reel it in. \"In 40 years, I've never seen someone catch THAT on their first cast!\" The Gyarados joins your team, exhausted but impressed.", effects: { catchPokemon: 130 } },
                        { weight: 25, narration: "A strong bite! You pull up a Seadra! The Guru nods approvingly. \"Good catch! That's a rare one in these parts.\" He lets you keep it.", effects: { catchPokemon: 117 } },
                        { weight: 30, narration: "You feel a tug and pull up... a Magikarp. The Guru pats your shoulder. \"Everyone starts with Magikarp. EVERYONE.\" He shares some food to ease your disappointment.", effects: { catchPokemon: 129, food: 5 } },
                        { weight: 20, narration: "A Kingler! The Guru's eyes go wide. \"She's a big one!\" You and your team work together to land it.", effects: { catchPokemon: 99 } },
                        { weight: 15, narration: "Nothing bites. The Guru laughs. \"Some days the ocean gives, some days it takes!\" He hands you some fish he caught earlier. Not Pokemon — just food.", effects: { food: 12 } }
                    ]
                },
                {
                    text: "\"Thanks, but I'm in a hurry.\"",
                    outcomes: [
                        { weight: 100, narration: "\"Suit yourself! The fish aren't going anywhere!\" The Guru goes back to his rods. All six of them.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "route21_homecoming",
            type: "story",
            name: "Homeward Bound",
            description: "Through the ocean spray, you see it — Pallet Town on the horizon. The place where it all started. Your Pokemon perk up. They can smell the land. Memories flood back — Mom's cooking, Prof. Oak's lab, your first steps into the tall grass.",
            weight: 6,
            oneTime: true,
            locationIds: ["route_21"],
            choices: [
                {
                    text: "Take a moment to appreciate the journey",
                    outcomes: [
                        { weight: 50, narration: "You float there, looking at how far you've come. Badges, Pokemon, friends lost along the way. Your whole team surfaces to look at the distant shore together. Everyone heals a little, inside and out.", effects: { healAll: true } },
                        { weight: 50, narration: "Your starter nuzzles up to you. It remembers Pallet Town too. The bond between you is stronger than ever. Your team feels renewed — the last stretch awaits, and you're going to CRUSH it.", effects: { healAll: true, grantStar: true } }
                    ]
                },
                {
                    text: "No time for nostalgia. Push onward.",
                    outcomes: [
                        { weight: 100, narration: "The League won't wait. You steel yourself and keep swimming. There's still work to do.", effects: {} }
                    ]
                }
            ]
        },

        // ===== ROUTE 22 EVENTS =====
        {
            id: "route22_rival_ambush",
            type: "combat",
            name: "Gary's Ambush!",
            description: "\"Well, well, well. Look who FINALLY made it to Route 22.\" Gary steps out from behind a tree, arms crossed, smirking. \"I've been waiting for you. This is where we fought the FIRST time, remember? Let's see how much you've grown.\" He throws a Poke Ball. This is personal.",
            weight: 7,
            oneTime: true,
            minBadges: 7,
            locationIds: ["route_22"],
            choices: [
                {
                    text: "\"Let's end this, Gary.\"",
                    outcomes: [
                        { weight: 25, narration: "Your Pokemon DOMINATES Gary's ace. He can't believe it. \"How... you've gotten so strong.\" He tosses you a Rare Candy. \"Use that in the League. You're gonna need it.\" For the first time, he looks... proud of you.", effects: { rareCandy: 1, money: 1000, trainPokemon: true } },
                        { weight: 35, narration: "A close fight! Your Pokemon edges out the victory. Gary recalls his Pokemon, seething. \"Fine. You win this round. But the League is a whole different story.\" He shoves some cash at you and storms off.", effects: { money: 800, partyDamageAll: 1, trainPokemon: true } },
                        { weight: 25, narration: "Gary's Pokemon is STRONG. Your team takes a beating but holds on. It's a draw — neither of you willing to let your Pokemon faint. \"Tch. We'll finish this at the League.\" He throws a potion at you and walks away.", effects: { partyDamageAll: 2, potions: 3 } },
                        { weight: 15, narration: "Gary's team is ruthless. Your Pokemon goes down hard. \"Still not good enough.\" He walks away, leaving you in the dust. Your team is demoralized.", effects: { partyDamageAll: 2, money: -500 } }
                    ]
                },
                {
                    text: "\"Not now. Save it for the League.\"",
                    outcomes: [
                        { weight: 50, narration: "Gary hesitates. Then laughs. \"Running? Typical. Fine — see you at the top. IF you make it.\" He walks off toward Victory Road.", effects: {} },
                        { weight: 50, narration: "\"Scared?\" He blocks your path for a moment, then steps aside. \"Whatever. You'll have to face me eventually.\" He throws a Super Potion at your feet. Pity, or respect?", effects: { superPotions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "route22_nidoran_pair",
            type: "discovery",
            name: "Nidoran Love Story",
            description: "In a clearing off the route, you spot a Nidoran♂ and Nidoran♀ playing together. They're clearly bonded — bumping heads, chasing each other's tails. Catching one would mean separating them.",
            weight: 5,
            oneTime: true,
            locationIds: ["route_22"],
            choices: [
                {
                    text: "Catch both! (costs 3 Poke Balls)",
                    requiresItem: "pokeballs",
                    outcomes: [
                        { weight: 50, narration: "You snag the ♂ first, then the ♀ follows into a ball willingly — she won't leave her partner! Two Nidoran, still together. Heart-warming AND practical.", effects: { pokeballs: -3, catchPokemon: 32, catchPokemon2: 29 } },
                        { weight: 30, narration: "You catch the ♀ but the ♂ fights back fiercely! He eventually tires and joins to be with his partner. Love conquers all — even Poke Balls.", effects: { pokeballs: -3, catchPokemon: 29, catchPokemon2: 32, partyDamageAll: 1 } },
                        { weight: 20, narration: "The ♂ breaks free and they both flee! Three balls wasted. They're faster than they look when they're motivated by love.", effects: { pokeballs: -3 } }
                    ]
                },
                {
                    text: "Catch just one",
                    outcomes: [
                        { weight: 50, narration: "You catch the Nidoran♂. The ♀ watches from the bushes, looking lost. You feel bad... but a Pokemon's a Pokemon.", effects: { catchPokemon: 32, pokeballs: -1 } },
                        { weight: 50, narration: "You catch the Nidoran♀. The ♂ headbutts your leg angrily, then runs off alone. Tough choice.", effects: { catchPokemon: 29, pokeballs: -1 } }
                    ]
                },
                {
                    text: "Leave them together",
                    outcomes: [
                        { weight: 100, narration: "You watch them play for a minute, then move on. Some pairs shouldn't be broken. Your Pokemon seem to approve.", effects: { healOne: true } }
                    ]
                }
            ]
        },

        // ===== ROUTE 23 EVENTS =====
        {
            id: "route23_badge_gates",
            type: "story",
            name: "Badge Check Gates!",
            description: "A series of guard gates stretches across Route 23. Each guard demands to see a specific badge before letting you pass. The more badges you have, the more respect — and rewards — you earn from the gatekeepers.",
            weight: 8,
            oneTime: true,
            locationIds: ["route_23"],
            choices: [
                {
                    text: "Present your badges proudly",
                    outcomes: [
                        { weight: 40, narration: "The guards are impressed! \"Eight badges? We don't see that often!\" The head guard opens the VIP stash — supplies meant for League-bound trainers. Potions, food, and cash for the road ahead.", effects: { superPotions: 3, food: 15, money: 500 } },
                        { weight: 35, narration: "\"A full badge case! You've earned every step of this path.\" The guards salute and open the gates. One slips you some supplies. \"For Victory Road. You'll need them.\"", effects: { potions: 4, food: 10, escapeRope: 2 } },
                        { weight: 25, narration: "The guards check each badge carefully, then break into applause. \"Champion material right here!\" One guard's Machoke is so impressed it wants to join you!", effects: { food: 10, money: 300, catchPokemon: 66 } }
                    ]
                },
                {
                    text: "Rush through without stopping",
                    outcomes: [
                        { weight: 60, narration: "The guards shout after you but don't pursue. You're clearly strong enough. No time for ceremonies.", effects: {} },
                        { weight: 40, narration: "\"Hey! HALT!\" A guard stops you briefly, but seeing your badges, waves you through. \"At least take a potion, hotshot.\"", effects: { potions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "route23_veteran_advice",
            type: "story",
            name: "The Veteran's Warning",
            description: "An old man sits at the entrance to Victory Road, watching trainers come and go. His jacket is covered in faded League patches. \"Sit down, kid. I was Champion once, thirty years ago. Let me tell you what Victory Road will do to you.\"",
            weight: 6,
            oneTime: true,
            locationIds: ["route_23"],
            choices: [
                {
                    text: "Listen to the old Champion",
                    outcomes: [
                        { weight: 50, narration: "He talks for an hour about the cave — the darkness, the wild Pokemon, the trainers who never came back. Then he hands you his old supply kit. \"I don't need it anymore. But you will.\" His eyes are sad but kind.", effects: { superPotions: 3, food: 12, escapeRope: 1 } },
                        { weight: 30, narration: "\"The trick is: don't fight everything. Save your strength for the Elite Four. Here — take these.\" He gives you healing items and a Rare Candy he's been saving for the right trainer. \"Win it for me, kid.\"", effects: { superPotions: 2, rareCandy: 1 } },
                        { weight: 20, narration: "\"You remind me of myself at your age. Same fire in the eyes.\" He's quiet for a long time. Then he reaches for his belt and unclips a Poke Ball. \"My old partner. He wants one more adventure.\" A battle-scarred Machamp emerges. Three battle stars on its ball.", effects: { catchPokemon: 68, food: 5 } }
                    ]
                },
                {
                    text: "\"Thanks, but I've got this.\"",
                    outcomes: [
                        { weight: 60, narration: "He smiles sadly. \"That's what they all say.\" He waves you off. Good luck, kid.", effects: {} },
                        { weight: 40, narration: "\"Confident. Good.\" He presses something into your hand — a Super Potion. \"Just in case.\" He turns back to watching the road.", effects: { superPotions: 1 } }
                    ]
                }
            ]
        },

        // ===== CINNABAR ISLAND EVENT =====
        {
            id: "cinnabar_missingno",
            type: "special",
            name: "M̸̡̛I̷̢S̵̨S̶̛I̵N̶G̷N̸O̵!",
            description: "You surf along the east coast of Cinnabar when the water starts GLITCHING. Tiles flicker. The music skips. A shape rises from the water — a scrambled mess of pixels, a backwards 'L' of corrupted data. Your Pokedex screams static. It's... it's MISSINGNO.",
            weight: 3,
            oneTime: true,
            locationIds: ["cinnabar_island"],
            choices: [
                {
                    text: "Try to catch the glitch!",
                    outcomes: [
                        { weight: 20, narration: "Your Poke Ball hits the glitch and... ERROR. Your inventory MULTIPLIES. Balls, potions, everything in your sixth bag slot duplicates wildly! MissingNo vanishes into corrupted water. The old Cinnabar glitch lives.", effects: { pokeballs: 20, potions: 5, rareCandy: 2 } },
                        { weight: 40, narration: "The ball passes RIGHT THROUGH it. MissingNo flickers, screeches static, and your team takes psychic damage from the corrupted data. Your Pokedex registers... something. Then it crashes.", effects: { partyDamageAll: 2, pokeballs: -1 } },
                        { weight: 40, narration: "MissingNo ABSORBS the ball! Your inventory glitches — items duplicate, then some vanish! When reality stabilizes, you've got more of some things and less of others. The glitch giveth and the glitch taketh away.", effects: { pokeballs: 10, food: -10, money: 500 } }
                    ]
                },
                {
                    text: "RUN FROM THE GLITCH!",
                    outcomes: [
                        { weight: 60, narration: "You flee! The water returns to normal. Your Pokedex reboots. Everything seems fine. ...Right? You check your items. Some things seem... duplicated? The sixth item in your bag doubled. Classic.", effects: { potions: 3 } },
                        { weight: 40, narration: "You swim away fast. MissingNo doesn't follow. The world stops glitching. Your heart rate doesn't.", effects: {} }
                    ]
                }
            ]
        },

        // ===== INDIGO PLATEAU EVENT =====
        {
            id: "indigo_plateau_nurse_joy",
            type: "story",
            name: "Nurse Joy's Last Blessing",
            description: "The Nurse Joy at Indigo Plateau looks different from the others. Older. Wiser. She's seen thousands of trainers come through — and most of them lose. \"You've come so far,\" she says, reading your face. \"Let me give your team the VIP treatment. On the house.\"",
            weight: 8,
            oneTime: true,
            locationIds: ["indigo_plateau"],
            choices: [
                {
                    text: "Accept the VIP treatment",
                    outcomes: [
                        { weight: 50, narration: "She takes each Pokemon one by one, healing them with care you've never seen at a Pokemon Center before. \"They're in peak condition now. Whatever happens in there — you gave them the best chance.\" Your whole team is restored and energized.", effects: { healAll: true, superPotions: 3 } },
                        { weight: 50, narration: "\"Here — my personal stock. I save these for trainers I believe in.\" She hands you Super Potions and a Rare Candy. \"Win this for all the trainers who couldn't.\" Your team is healed and your heart is full.", effects: { healAll: true, rareCandy: 1, superPotions: 2 } }
                    ]
                },
                {
                    text: "\"Just a regular heal, thanks.\"",
                    outcomes: [
                        { weight: 100, narration: "She smiles warmly and heals your team. \"Good luck in there. I'll be watching.\" Standard heal, but her kindness gives you confidence.", effects: { healAll: true } }
                    ]
                }
            ]
        },

        // ===== RARE HP BOOST EVENTS =====
        {
            id: "hp_hot_spring",
            type: "discovery",
            name: "Hidden Hot Spring",
            description: "Your team stumbles upon a natural hot spring hidden among the rocks. The water glows faintly — there's something special about this place. Ancient markings on the stones suggest trainers have come here for generations.",
            weight: 2,
            oneTime: true,
            minDay: 5,
            choices: [
                {
                    text: "Let your Pokemon soak in the spring",
                    outcomes: [
                        { weight: 60, narration: "Your Pokemon relax in the warm water. One of them stays in longer than the rest, absorbing the mineral-rich energy. When it finally emerges, it looks bigger — TOUGHER. The hot spring's ancient power has permanently strengthened it.", effects: { boostPokemonMaxHp: 1, healAll: true } },
                        { weight: 40, narration: "The water heals every wound, soothes every ache. Your team emerges refreshed and revitalized — but the spring's deeper power doesn't quite take hold this time.", effects: { healAll: true } }
                    ]
                },
                {
                    text: "Bottle some water for later",
                    outcomes: [
                        { weight: 100, narration: "You fill your containers with the glowing water. It's not as potent away from the source, but it'll serve as excellent medicine on the road.", effects: { potions: 3, superPotions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "hp_dojo_master",
            type: "story",
            name: "The Wandering Dojo Master",
            description: "An elderly martial artist sits cross-legged on a boulder, meditating. His Hitmonchan stands guard. He opens one eye: \"I've been waiting for someone with fighting spirit. I'll train ONE of your Pokemon — but only if it can survive my test.\"",
            weight: 2,
            oneTime: true,
            minDay: 8,
            choices: [
                {
                    text: "Accept the dojo master's challenge",
                    outcomes: [
                        { weight: 50, narration: "The master's training is brutal — hours of dodging, blocking, enduring. Your Pokemon pushes past its limits, screaming, shaking, refusing to quit. When it's over, the master bows. \"You have iron will.\" Your Pokemon's body has been forged stronger. Permanently.", effects: { boostPokemonMaxHp: 1, partyDamage: 1 } },
                        { weight: 30, narration: "The training is overwhelming. Your Pokemon collapses halfway through but the master catches it. \"Not ready. But brave.\" He heals your team as an apology and sends you on your way with respect.", effects: { healAll: true } },
                        { weight: 20, narration: "Your Pokemon not only survives the training — it THRIVES. The master's eyes go wide. \"In 40 years, I've never seen such resolve.\" He teaches advanced techniques. Your Pokemon emerges a warrior.", effects: { boostPokemonMaxHp: 1, grantStar: true } }
                    ]
                },
                {
                    text: "Decline respectfully",
                    outcomes: [
                        { weight: 100, narration: "The master nods. \"Wisdom is knowing when to fight and when to walk away.\" He tosses you a potion. \"For the road.\"", effects: { potions: 1 } }
                    ]
                }
            ]
        },
        {
            id: "hp_rare_berry",
            type: "discovery",
            name: "Strange Glowing Berry",
            description: "Deep in the underbrush, you spot a berry unlike anything you've ever seen. It pulses with a faint golden light, and the air around it hums with energy. Your Pokemon are drawn to it instinctively.",
            weight: 2,
            oneTime: false,
            minDay: 3,
            choices: [
                {
                    text: "Feed it to a Pokemon",
                    outcomes: [
                        { weight: 40, narration: "Your Pokemon devours the berry eagerly. Its body glows golden for a brief moment — then it fades. But something's different. It stands taller. Breathes deeper. The berry has permanently enhanced its constitution.", effects: { boostPokemonMaxHp: 1 } },
                        { weight: 35, narration: "The berry tastes incredible but the power doesn't stick. Your Pokemon feels great temporarily — a full heal — but no lasting change.", effects: { healAll: true } },
                        { weight: 25, narration: "The berry is rotten inside! Your Pokemon spits it out, retching. The golden glow was deceptive — it's actually toxic. Lesson learned.", effects: { partyDamage: 1 } }
                    ]
                },
                {
                    text: "Save it as food",
                    outcomes: [
                        { weight: 100, narration: "You carefully harvest the berry and pack it away. It doesn't glow anymore once picked, but it's still packed with nutrition.", effects: { food: 8 } }
                    ]
                }
            ]
        },
        {
            id: "hp_ancient_shrine",
            type: "story",
            name: "Ancient Pokemon Shrine",
            description: "A crumbling stone shrine sits at the crossroads, covered in moss. Offerings of berries and feathers surround a carved Pokeball symbol. The air feels heavy with reverence. A plaque reads: \"Leave an offering. Receive a blessing.\"",
            weight: 2,
            oneTime: true,
            minDay: 6,
            choices: [
                {
                    text: "Offer $500 at the shrine",
                    requiresMoney: 500,
                    outcomes: [
                        { weight: 55, narration: "You place the money at the shrine. The stones glow. A warm pulse radiates through your team. One Pokemon absorbs the blessing fully — its body shimmers and grows denser. The shrine has granted it permanent resilience.", effects: { money: -500, boostPokemonMaxHp: 1 } },
                        { weight: 45, narration: "The shrine glows briefly, then fades. Your team feels refreshed and healed, though no permanent change takes hold. Perhaps the spirits are satisfied but not generous today.", effects: { money: -500, healAll: true, food: 10 } }
                    ]
                },
                {
                    text: "Offer food (15) at the shrine",
                    outcomes: [
                        { weight: 50, narration: "You arrange the food carefully among the other offerings. The moss on the shrine seems to shimmer. A gentle warmth envelops your team. One Pokemon emerges blessed — permanently toughened by ancient power.", effects: { food: -15, boostPokemonMaxHp: 1 } },
                        { weight: 50, narration: "The offering is accepted. Your team feels warmth and peace. Full healing, but the deeper blessing doesn't manifest.", effects: { food: -15, healAll: true } }
                    ]
                },
                {
                    text: "Pay respects and move on",
                    outcomes: [
                        { weight: 100, narration: "You bow to the shrine and continue on your journey. Some things are best left undisturbed.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "hp_surge_training",
            type: "story",
            name: "Lt. Surge's Boot Camp",
            description: "You hear shouting before you see him. Lt. Surge is running a makeshift outdoor training camp, drilling trainers' Pokemon with military precision. \"YOU! Your Pokemon look SOFT! Get in here — I'll toughen them up or they'll break trying!\"",
            weight: 2,
            oneTime: true,
            minDay: 10,
            choices: [
                {
                    text: "Enroll in Surge's boot camp",
                    outcomes: [
                        { weight: 45, narration: "Surge doesn't hold back. Electric obstacles, endurance runs, combat drills. Your Pokemon is pushed beyond its limits. At the end, Surge salutes. \"THAT'S a soldier.\" Your Pokemon is permanently battle-hardened.", effects: { boostPokemonMaxHp: 1, partyDamage: 1 } },
                        { weight: 30, narration: "The training is intense but your Pokemon thrives under pressure. Surge even awards a battle commendation. \"Born fighter!\"", effects: { boostPokemonMaxHp: 1, grantStar: true } },
                        { weight: 25, narration: "Too intense. Your Pokemon can't keep up with Surge's demands and collapses during the obstacle course. Surge carries it back. \"Not everyone's cut out for this. No shame.\"", effects: { partyDamage: 2 } }
                    ]
                },
                {
                    text: "\"We're good, thanks.\"",
                    outcomes: [
                        { weight: 100, narration: "Surge scoffs. \"Your funeral, kid.\" He goes back to drilling someone else's Pikachu into the dirt.", effects: {} }
                    ]
                }
            ]
        },

        // ===== POKEMON BUYER EVENTS =====
        {
            id: "pokemon_buyer_collector",
            type: "story",
            name: "Pokemon Collector",
            description: "A well-dressed man approaches you on the road, polishing a gold-rimmed Poke Ball. \"I'm a collector of fine Pokemon. I pay handsomely — cash on the spot. Interested in selling one of yours?\"",
            weight: 5,
            maxTriggers: 2,
            minDay: 5,
            requiresPartySize: 2,
            pokemonBuyerEvent: true,
            choices: [
                {
                    text: "See what he's offering",
                    outcomes: [
                        { weight: 100, narration: "The collector examines your team with a jeweler's eye, calculating the value of each Pokemon based on their health and battle experience. \"Fair market price,\" he says, pulling out a thick wad of cash.", effects: { pokemonBuyer: 1 } }
                    ]
                },
                {
                    text: "\"My Pokemon aren't for sale.\"",
                    outcomes: [
                        { weight: 100, narration: "The collector shrugs elegantly. \"Everyone has a price. Perhaps next time.\" He disappears down the road.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "pokemon_buyer_daycare",
            type: "story",
            name: "Pokemon Day Care Couple",
            description: "An elderly couple waves you down from their fenced-in yard full of happy Pokemon. \"We run the Day Care! We're always looking for new Pokemon to care for. We can't pay much, but we promise they'll be loved.\"",
            weight: 4,
            maxTriggers: 2,
            minDay: 3,
            requiresPartySize: 2,
            pokemonBuyerEvent: true,
            choices: [
                {
                    text: "Consider leaving one behind",
                    outcomes: [
                        { weight: 100, narration: "The couple shows you around the day care — it's paradise. Wide fields, warm shelter, other happy Pokemon playing together. They offer you a fair price for one of your team members. \"They'll have a good life here. We promise.\"", effects: { pokemonBuyer: 1 } }
                    ]
                },
                {
                    text: "\"I can't part with any of them.\"",
                    outcomes: [
                        { weight: 100, narration: "The old woman smiles warmly. \"That tells me you're a good trainer. Your Pokemon are lucky to have you.\" She hands you some food for the road.", effects: { food: 5 } }
                    ]
                }
            ]
        },
        {
            id: "pokemon_buyer_premium_breeder",
            type: "story",
            name: "Elite Pokemon Breeder",
            description: "A woman in an expensive lab coat flags you down from her luxury van. Rare Pokemon visible through the windows. \"I'm a licensed breeder seeking high-quality specimens. I pay DOUBLE market rate for Pokemon with good genes. Interested?\"",
            weight: 2,
            oneTime: true,
            minDay: 10,
            requiresPartySize: 2,
            pokemonBuyerEvent: true,
            choices: [
                {
                    text: "Hear her premium offer",
                    outcomes: [
                        { weight: 100, narration: "She scans your team with an advanced device. \"Excellent genetic markers. I'll pay twice the standard market value — $200 per HP plus $500 per Battle Star, all doubled. This is a limited offer.\"", effects: { pokemonBuyer: 2 } }
                    ]
                },
                {
                    text: "\"Not interested.\"",
                    outcomes: [
                        { weight: 100, narration: "She raises an eyebrow. \"Your loss. Quality like that doesn't come cheap.\" She drives off in her luxury van.", effects: {} }
                    ]
                }
            ]
        },
        {
            id: "pokemon_buyer_silph_exec",
            type: "story",
            name: "Silph Co. Executive",
            description: "A Silph Co. helicopter lands nearby. A sharp-suited executive steps out with bodyguards. \"We need Pokemon for our research division. We're authorized to pay TRIPLE market rate. This is a once-in-a-lifetime offer.\"",
            weight: 1,
            oneTime: true,
            minDay: 15,
            requiresPartySize: 2,
            pokemonBuyerEvent: true,
            choices: [
                {
                    text: "Consider the incredible offer",
                    outcomes: [
                        { weight: 100, narration: "The executive opens a briefcase full of cash. \"Triple value. $200 per HP, $500 per Star — all times three. Your Pokemon will be treated well in our state-of-the-art facility. Silph Co. guarantees it.\" The amount of money on the table is staggering.", effects: { pokemonBuyer: 3 } }
                    ]
                },
                {
                    text: "\"Tell Silph Co. to find their own Pokemon.\"",
                    outcomes: [
                        { weight: 100, narration: "The executive's smile doesn't waver. \"Admirable loyalty. Here — take this as a courtesy.\" He hands you a potion before boarding the helicopter.", effects: { potions: 1 } }
                    ]
                }
            ]
        }
    ];
})();

