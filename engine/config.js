// Porygon Trail - Supabase Configuration
// Picks credentials by hostname so prod data is only ever reachable from the real
// production domain. Every PR preview, the persistent staging URL, and local dev
// all hit the staging project instead. See supabase/schema.sql for the shared schema.
window.PorygonTrail = window.PorygonTrail || {};

const PT_PROD_HOSTS = ['porygontrail.com', 'www.porygontrail.com', 'porygon-trail.vercel.app'];
const PT_IS_PROD = PT_PROD_HOSTS.includes(window.location.hostname);

window.PorygonTrail.Config = PT_IS_PROD
    ? {
        supabaseUrl: 'https://anxkyksrmvtsmhdaktrq.supabase.co',
        supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueGt5a3NybXZ0c21oZGFrdHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTMxODksImV4cCI6MjEwMzE4OTE4OX0.U2QcSjNMGqRvg82rbG1oHrQOr-i_Lfb-oeBLRJmP-2k'
    }
    : {
        supabaseUrl: 'https://glcryiuqtskxutugwenr.supabase.co',
        supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3J5aXVxdHNreHV0dWd3ZW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDEwMjUsImV4cCI6MjA5MDQ3NzAyNX0.hMobFcRT_UqXJT2Ux04nGBiz8Lo4GJyhdNTVZ6mdYn0'
    };
