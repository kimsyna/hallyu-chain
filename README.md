# Hallyu Chain Website

This repository contains the marketing website for **Hallyu Chain (HALL)**, a commercial-grade cryptocurrency project built for the global K-POP community.

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

## Bridge and Multi-chain Deployment
- `contracts/Bridge.sol` locks HALL for cross-chain transfers. Bridge fees are applied and a configurable portion is burned automatically.
- Deploy contracts to multiple networks by providing a comma-separated list of network names:

```bash
NETWORKS=sepolia,bscTestnet npm run multi-deploy
```

RPC URLs and the deployer's private key are read from environment variables (`SEPOLIA_RPC_URL`, `BSC_RPC_URL`, `PRIVATE_KEY`).

## Tokenomics
- Total supply: 10,000,000,000 HALL
- DAO treasury: 50%
- Community rewards: 20%
- Team: 15%
- Advisors: 5%
- Investors: 10%

## Roadmap
- 2026 Q1: Launch mainnet
- 2026 Q2: Release smart contract platform
- 2026 Q3: Expand global partnerships
- 2026 Q4: Implement cross-chain bridge

## DAO
Hallyu Chain is governed by a decentralized autonomous organization. HALL token holders can propose and vote on upgrades and community initiatives through on-chain governance.

## Design Tokens
The site relies on CSS custom properties for theming. Two key tokens exposed for the hero section are:

- `--hero-gradient`: controls the animated gradient backdrop of the hero. Defaults to a light pastel gradient and shifts to a deeper palette in dark mode.
- `--hero-blur`: sets the blur radius applied to the hero backdrop, enabling easy refinement of the effect.

### Spacing Scale
To maintain consistent spacing across the site, a small scale of custom properties is defined in `style.css`:

- `--space-xs` – `0.5rem`
- `--space-sm` – `1rem`
- `--space-md` – `1.5rem`
- `--space-lg` – `2rem`

These tokens drive margins, paddings and gaps for common layout components. The values adjust in media queries to keep spacing proportional on smaller screens.

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
npm run check-locales
```

This script ensures every locale file has the same keys as `locales/en.json` and reports any missing or extra entries. The check is also executed in the CI pipeline.
