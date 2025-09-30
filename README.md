## Personal Portfolio v3

Modern personal portfolio built with Next.js 15 and React 19. Project content is authored through Prisma ORM backed by MongoDB Atlas.

## Prerequisites

- Node.js 20+
- An active MongoDB Atlas cluster (or compatible MongoDB URI)

## Environment variables

Create a `.env.local` file from the template:

```bash
cp .env.example .env.local
```

Update the following variable with your MongoDB Atlas credentials:

- `DATABASE_URL` — full connection string including database name.

> Never commit `.env` or `.env.local`; they are already ignored by git.

## Setup

Install dependencies:

```bash
npm install
```

Generate the Prisma client (required after each schema change):

```bash
npm run prisma:generate
```

Run the development server:

```bash
npm run dev
```

Available scripts:

- `npm run dev` — start Next.js in development mode.
- `npm run build` — build the production bundle.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint.
- `npm run prisma:generate` — wrapper for `prisma generate` (see below).

## Prisma workflow

Prisma is configured for MongoDB (`prisma/schema.prisma`). Useful commands:

- `npx prisma db pull` — introspect your existing MongoDB schema.
- `npx prisma db push` — sync Prisma models to MongoDB (recommended flow).
- `npx prisma studio` — open the visual data browser.

The Prisma client is instantiated in `src/lib/prisma.ts` with hot-reload safe caching for Next.js.

## Deployment

When deploying (e.g., Vercel), set `DATABASE_URL` in the project environment variables to your MongoDB Atlas URI before running the build step.
