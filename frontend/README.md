# Hallyu Chain React Frontend

This directory hosts the interactive marketing site for **Hallyu Chain (HALL)** built with [React](https://react.dev/) and [Vite](https://vitejs.dev/). It mirrors the static root site but enhances it with client‑side routing, translations, and dynamic animations.

## Features

- Animated hero section and scroll‑triggered reveals powered by [GSAP](https://greensock.com/gsap/).
- Tokenomics view sourced from the shared [`tokenomics.json`](../tokenomics.json) file.
- Multi‑language interface using [i18next](https://www.i18next.com/) with translations loaded from the root [`locales/`](../locales/) directory.
- Responsive layout with a sticky navigation bar and back‑to‑top control.
- Metadata management through `react-helmet`.

## Development

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at [http://localhost:5173](http://localhost:5173) and automatically reloads when files change. Translation files and other shared resources are read from the root of the repository, so keep the project structure intact when developing.

## Testing

Run ESLint to catch common issues:

```bash
npm run lint
```

Additional tests can be executed from the project root with `npm test`.

## Production Build

Create an optimized build in `frontend/dist`:

```bash
npm run build
```

Preview the built site locally:

```bash
npm run preview
```

The contents of `dist` can be served by any static web host for production deployments.
