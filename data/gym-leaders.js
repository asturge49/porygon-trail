// Porygon Trail - Gym Leaders
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    PT.Data.GymLeaders = {
        brock: {
            name: "Brock",
            title: "The Rock-Solid Pokemon Trainer",
            type: "rock",
            badge: "Boulder Badge",
            spriteUrl: "assets/gym-leaders/brock.png",
            pokemon: [
                { id: 74, name: "Geodude" },
                { id: 41, name: "Zubat" },
                { id: 95, name: "Onix", ace: true }
            ],
            challengeText: "Brock stands firm, arms crossed. \"You think you have what it takes? Show me a Pokemon that can withstand my rock-hard defense!\"",
            victoryText: "\"Your Pokemon's determination shattered my defenses. Take the Boulder Badge!\"",
            defeatText: "\"Your team crumbles like sandstone. Come back when you're stronger.\"",
            reward: { money: 450 },
            strongAgainst: ["fire", "flying", "bug"],
            weakAgainst: ["water", "grass", "fighting", "ground"],
            level: 14
        },
        misty: {
            name: "Misty",
            title: "The Tomboyish Mermaid",
            type: "water",
            badge: "Cascade Badge",
            spriteUrl: "assets/gym-leaders/misty.png",
            pokemon: [
                { id: 54, name: "Psyduck" },
                { id: 118, name: "Goldeen" },
                { id: 121, name: "Starmie", ace: true }
            ],
            challengeText: "Misty flips her hair confidently. \"My water Pokemon will wash away your hopes! Can your team handle the current?\"",
            victoryText: "\"You navigated my currents perfectly! The Cascade Badge is yours!\"",
            defeatText: "\"You're all washed up! My Starmie barely broke a sweat.\"",
            reward: { money: 720 },
            strongAgainst: ["fire", "ground", "rock"],
            weakAgainst: ["electric", "grass"],
            level: 21
        },
        lt_surge: {
            name: "Lt. Surge",
            title: "The Lightning American",
            type: "electric",
            badge: "Thunder Badge",
            spriteUrl: "assets/gym-leaders/surge.png",
            pokemon: [
                { id: 81, name: "Magnemite" },
                { id: 100, name: "Voltorb" },
                { id: 26, name: "Raichu", ace: true }
            ],
            challengeText: "Lt. Surge laughs thunderously. \"I've fought in wars, kid! Your little Pokemon don't scare me. Let's see if you can handle the voltage!\"",
            victoryText: "\"Well I'll be shocked! You've got real talent, soldier. Take the Thunder Badge!\"",
            defeatText: "\"You've been grounded, baby! My Raichu packs too much power for you.\"",
            reward: { money: 900 },
            strongAgainst: ["water", "flying"],
            weakAgainst: ["ground"],
            level: 24
        },
        erika: {
            name: "Erika",
            title: "The Nature-Loving Princess",
            type: "grass",
            badge: "Rainbow Badge",
            spriteUrl: "assets/gym-leaders/erika.png",
            pokemon: [
                { id: 114, name: "Tangela" },
                { id: 71, name: "Victreebel" },
                { id: 45, name: "Vileplume", ace: true }
            ],
            challengeText: "Erika smiles gently. \"How lovely that you've come to challenge me. Let us see if your team can bloom under pressure.\"",
            victoryText: "\"Your team blossomed beautifully in battle. Please accept the Rainbow Badge.\"",
            defeatText: "\"Oh my, it seems your team has wilted. Perhaps with more care, you'll grow stronger.\"",
            reward: { money: 1080 },
            strongAgainst: ["water", "ground", "rock"],
            weakAgainst: ["fire", "ice", "flying", "poison", "bug"],
            level: 29
        },
        koga: {
            name: "Koga",
            title: "The Poisonous Ninja Master",
            type: "poison",
            badge: "Soul Badge",
            spriteUrl: "assets/gym-leaders/koga.png",
            pokemon: [
                { id: 110, name: "Weezing" },
                { id: 49, name: "Venomoth" },
                { id: 89, name: "Muk", ace: true }
            ],
            challengeText: "Koga appears from the shadows. \"A ninja does not fight fair. My Pokemon will poison your team's resolve. Can you see through my illusions?\"",
            victoryText: "\"You saw through my techniques! A worthy opponent. The Soul Badge is yours.\"",
            defeatText: "\"You fell for every trap. A ninja always has the advantage.\"",
            reward: { money: 1350 },
            strongAgainst: ["grass", "bug"],
            weakAgainst: ["ground", "psychic"],
            level: 37
        },
        sabrina: {
            name: "Sabrina",
            title: "The Master of Psychic Pokemon",
            type: "psychic",
            badge: "Marsh Badge",
            spriteUrl: "assets/gym-leaders/sabrina.png",
            pokemon: [
                { id: 122, name: "Mr. Mime" },
                { id: 64, name: "Kadabra" },
                { id: 65, name: "Alakazam", ace: true }
            ],
            challengeText: "Sabrina stares with unblinking eyes. \"I foresaw your arrival. My psychic Pokemon already know your strategy. Can you defy fate?\"",
            victoryText: "\"Impossible... I did not foresee this outcome. You have earned the Marsh Badge.\"",
            defeatText: "\"As I predicted. Your mind was an open book to my Pokemon.\"",
            reward: { money: 1620 },
            strongAgainst: ["fighting", "poison"],
            weakAgainst: ["bug", "ghost"],
            level: 43
        },
        blaine: {
            name: "Blaine",
            title: "The Hotheaded Quiz Master",
            type: "fire",
            badge: "Volcano Badge",
            spriteUrl: "assets/gym-leaders/blaine.png",
            pokemon: [
                { id: 126, name: "Magmar" },
                { id: 78, name: "Rapidash" },
                { id: 59, name: "Arcanine", ace: true }
            ],
            challengeText: "Blaine adjusts his sunglasses. \"Hah! Answer me this: Can your Pokemon survive the heat of Cinnabar's volcano? Let's find out!\"",
            victoryText: "\"You've extinguished my flames! Take the Volcano Badge, you've earned it!\"",
            defeatText: "\"Too hot to handle! My fire burns too bright for your team.\"",
            reward: { money: 1800 },
            strongAgainst: ["grass", "ice", "bug"],
            weakAgainst: ["water", "ground", "rock"],
            level: 47
        },
        giovanni: {
            name: "Giovanni",
            title: "The Self-Proclaimed Strongest Trainer",
            type: "ground",
            badge: "Earth Badge",
            spriteUrl: "assets/gym-leaders/giovanni.png",
            pokemon: [
                { id: 53, name: "Persian" },
                { id: 112, name: "Rhydon" },
                { id: 31, name: "Nidoqueen", ace: true }
            ],
            challengeText: "Giovanni smirks from behind his desk. \"So you've made it this far. Team Rocket's boss also happens to be the final gym leader. Prepare to be crushed.\"",
            victoryText: "\"What?! This cannot be! Fine... take the Earth Badge. But this isn't over.\"",
            defeatText: "\"Pathetic. You were never a match for the power of Team Rocket's boss.\"",
            reward: { money: 2250 },
            strongAgainst: ["electric", "fire", "rock", "poison"],
            weakAgainst: ["water", "grass", "ice"],
            level: 50
        },

        // ===== JOHTO GYM LEADERS (§9.1) =====
        falkner: {
            name: "Falkner",
            title: "The Bird Keeper of Violet City",
            type: "flying",
            badge: "Zephyr Badge",
            spriteUrl: "assets/gym-leaders/falkner.png",
            pokemon: [
                { id: 164, name: "Noctowl", ace: true },
                { id: 169, name: "Crobat", ace: true },
                { id: 18, name: "Pidgeot", ace: true }
            ],
            challengeText: "Falkner spreads his arms like wings. \"My father passed his pride down to me. Let's see if your Pokemon can keep up in the sky!\"",
            victoryText: "\"Grounded... but that was a heck of a battle. Take the Zephyr Badge, it's yours!\"",
            defeatText: "\"You never stood a chance against a true master of the skies.\"",
            reward: { money: 1300 },
            strongAgainst: ["fighting", "bug", "grass"],
            weakAgainst: ["electric", "ice", "rock"],
            level: 15
        },
        bugsy: {
            name: "Bugsy",
            title: "The Bug Catcher Prodigy",
            type: "bug",
            badge: "Hive Badge",
            spriteUrl: "assets/gym-leaders/bugsy.png",
            pokemon: [
                { id: 166, name: "Ledian", ace: true },
                { id: 168, name: "Ariados", ace: true },
                { id: 123, name: "Scyther", ace: true }
            ],
            challengeText: "Bugsy adjusts his cap. \"I've studied bugs my whole life. Nothing you throw at me will be a surprise!\"",
            victoryText: "\"Incredible! You out-researched my research. Take the Hive Badge, well earned.\"",
            defeatText: "\"Just as the field notes predicted. You never had the type advantage.\"",
            reward: { money: 1500 },
            strongAgainst: ["grass", "psychic", "dark"],
            weakAgainst: ["fire", "flying", "rock"],
            level: 16
        },
        whitney: {
            name: "Whitney",
            title: "The Pigtailed Tomboy",
            type: "normal",
            badge: "Plain Badge",
            spriteUrl: "assets/gym-leaders/whitney.png",
            pokemon: [
                { id: 35, name: "Clefairy", ace: true },
                { id: 234, name: "Stantler", ace: true },
                { id: 241, name: "Miltank", ace: true }
            ],
            challengeText: "Whitney twirls a pigtail. \"Hee hee, betcha didn't expect a gym leader like me! But I won't go easy on you!\"",
            victoryText: "\"Waaah! Fine, FINE, you win! Here's your dumb old Plain Badge...\"",
            defeatText: "\"Hee hee! Rollout just keeps on rolling! Better luck next time!\"",
            reward: { money: 1700 },
            strongAgainst: [],
            weakAgainst: ["fighting"],
            level: 18
        },
        morty: {
            name: "Morty",
            title: "The Ghost-Sighted Seer",
            type: "ghost",
            badge: "Fog Badge",
            spriteUrl: "assets/gym-leaders/morty.png",
            pokemon: [
                { id: 198, name: "Murkrow", ace: true },
                { id: 200, name: "Misdreavus", ace: true },
                { id: 94, name: "Gengar", ace: true }
            ],
            challengeText: "Morty's eyes gleam in the tower's gloom. \"I can see what others cannot. I foresee... your defeat.\"",
            victoryText: "\"So even my sight has its limits. The Fog Badge is yours, trainer.\"",
            defeatText: "\"The mist parts and reveals only what I already knew — you were never ready.\"",
            reward: { money: 1900 },
            strongAgainst: ["ghost", "psychic"],
            weakAgainst: ["dark", "ghost"],
            level: 21
        },
        jasmine: {
            name: "Jasmine",
            title: "The Steel-Hearted Nurse",
            type: "steel",
            badge: "Mineral Badge",
            spriteUrl: "assets/gym-leaders/jasmine.png",
            pokemon: [
                { id: 82, name: "Magneton", ace: true },
                { id: 227, name: "Skarmory", ace: true },
                { id: 208, name: "Steelix", ace: true }
            ],
            challengeText: "Jasmine speaks softly but firmly. \"I nursed my Pokemon back to full strength myself. They won't fall easily now.\"",
            victoryText: "\"Thank you... you've shown my Pokemon — and me — real strength. Take the Mineral Badge.\"",
            defeatText: "\"I'm sorry, but my Pokemon's defenses are simply too hard to crack.\"",
            reward: { money: 2200 },
            strongAgainst: ["normal", "grass", "ice", "flying", "rock", "dragon"],
            weakAgainst: ["fire", "fighting", "ground"],
            level: 24
        },
        chuck: {
            name: "Chuck",
            title: "The Roaring Waterfall Warrior",
            type: "fighting",
            badge: "Storm Badge",
            spriteUrl: "assets/gym-leaders/chuck.png",
            pokemon: [
                { id: 57, name: "Primeape", ace: true },
                { id: 237, name: "Hitmontop", ace: true },
                { id: 62, name: "Poliwrath", ace: true }
            ],
            challengeText: "Chuck bursts out laughing. \"HAHAHA! I train under a waterfall to build my spirit! Show me yours!\"",
            victoryText: "\"HAHAHA! Now THAT'S a battle worth training for! Take the Storm Badge!\"",
            defeatText: "\"HAHAHA! Not bad, but my fists hit harder than any waterfall!\"",
            reward: { money: 2400 },
            strongAgainst: ["normal", "ice", "rock", "dark", "steel"],
            weakAgainst: ["flying", "psychic"],
            level: 27
        },
        pryce: {
            name: "Pryce",
            title: "The Weathered Ice Veteran",
            type: "ice",
            badge: "Glacier Badge",
            spriteUrl: "assets/gym-leaders/pryce.png",
            pokemon: [
                { id: 87, name: "Dewgong", ace: true },
                { id: 124, name: "Jynx", ace: true },
                { id: 221, name: "Piloswine", ace: true }
            ],
            challengeText: "Pryce's expression is unreadable as stone. \"I have seen decades of trainers pass through this gym. Show me you belong among them.\"",
            victoryText: "\"Experience alone does not win battles. You have earned the Glacier Badge.\"",
            defeatText: "\"Youthful spirit is no match for decades of cold, hard experience.\"",
            reward: { money: 2600 },
            strongAgainst: ["grass", "ground", "flying", "dragon"],
            weakAgainst: ["fire", "fighting", "rock", "steel"],
            level: 30
        },
        clair: {
            name: "Clair",
            title: "The Dragon Tamer of Blackthorn",
            type: "dragon",
            badge: "Rising Badge",
            spriteUrl: "assets/gym-leaders/clair.png",
            pokemon: [
                { id: 149, name: "Dragonite", ace: true },
                { id: 130, name: "Gyarados", ace: true },
                { id: 230, name: "Kingdra", ace: true }
            ],
            challengeText: "Clair's gaze is ice-cold. \"I am the finest Dragon-type trainer alive. You will need more than luck to beat my clan's power.\"",
            victoryText: "\"...Impressive. You've earned the Rising Badge, and my clan's respect.\"",
            defeatText: "\"Pathetic. My dragons have trained for this their entire lives.\"",
            reward: { money: 3200 },
            strongAgainst: ["dragon"],
            weakAgainst: ["ice", "dragon"],
            level: 33
        }
    };

    // Route-encounter order (matches data/routes.js gymLeader order, which
    // is how players actually reach them). Used to scale gym loss damage —
    // the last 4 gyms (sabrina onward) hit harder than the first 4.
    PT.Data.GymOrder = [
        "brock", "misty", "lt_surge", "erika", "sabrina", "koga", "blaine", "giovanni",
        // Johto gyms (§9.1) — appended so every Johto gym leader's index is
        // >= 4, matching gym-screen.js's "late gym" damage-scaling threshold.
        // This is deliberate: Johto is meaningfully harder throughout, not
        // just at the finish line (§1), so even Falkner (first Johto gym)
        // should hit like a late-Kanto gym.
        "falkner", "bugsy", "whitney", "morty", "jasmine", "chuck", "pryce", "clair"
    ];

    // Elite Four + Champion - gauntlet battles
    PT.Data.EliteFour = [
        {
            name: "Lorelei", title: "Ice Master", type: "ice",
            introText: "Lorelei adjusts her glasses. \"Welcome to the Pokemon League. I am the first of the Elite Four. Let me freeze you in your tracks.\"",
            defeatText: "\"How dare you! You won't get past the others!\"",
            pokemon: [
                { id: 87, name: "Dewgong", ace: true },
                { id: 80, name: "Slowbro", ace: true },
                { id: 131, name: "Lapras", ace: true }
            ]
        },
        {
            name: "Bruno", title: "Fighting Elite", type: "fighting",
            introText: "Bruno flexes his muscles. \"I trained with my Pokemon in the mountains. We've pushed beyond our limits. Can you match our power?\"",
            defeatText: "\"My fighting spirit wasn't enough?! Go... prove yourself to the rest.\"",
            pokemon: [
                { id: 106, name: "Hitmonlee", ace: true },
                { id: 107, name: "Hitmonchan", ace: true },
                { id: 68, name: "Machamp", ace: true }
            ]
        },
        {
            name: "Agatha", title: "Ghost Specialist", type: "ghost",
            introText: "Agatha cackles. \"I see the fear in your eyes, child. My ghosts will drag your Pokemon into the shadows!\"",
            defeatText: "\"Hmph! You're tougher than you look. But the worst is yet to come...\"",
            pokemon: [
                { id: 94, name: "Gengar", ace: true },
                { id: 24, name: "Arbok", ace: true },
                { id: 97, name: "Hypno", ace: true }
            ]
        },
        {
            name: "Lance", title: "Dragon Master", type: "dragon",
            introText: "Lance's cape billows behind him. \"I am the last of the Elite Four. My dragons have never been defeated. You will fall here.\"",
            defeatText: "\"I can't believe it... You've earned the right to face the Champion!\"",
            pokemon: [
                { id: 149, name: "Dragonite", ace: true },
                { id: 130, name: "Gyarados", ace: true },
                { id: 142, name: "Aerodactyl", ace: true }
            ]
        },
        {
            name: "Blue", title: "Pokemon Champion", type: "mixed",
            introText: "Blue smirks. \"Well, well. Look who made it. I've been waiting for you. Let's see if you've got what it takes to dethrone me!\"",
            defeatText: "\"No way! I can't believe I lost! You're the new Champion!\"",
            pokemon: [
                { id: 6, name: "Charizard", ace: true },
                { id: 9, name: "Blastoise", ace: true },
                { id: 3, name: "Venusaur", ace: true }
            ]
        }
    ];

    // ===== JOHTO ELITE FOUR (§9.2) =====
    // Rematch-flavored reuse of the 4 Kanto Elite Four personas (plus a
    // Champion rematch), with expanded final-evolution-only pools drawn
    // from the combined Gen I + Gen II roster. Same shape/consumption
    // pattern as PT.Data.EliteFour: screens/elite-four-screen.js picks one
    // random `pokemon` entry per trainer per run via state.rng.pick().
    PT.Data.JohtoEliteFour = [
        {
            name: "Lorelei", title: "Ice Master", type: "ice",
            introText: "Lorelei's glasses catch the light. \"You again! I've had a long time to sharpen my team since Kanto. Let's see if you've grown too.\"",
            defeatText: "\"Impressive... you're a different trainer than the one I remember.\"",
            pokemon: [
                { id: 131, name: "Lapras", ace: true },
                { id: 221, name: "Piloswine", ace: true },
                { id: 91, name: "Cloyster", ace: true },
                { id: 230, name: "Kingdra", ace: true }
            ]
        },
        {
            name: "Bruno", title: "Fighting Elite", type: "fighting",
            introText: "Bruno cracks his knuckles. \"Still training in the mountains, still pushing past my limits. Show me how far you've come!\"",
            defeatText: "\"Hah! Good! A rematch should feel like that. Go — the others are waiting.\"",
            pokemon: [
                { id: 68, name: "Machamp", ace: true },
                { id: 76, name: "Golem", ace: true },
                { id: 106, name: "Hitmonlee", ace: true },
                { id: 107, name: "Hitmonchan", ace: true },
                { id: 208, name: "Steelix", ace: true }
            ]
        },
        {
            name: "Agatha", title: "Ghost Specialist", type: "ghost",
            introText: "Agatha's cackle echoes off the league walls. \"Back for more nightmares? My ghosts have gotten meaner with age!\"",
            defeatText: "\"Ohoho! You've got some fight in you still. But the worst is yet to come...\"",
            pokemon: [
                { id: 94, name: "Gengar", ace: true },
                { id: 169, name: "Crobat", ace: true },
                { id: 89, name: "Muk", ace: true },
                { id: 110, name: "Weezing", ace: true }
            ]
        },
        {
            name: "Lance", title: "Dragon Master", type: "dragon",
            introText: "Lance's cape billows once more. \"I told you my dragons never lose. Let's find out if that's still true.\"",
            defeatText: "\"...Unbelievable. Go face the Champion — you've earned it twice over.\"",
            pokemon: [
                { id: 149, name: "Dragonite", ace: true },
                { id: 230, name: "Kingdra", ace: true },
                { id: 6, name: "Charizard", ace: true },
                { id: 142, name: "Aerodactyl", ace: true }
            ]
        },
        {
            name: "Blue", title: "Pokemon Champion", type: "mixed",
            introText: "Blue leans against the throne, arms crossed. \"Didn't think I'd let the title go that easily, did you? I've been training nonstop since Kanto.\"",
            defeatText: "\"...Ha. HA! Unbelievable! You've done it again. You're still the Champion!\"",
            // Deliberately avoids duplicating Lance's dragon lean (§9.2) —
            // a mixed, non-dragon roster spanning Gen I + Gen II final evos.
            pokemon: [
                { id: 143, name: "Snorlax", ace: true },
                { id: 65, name: "Alakazam", ace: true },
                { id: 248, name: "Tyranitar", ace: true },
                { id: 160, name: "Feraligatr", ace: true },
                { id: 157, name: "Typhlosion", ace: true },
                { id: 154, name: "Meganium", ace: true }
            ]
        }
    ];

    // ===== RED CAPSTONE BATTLE (§9.3) =====
    // Fixed 6-Pokemon roster, all aces, presented in random order each run
    // (screens/red-capstone-screen.js shuffles this with state.rng.shuffle
    // at the start of the fight — order here is just the canonical list).
    PT.Data.RedCapstone = {
        name: "Red", title: "The Silent Trainer of Mt. Silver",
        spriteUrl: "assets/gym-leaders/red.png",
        introText: "Red says nothing. He simply raises a Poke Ball.",
        defeatText: "Red gives a small, respectful nod, and says nothing at all.",
        pokemon: [
            { id: 6, name: "Charizard", ace: true },
            { id: 9, name: "Blastoise", ace: true },
            { id: 3, name: "Venusaur", ace: true },
            { id: 18, name: "Pidgeot", ace: true },
            { id: 128, name: "Tauros", ace: true },
            { id: 25, name: "Pikachu", ace: true }
        ]
    };
})();
