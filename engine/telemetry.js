// Porygon Trail - Telemetry
// Fire-and-forget event logging to Supabase pt_events table.
// All events are viewable in the Supabase dashboard (Table Editor or SQL Editor).
// RLS allows insert only — reads require the service role (dashboard bypasses RLS automatically).
//
// Event types logged:
//   game_start   — { starter_id, starter_name, trainer_name }
//   game_over    — { route, route_index, reason, days_elapsed, score, badges, pokedex_count }
//   victory      — { days_elapsed, score, badges, pokedex_count }
//
// Johto expansion event types (§13.3 of JOHTO_EXPANSION_SCOPE.md):
//   johto_entered            — { party_size, party_ids, battle_star_total, badge_count,
//                                 legendary_in_party, days_elapsed_kanto }
//                               logged from screens/johto-starter-screen.js's enterJohto()
//   johto_gym_cleared        — { leader_id, badge, pokemon_id, win_chance, party_size,
//                                 badge_count, days_elapsed }
//                               logged from screens/gym-screen.js's resolveGymBattle() win
//                               branch, gated on state.region === 'johto'
//   johto_elite_four_cleared — { party_size, party_ids, badge_count, days_elapsed,
//                                 days_elapsed_johto }
//                               logged from screens/elite-four-screen.js where
//                               state.johtoE4Cleared is set
//   capstone_result          — { red_mons_defeated (0-6), score_bonus, party_size, party_ids,
//                                 days_elapsed }
//                               NOT YET WIRED — no capstone battle screen exists in this
//                               codebase yet (see the "Red capstone battle" comment in
//                               screens/elite-four-screen.js, which names the future
//                               screens/red-capstone-screen.js). Call
//                               PT.Engine.Telemetry.logCapstoneResult(state, redMonsDefeated)
//                               below once that screen resolves the fight — see its JSDoc.
//   johto_run_ended           — { result: 'won'|'lost', location, reason, days_elapsed,
//                                  score, badges, pokedex_count, party_ids }
//                                logged from screens/victory-screen.js and
//                                screens/gameover-screen.js, gated on state.region === 'johto'
//   legendary_roam_encountered / legendary_roam_caught — { beast_id, beast_name, route, day }
//                               logged from screens/encounter-screen.js, gated on
//                               pokemon.roaming (see engine/encounter-engine.js's
//                               rollRoamEncounter, §8.5)
//   session_start / session_heartbeat — { session_id }
//                               time-on-page tracking for internal reporting only (not
//                               surfaced anywhere in-game). session_start fires once per
//                               page load; session_heartbeat fires every HEARTBEAT_MS
//                               while the tab is the visible/foreground tab (paused via
//                               the Page Visibility API when backgrounded, so an idle
//                               tab sitting open doesn't inflate the numbers). Query
//                               approximate session length in the Supabase SQL editor:
//                                 select
//                                   payload->>'session_id' as session_id,
//                                   user_id,
//                                   min(created_at) as started_at,
//                                   max(created_at) as last_seen_at,
//                                   count(*) filter (where event_type = 'session_heartbeat')
//                                     * (30.0/60) as active_minutes  -- 30s HEARTBEAT_MS
//                                 from pt_events
//                                 where event_type in ('session_start', 'session_heartbeat')
//                                 group by session_id, user_id
//                                 order by started_at desc;
//                               active_minutes undercounts slightly (no partial credit for
//                               the time between the last heartbeat and tab close), and
//                               last_seen_at - started_at overcounts if the tab was left
//                               open in the background — use whichever fits the report.
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

    // §13.3 capstone_result — TODO for whoever builds the Red capstone battle
    // screen (referenced as screens/red-capstone-screen.js in
    // screens/elite-four-screen.js's comments; engine/scoring.js already has
    // calculateRedCapstoneBonus(redMonsDefeated) and state.redMonsDefeated is
    // already read by screens/gameover-screen.js and screens/victory-screen.js
    // for display, so the capstone screen just needs to set
    // state.redMonsDefeated and then call this once the fight resolves —
    // win, loss, or the player walking away — before routing to
    // VICTORY/GAMEOVER.
    function logCapstoneResult(state, redMonsDefeated) {
        if (!state) return;
        const scoreBonus = PT.Engine.Scoring ? PT.Engine.Scoring.calculateRedCapstoneBonus(redMonsDefeated) : undefined;
        logEvent('capstone_result', {
            red_mons_defeated: Math.max(0, Math.min(6, redMonsDefeated || 0)),
            score_bonus: scoreBonus,
            party_size: state.party.length,
            party_ids: state.party.map(p => p.id),
            days_elapsed: state.daysElapsed
        });
    }

    // ===== Session/time-on-page tracking (internal reporting only) =====
    const HEARTBEAT_MS = 30000; // 30s — see the SQL comment above for the math this implies
    let sessionId = null;
    let heartbeatTimer = null;

    function startSessionTracking() {
        if (sessionId) return; // idempotent — only one session per page load
        sessionId = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        logEvent('session_start', { session_id: sessionId });

        heartbeatTimer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                logEvent('session_heartbeat', { session_id: sessionId });
            }
        }, HEARTBEAT_MS);
    }

    PT.Engine.Telemetry = { logEvent, logCapstoneResult, startSessionTracking };
})();
