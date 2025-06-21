# Cleanup Instructions

The following files have been simplified or are no longer needed:

1. Delete these files:

   - `public/render.json` (not needed with HashRouter)
   - `public/static.json` (not needed with HashRouter)
   - `public/rewrite.json` (not needed with HashRouter)
   - `public/_redirects` (not needed with HashRouter)
   - `client/build.js` (not needed with simplified approach)
   - `client/RENDER_SETUP.md` (not needed with simplified approach)
   - This file (cleanup.md) once you're done

2. Simplify package.json:
   - Change build command back to just `vite build` without the extra script

The switch to HashRouter eliminates the need for server configuration while still allowing navigation within the app.
