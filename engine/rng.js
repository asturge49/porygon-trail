// Porygon Trail - Seeded Random Number Generator
(function() {
    window.PorygonTrail = window.PorygonTrail || {};
    window.PorygonTrail.Engine = window.PorygonTrail.Engine || {};

    // Mulberry32 seeded PRNG
    function createRNG(seed) {
        let s = seed | 0;

        function next() {
            s |= 0;
            s = s + 0x6D2B79F5 | 0;
            let t = Math.imul(s ^ s >>> 15, 1 | s);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }

        return {
            // Random float [0, 1)
            random: next,

            // Random integer [min, max] inclusive
            randInt(min, max) {
                return Math.floor(next() * (max - min + 1)) + min;
            },

            // Returns true with given percent chance (0-100)
            chance(percent) {
                return next() * 100 < percent;
            },

            // Pick random element from array
            pick(arr) {
                if (!arr || arr.length === 0) return null;
                return arr[Math.floor(next() * arr.length)];
            },

            // Weighted random selection
            // items: array of { weight: number, ...otherProps }
            weightedChoice(items) {
                if (!items || items.length === 0) return null;
                const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
                let roll = next() * totalWeight;
                for (const item of items) {
                    roll -= (item.weight || 1);
                    if (roll <= 0) return item;
                }
                return items[items.length - 1];
            },

            // Shuffle array in place
            shuffle(arr) {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(next() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            },

            // Get/set seed
            getSeed() { return seed; },
            getState() { return s; }
        };
    }

    window.PorygonTrail.Engine.RNG = { createRNG };
})();
