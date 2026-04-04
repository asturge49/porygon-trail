// Porygon Trail - Login Screen
// Username + 4-digit PIN — no email, no password rules
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.LOGIN = {
        render(container) {
            const auth = PT.Engine.Auth;
            let mode = 'signin';

            function showError(msg) {
                const el = document.getElementById('login-error');
                if (el) { el.textContent = msg; el.style.display = 'block'; }
            }

            function setLoading(loading) {
                const btn = document.getElementById('btn-submit');
                if (!btn) return;
                btn.disabled = loading;
                btn.textContent = loading ? 'LOADING...' : (mode === 'signin' ? 'SIGN IN' : 'CREATE');
            }

            function buildScreen() {
                container.innerHTML = '';
                const div = document.createElement('div');
                div.className = 'screen';
                div.style.cssText = 'padding: 20px; display: flex; flex-direction: column; gap: 0;';

                div.innerHTML = `
                    <div style="font-size: 10px; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">
                        ${mode === 'signin' ? 'SIGN IN' : 'NEW TRAINER'}
                    </div>

                    <div style="font-size: 7px; color: var(--gb-dark); margin-bottom: 4px;">TRAINER NAME</div>
                    <input type="text" id="input-username" maxlength="12"
                           autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                           style="width: 100%; box-sizing: border-box; padding: 8px 10px;
                                  font-family: inherit; font-size: 8px;
                                  background: var(--gb-lightest); border: 2px solid var(--gb-dark);
                                  color: var(--gb-darkest); margin-bottom: 14px; outline: none;">

                    <div style="font-size: 7px; color: var(--gb-dark); margin-bottom: 4px;">4-DIGIT PIN</div>
                    <input type="password" id="input-pin" maxlength="4"
                           inputmode="numeric" pattern="[0-9]*" autocomplete="off"
                           placeholder="••••"
                           style="width: 100%; box-sizing: border-box; padding: 8px 10px;
                                  font-family: inherit; font-size: 16px; letter-spacing: 8px;
                                  background: var(--gb-lightest); border: 2px solid var(--gb-dark);
                                  color: var(--gb-darkest); margin-bottom: 6px; outline: none;">

                    <div id="login-error"
                         style="font-size: 7px; color: #880000; text-align: center;
                                min-height: 14px; margin-bottom: 10px; display: none;"></div>

                    <button class="btn btn-wide" id="btn-submit" style="margin-bottom: 6px;">
                        ${mode === 'signin' ? 'SIGN IN' : 'CREATE'}
                    </button>

                    <button class="btn btn-wide btn-small" id="btn-toggle" style="margin-bottom: 4px;">
                        ${mode === 'signin' ? 'NEW TRAINER? CREATE ACCOUNT' : 'HAVE AN ACCOUNT? SIGN IN'}
                    </button>

                    <div style="font-size: 6px; color: var(--gb-dark); text-align: center; margin-top: 12px; line-height: 1.6;">
                        ${mode === 'signin'
                            ? 'Your scores appear on the global leaderboard.<br>Continue your journey on any device.'
                            : 'Username: 3-12 chars (letters, numbers, _)<br>PIN: 4 digits \u2014 keep it secret!'}
                    </div>
                `;

                container.appendChild(div);

                const usernameInput = document.getElementById('input-username');
                const pinInput = document.getElementById('input-pin');

                // Enforce numeric PIN
                pinInput.addEventListener('input', () => {
                    pinInput.value = pinInput.value.replace(/[^0-9]/g, '');
                });

                // Submit on Enter
                pinInput.addEventListener('keydown', e => {
                    if (e.key === 'Enter') document.getElementById('btn-submit').click();
                });
                usernameInput.addEventListener('keydown', e => {
                    if (e.key === 'Enter') pinInput.focus();
                });

                document.getElementById('btn-toggle').addEventListener('click', () => {
                    mode = mode === 'signin' ? 'signup' : 'signin';
                    buildScreen();
                });

                document.getElementById('btn-submit').addEventListener('click', async () => {
                    document.getElementById('login-error').style.display = 'none';

                    const username = usernameInput.value.trim();
                    const pin = pinInput.value.trim();

                    if (!username) { showError('Enter a trainer name.'); return; }
                    if (!/^[a-zA-Z0-9_]{3,12}$/.test(username)) {
                        showError('3-12 chars: letters, numbers, _ only.');
                        return;
                    }
                    if (pin.length !== 4) { showError('PIN must be exactly 4 digits.'); return; }

                    setLoading(true);

                    const result = mode === 'signin'
                        ? await auth.signIn(username, pin)
                        : await auth.signUp(username, pin);

                    if (result.success) {
                        PT.App.goto('TITLE');
                    } else {
                        showError(result.error || 'Something went wrong.');
                        setLoading(false);
                    }
                });

                setTimeout(() => usernameInput.focus(), 50);
            }

            buildScreen();
        }
    };
})();
