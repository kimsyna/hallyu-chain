# KPOP Protocol Website

This repository contains the marketing website for **KPOP Protocol (KPP)**, a commercial-grade cryptocurrency project built for the global K-POP community.

## Requirements
- Node.js >= 18.0.0

## Structure
- `index.html`: Single-page layout introducing the protocol, technology and token model, with sections for the Team, Corporate Identity, and Whitepaper.
- Icon-driven lists and a new resources section provide quick links to the whitepaper, GitHub repository and community channels.
- Navigation within the page is handled through in-page anchors.

Assets are styled with `style.css` and animations are handled in `main.js` using GSAP and a custom Web Component for the animated hero title.

The site is fully static and can be served by any web server.

## Features
- Multi-language interface (Korean, English, Chinese) with dynamic text switching.
- Animated hero titles implemented as a reusable Web Component.
- Scroll-triggered section reveals powered by GSAP.
- Responsive layout driven by modern CSS.
- Feature cards highlight fan participation, artist support, and global community building.

## Local Development
1. Clone the repository and change into the project directory:
   ```bash
   git clone <repo-url>
   cd codexer
   ```
2. Launch a simple HTTP server to serve the static files:
   ```bash
   python3 -m http.server 8080
   ```
3. Visit `http://localhost:8080` in your browser to explore the site locally.

Any web server (e.g., Nginx, Apache, GitHub Pages) can host the built site for production use.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Before committing changes to translation files in `locales/`, run the locale consistency check:

```bash
node scripts/check-locales.js
```

This script ensures every locale file has the same keys as `locales/en.json` and reports any missing or extra entries.
