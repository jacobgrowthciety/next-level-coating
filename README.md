# Next Level Coatings

Website rebuild for Next Level Coatings — Arizona's top concrete coatings specialists.
See [`reference/BRIEF.md`](reference/BRIEF.md) for the full project brief, brand tokens, and sitemap.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (v4)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
```

## Structure

```
src/
  components/   reusable UI building blocks
  sections/     page sections (hero, process, etc.)
  pages/        route-level page components
  animations/   shared Framer Motion variants
  assets/       imported images/fonts
reference/      read-only brand assets, brief, and hero video (do not modify)
```
