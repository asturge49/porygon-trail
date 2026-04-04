// Porygon Trail - Telemetry
// Fire-and-forget event logging to Supabase pt_events table.
// All events are viewable in the Supabase dashboard (Table Editor or SQL Editor).
// RLS allows insert only — reads require the service role (dashboard bypasses RLS automatically).
//
// Event types logged:
//   game_start   — { starter_id, starter_name, trainer_name }
//   game_over    — { route, route_index, reason, days_elapsed, score, badges, pokedex_count }
//   victory      — { days_elapsed, score, badges, pokedex_count }
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function logEvent(eventType, payload) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isConfigured()) return;

        const client = auth.getClient();
        if (!client) return;

        const user = auth.getCurrentUser();

        // Fire and forget — never block the game on telemetry
        client.from('pt_events').insert({
            user_id: user ? user.id : null,
            event_type: eventType,
            payload: payload || {}
        }).then(({ error }) => {
            if (error) console.warn('Telemetry error:', eventType, error.message);
        });
    }

    PT.Engine.Telemetry = { logEvent };
})();
