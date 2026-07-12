# Voyora — Travel Companion Website

A React + Vite travel platform: a real 3D Earth hero, a liquid-glass nav with
a connected day/night mode toggle and live search, mountain silhouettes under
the globe, dedicated Login/Signup pages, and a full set of routed pages
(Explore, Destinations, Trip Planner, AI Guide, Travel Blog, Explore
Countries, Plan My Trip, and individual destination pages).

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

If you deploy the `dist/` folder to a static host, make sure it's configured
for SPA fallback (all unknown paths serve `index.html`) since this is a
client-side-routed app — most hosts (Netlify, Vercel, Cloudflare Pages) do
this automatically or with a one-line config.

## Project structure

```
src/
  components/
    Navbar.jsx          # fixed liquid-glass nav — links, live search, ThemeToggle, Login/Signup
    ThemeToggle.jsx       # sun/moon button, connected to ThemeContext
    SearchBox.jsx          # live-filtering search input + dropdown (hero + navbar)
    Hero.jsx                # headline, search bar, CTA buttons, stats, mountains
    Globe3D.jsx               # real 3D Earth (react-three-fiber + custom shaders)
    MountainsSilhouette.jsx    # layered SVG mountain range under the hero
    Destinations.jsx            # "Popular Destinations" section on the homepage
    Footer.jsx                    # shared footer with links to every page
    Layout.jsx                     # Navbar + <Outlet/> + Footer, used by main routes
    PageHeader.jsx                   # reusable header for secondary pages
    AuthLayout.jsx                    # split-screen shell for Login/Signup
  pages/
    Home.jsx                          # Hero + Destinations
    Explore.jsx
    DestinationsPage.jsx                # full destinations listing
    DestinationDetail.jsx                # /destinations/:slug — one page, six cities
    TripPlanner.jsx
    AIGuide.jsx
    TravelBlog.jsx
    ExploreCountries.jsx
    PlanMyTrip.jsx
    Login.jsx                             # standalone auth page (no navbar/footer)
    Signup.jsx                             # standalone auth page (no navbar/footer)
    NotFound.jsx
  context/
    ThemeContext.jsx                        # day/night mode state, persisted to localStorage
  three/
    earthShaders.js                          # GLSL: day/night blend + atmosphere glow
    latLngToVector3.js                        # lat/lng -> 3D position helper (for pins)
  data/
    destinations.js                            # shared data for cards, search, and detail pages
  hooks/
    useScrollY.js
    lerpHexColor.js
  App.jsx                                       # route table
  main.jsx                                       # BrowserRouter + ThemeProvider + App
  index.css                                       # theme variables + liquid glass + mountains
public/
  textures/                                        # Earth day/night/clouds/specular/normal maps
  images/                                            # landmark photos used on Login/Signup
```

## Day / night mode

Everything is driven by CSS custom properties, switched by a single
`data-theme="dark"|"light"` attribute on `<html>` (see `ThemeContext.jsx`).
Toggling it re-themes the whole site — backgrounds, text, borders, glass
panels, the starfield, and the mountain colors — with no per-page logic
needed. The choice is saved to `localStorage`, so it's remembered on your
next visit, and it applies identically across every route since `Layout.jsx`
wraps all of them.

- **Dark mode**: space background, visible starfield, dark mountain ridges,
  scroll darkens the page further toward black.
- **Light mode**: soft blue-white "cloud" background, starfield hidden,
  lighter mountain ridges, scroll shifts toward a slightly deeper sky blue
  (never goes black).

## The 3D globe

Built with `three`, `@react-three/fiber`, and `@react-three/drei`, using
your five source textures (resized from 8K down to 2048px/1024px — the
originals were 23MB combined, far too heavy for a browser):
- A custom shader blends day and night textures based on sun direction, so
  the globe has a real terminator line (day side + night side with city
  lights).
- Specular map adds an ocean highlight; normal map adds faint terrain relief.
- A separate, slightly larger sphere renders clouds with transparency,
  rotating a bit faster than the Earth.
- An outer additive-blended shell creates the atmosphere glow.
- Six glowing pins mark real destinations and pulse gently.
- Drag to rotate (zoom/pan disabled to keep it contained in the hero).

