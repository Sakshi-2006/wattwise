# WattWise

WattWise is a TypeScript + Next.js web application that provides a polished, responsive frontend built with Tailwind CSS and shadcn components. This repository contains the source for the WattWise UI and support tooling.

Live demo: https://wattwise-lyart.vercel.app/

## Features

- Next.js + TypeScript foundation
- Responsive UI built with Tailwind CSS
- Component-driven UI (shadcn / Base UI)
- Lightweight animations and iconography

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn (UI components)
- lucide-react (icons)

## Getting started

Prerequisites

- Node.js (recommended >= 18)
- pnpm (this project uses pnpm as the package manager)

Install dependencies

```bash
pnpm install
```

Run the development server

```bash
pnpm dev
```

Build for production

```bash
pnpm build
```

Start the production server

```bash
pnpm start
```

## Scripts

- `pnpm dev` — start Next.js in development mode
- `pnpm build` — build the app for production
- `pnpm start` — run the built production server

These are defined in package.json and align with the Next.js defaults.

## Environment & Deployment

The project is ready to deploy on Vercel (recommended for Next.js apps). If the app requires any environment variables, add them in the Vercel dashboard or create a `.env.local` file locally (do not commit secrets to Git).

## Contributing

Contributions, bug reports, and feature requests are welcome. Please open an issue or submit a pull request with a clear description of the change.

## License

Add a LICENSE file to this repository to specify the project license. If you want a suggestion, MIT is a common permissive choice.

---

If you'd like, I can also:
- Add a suggested CODE_OF_CONDUCT.md and CONTRIBUTING.md
- Create a basic LICENSE (MIT/Apache)
- Add more detailed setup or environment variable instructions if you provide them
