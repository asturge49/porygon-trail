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
            reward: { money: 500 },
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
            reward: { money: 800 },
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
            reward: { money: 1000 },
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
            reward: { money: 1200 },
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
            reward: { money: 1500 },
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
            reward: { money: 1800 },
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
            reward: { money: 2000 },
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
            reward: { money: 2500 },
            strongAgainst: ["electric", "fire", "rock", "poison"],
            weakAgainst: ["water", "grass", "ice"],
            level: 50
        }
    };

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
})();