## Routing

All navbar links, hero CTA buttons ("Explore Countries", "Plan My Trip"),
and every destination card (on the homepage and the Destinations page) are
real `react-router-dom` links to their own pages. Unknown URLs fall back to
a 404 page with a link home.

## Design tokens

- Colors: theme-aware CSS variables (`--surface`, `--text-primary`,
  `--border-soft`, `--glass-*`, etc.) — see `index.css` for the full dark/light
  token tables.
- Accent gradient: `--color-nebula-blue` → `--color-nebula-violet`, used for
  buttons and the "Beyond Borders" text gradient in both themes.
- Fonts: Sora (display/headings), Inter (body).

## Search

`SearchBox.jsx` is a single reusable component used in two places:
- **Hero search bar** — full-width, with a submit button.
- **Navbar search icon** — click it to open a popover version of the same
  component (desktop), or it's built into the mobile menu.

It filters the shared `destinations` data live as you type (matching name,
country, or tag), shows up to 6 results in a dropdown, supports arrow-key
navigation + Enter to select, and clicking/selecting a result routes straight
to that destination's page. If you want it to search a bigger catalog later,
just expand the array in `data/destinations.js` — no component changes
needed.

## Light theme

The light theme was originally near-white with near-black text, which read
as too harsh/high-contrast. It's now a softer, slightly desaturated palette
(muted blue-grays instead of pure white/black) across backgrounds, text,
borders, and glass panels — see the `html[data-theme='light']` block in
`index.css` if you want to tune it further.

## Login & Signup

Two standalone pages (`/login`, `/signup`) — intentionally outside the main
`Layout`, so they don't carry the site navbar/footer; they're a focused
split-screen flow instead:
- **Login** — the Grand Canyon photo as a full-bleed visual with a "welcome
  back" message, form on the right.
- **Signup** — a 4-photo mosaic (Eiffel Tower, Burj Khalifa, Statue of
  Liberty, Mount Fuji) for a "so many places to go" feel, form on the right.

The navbar's "Login" button links to `/login`, and "Get Started" links to
`/signup`. Both forms are UI-only right now — no backend wired up.

## Globe loading transition

`Globe3D.jsx` uses drei's `useProgress` (tracked against the shared texture
loading manager) to show a small spinner + percentage overlay while the
Earth textures are downloading, and the globe itself eases in with a smooth
scale-in animation once everything's ready, instead of just popping into
view.

## Destination data

Each destination now lives in its own file under `src/data/destinations/`
(e.g. `paris.js`, `spain.js`, `egypt.js`), combined by `index.js`. This makes
it much easier to edit or add a destination without scrolling through one
giant file — just add a new file and one line to `index.js`, or ask me to.

The catalog currently has 32 destinations: the original 6 cities (Paris,
Tokyo, Dubai, Sydney, New York, Rio) plus 26 countries. Each entry has:

```js
{
  slug, name, country,       // country doubles as the badge shown on cards —
                              // a real country for the 6 cities, a region
                              // (e.g. "Europe", "Southeast Asia") for the rest
  tag, lat, lng, description, highlights, bestTime, currency,
  accentColor,                // used to theme that destination's page
  heroImage,                  // optional — real photo path, if we have one
  gallery,                    // optional — extra photos (currently only Paris)
}
```

**Photos vs. gradients**: 6 destinations have real photos (Paris, Tokyo,
Dubai, Sydney, New York, Rio). The other 26 don't have a matching uploaded
image, so their cards and detail-page hero use a themed gradient built from
`accentColor` instead of a fabricated photo. If you upload real photos for
any of them, just add a `heroImage: '/images/whatever.jpg'` line to that
destination's file (drop the image in `public/images/` first) and it'll
switch over automatically — no other code changes needed.

The Destinations listing page (`/destinations`) has a region filter, and
Explore Countries (`/explore-countries`) shows real counts per region and
deep-links into that filtered view.

## Next steps

- Wire the "Login" / "Get Started" buttons and the AI Guide chat / Plan My
  Trip form up to a real backend
- Consider lazy-loading the globe (`React.lazy`) since `three` is the
  largest chunk in the bundle
- Add a `sitemap`/meta tags per page once content is final
