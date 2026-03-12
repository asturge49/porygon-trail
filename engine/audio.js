// Porygon Trail - Retro Audio System (Web Audio API)
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    let ctx = null;
    let enabled = true;

    function getContext() {
        if (!ctx) {
            try {
                ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                enabled = false;
            }
        }
        return ctx;
    }

    function playTone(freq, duration, type, volume) {
        if (!enabled) return;
        const c = getContext();
        if (!c) return;

        // Resume context if suspended (browser autoplay policy)
        if (c.state === 'suspended') c.resume();

        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);

        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, c.currentTime);
        gain.gain.setValueAtTime(volume || 0.08, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

        osc.start(c.currentTime);
        osc.stop(c.currentTime + duration);
    }

    function playSequence(notes, baseTime) {
        if (!enabled) return;
        const c = getContext();
        if (!c) return;
        if (c.state === 'suspended') c.resume();

        let time = 0;
        notes.forEach(([freq, dur, type]) => {
            setTimeout(() => playTone(freq, dur, type || 'square', 0.06), time * 1000);
            time += dur * 0.7;
        });
    }

    const Audio = {
        toggle() { enabled = !enabled; return enabled; },
        isEnabled() { return enabled; },

        // Button click
        click() {
            playTone(800, 0.05, 'square', 0.04);
        },

        // Screen transition
        transition() {
            playSequence([
                [440, 0.06],
                [660, 0.06]
            ]);
        },

        // Pokemon encounter
        encounter() {
            playSequence([
                [330, 0.1],
                [440, 0.1],
                [550, 0.1],
                [660, 0.15]
            ]);
        },

        // Catch success
        catchSuccess() {
            playSequence([
                [523, 0.1],
                [659, 0.1],
                [784, 0.1],
                [1047, 0.2]
            ]);
        },

        // Catch fail
        catchFail() {
            playSequence([
                [440, 0.15],
                [330, 0.15],
                [220, 0.25]
            ]);
        },

        // Ball shake
        ballShake() {
            playTone(200, 0.1, 'triangle', 0.05);
        },

        // Gym victory
        gymVictory() {
            playSequence([
                [523, 0.12],
                [587, 0.12],
                [659, 0.12],
                [784, 0.12],
                [880, 0.12],
                [1047, 0.3]
            ]);
        },

        // Gym defeat
        gymDefeat() {
            playSequence([
                [440, 0.2],
                [370, 0.2],
                [330, 0.2],
                [220, 0.4]
            ]);
        },

        // Event appear
        eventAppear() {
            playSequence([
                [330, 0.08],
                [440, 0.08],
                [330, 0.12]
            ]);
        },

        // Heal
        heal() {
            playSequence([
                [523, 0.1],
                [587, 0.1],
                [659, 0.1],
                [784, 0.15],
                [659, 0.1],
                [784, 0.2]
            ]);
        },

        // Damage taken
        damage() {
            playTone(150, 0.15, 'sawtooth', 0.06);
        },

        // Game over
        gameOver() {
            playSequence([
                [440, 0.3, 'triangle'],
                [370, 0.3, 'triangle'],
                [330, 0.3, 'triangle'],
                [294, 0.3, 'triangle'],
                [220, 0.6, 'triangle']
            ]);
        },

        // Victory fanfare
        victory() {
            playSequence([
                [523, 0.1],
                [659, 0.1],
                [784, 0.1],
                [1047, 0.15],
                [784, 0.1],
                [1047, 0.3],
                [1319, 0.4]
            ]);
        },

        // Step/travel
        step() {
            playTone(200 + Math.random() * 100, 0.03, 'square', 0.02);
        },

        // Buy item
        buy() {
            playSequence([
                [600, 0.06],
                [800, 0.08]
            ]);
        }
    };

    PT.Engine.Audio = Audio;
})();
