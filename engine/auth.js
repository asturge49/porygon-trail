// Porygon Trail - Auth System
// Username + 4-digit PIN authentication via Supabase Auth
// Email: username@porygontrail.app  |  Password: pt_PIN_PIN
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    let _client = null;
    let _currentUser = null;
    let _currentUsername = null;

    function isConfigured() {
        return PT.Config &&
               PT.Config.supabaseUrl !== 'YOUR_SUPABASE_URL' &&
               PT.Config.supabaseUrl !== '';
    }

    function getClient() {
        if (!isConfigured()) return null;
        if (!_client) {
            _client = supabase.createClient(PT.Config.supabaseUrl, PT.Config.supabaseAnonKey);
        }
        return _client;
    }

    function toEmail(username) {
        return `${username.toLowerCase().trim()}@porygontrail.app`;
    }

    function toPassword(pin) {
        return `pt_${pin}_${pin}`;
    }

    async function signIn(username, pin) {
        const client = getClient();
        if (!client) return { success: false, error: 'Not configured' };

        const { data, error } = await client.auth.signInWithPassword({
            email: toEmail(username),
            password: toPassword(pin)
        });

        if (error) {
            return { success: false, error: 'Incorrect username or PIN.' };
        }

        _currentUser = data.user;
        _currentUsername = data.user.user_metadata?.username || username.trim();
        return { success: true, username: _currentUsername };
    }

    async function signUp(username, pin) {
        const client = getClient();
        if (!client) return { success: false, error: 'Not configured' };

        // Check if username is already taken
        const { data: existing } = await client
            .from('pt_profiles')
            .select('username')
            .ilike('username', username.trim())
            .maybeSingle();

        if (existing) {
            return { success: false, error: 'That username is already taken.' };
        }

        const { data, error } = await client.auth.signUp({
            email: toEmail(username),
            password: toPassword(pin),
            options: { data: { username: username.trim() } }
        });

        if (error) {
            // If email already registered, it's a duplicate username
            if (error.message.includes('already registered')) {
                return { success: false, error: 'That username is already taken.' };
            }
            return { success: false, error: error.message };
        }

        if (data.user) {
            await client.from('pt_profiles').upsert({
                id: data.user.id,
                username: username.trim()
            }, { onConflict: 'id' });
            _currentUser = data.user;
            _currentUsername = username.trim();
        }

        return { success: true, username: _currentUsername };
    }

    async function signOut() {
        const client = getClient();
        if (client) await client.auth.signOut();
        _currentUser = null;
        _currentUsername = null;
    }

    // Call once on app load to restore a previous session
    async function restoreSession() {
        const client = getClient();
        if (!client) return false;

        const { data } = await client.auth.getSession();
        if (data.session?.user) {
            _currentUser = data.session.user;
            _currentUsername = _currentUser.user_metadata?.username ||
                               _currentUser.email?.split('@')[0] || null;
            return true;
        }
        return false;
    }

    function getCurrentUser() { return _currentUser; }
    function getCurrentUsername() { return _currentUsername; }
    function isLoggedIn() { return _currentUser !== null; }

    PT.Engine.Auth = {
        getClient,
        signIn,
        signUp,
        signOut,
        restoreSession,
        getCurrentUser,
        getCurrentUsername,
        isLoggedIn,
        isConfigured
    };
})();
