// Porygon Trail - Screen Manager
(function() {
    const PT = window.PorygonTrail = window.PorygonTrail || {};
    PT.Engine = PT.Engine || {};
    PT.Screens = PT.Screens || {};

    const ScreenManager = {
        container: null,
        currentScreen: null,
        currentScreenName: null,
        screenStack: [],
        params: null,

        init(container) {
            this.container = container;
        },

        goto(screenName, params) {
            this._cleanup();
            this.screenStack = [];
            this.currentScreenName = screenName;
            this.params = params || {};
            this._playScreenSound(screenName);
            this._render();
        },

        push(screenName, params) {
            if (this.currentScreenName) {
                this.screenStack.push({
                    name: this.currentScreenName,
                    params: this.params
                });
            }
            this._cleanup();
            this.currentScreenName = screenName;
            this.params = params || {};
            this._render();
        },

        pop() {
            if (this.screenStack.length === 0) return;
            this._cleanup();
            const prev = this.screenStack.pop();
            this.currentScreenName = prev.name;
            this.params = prev.params;
            this._render();
        },

        _render() {
            const screen = PT.Screens[this.currentScreenName];
            if (!screen) {
                console.error('Screen not found:', this.currentScreenName);
                return;
            }
            this.container.innerHTML = '';
            this.currentScreen = screen;
            screen.render(this.container, PT.State, this.params);
        },

        _cleanup() {
            if (this.currentScreen && this.currentScreen.cleanup) {
                this.currentScreen.cleanup();
            }
        },

        _playScreenSound(screenName) {
            const A = PT.Engine.Audio;
            if (!A) return;
            switch(screenName) {
                case 'ENCOUNTER': A.encounter(); break;
                case 'EVENT': A.eventAppear(); break;
                case 'GAMEOVER': A.gameOver(); break;
                case 'VICTORY': A.victory(); break;
                case 'GYM': A.eventAppear(); break;
                case 'TRAVEL': A.step(); break;
                default: A.click(); break;
            }
        }
    };

    // Typewriter text effect - animates text appearing character by character
    function typewriterEffect(element, text, speed) {
        speed = speed || 25;
        element.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return interval;
    }

    PT.Engine.ScreenManager = ScreenManager;
    PT.Engine.typewriter = typewriterEffect;
})();
