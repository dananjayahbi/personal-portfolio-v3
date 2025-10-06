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

Seed the database with the default administrator account:

```bash
npm run db:seed
```

The seed script provisions an admin at **admin@test.com** with the password **admin**. Update the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables if you prefer different credentials.

### Cloudinary setup

Image uploads rely on Cloudinary. Create the following variables in `.env.local`:

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

The upload preset should allow signed uploads (mode: `Unsigned` disabled). The `NEXT_PUBLIC_` variants expose safe metadata (cloud name, API key, and preset) to the browser so the Cloudinary widget can initialize signed uploads.

Available scripts:

- `npm run dev` — start Next.js in development mode.
- `npm run build` — build the production bundle.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint.
- `npm run prisma:generate` — wrapper for `prisma generate` (see below).
- `npm run db:seed` — seed MongoDB with the default admin user.

## Prisma workflow

Prisma is configured for MongoDB (`prisma/schema.prisma`). Useful commands:

- `npx prisma db pull` — introspect your existing MongoDB schema.
- `npx prisma db push` — sync Prisma models to MongoDB (recommended flow).
- `npx prisma studio` — open the visual data browser.

The Prisma client is instantiated in `src/lib/prisma.ts` with hot-reload safe caching for Next.js.

## Admin experience

- Admin login lives at [`/admin-login`](./src/app/(auth)/admin-login/page.tsx).
- Upon signing in you will land on the new [`/admin-dashboard`](./src/app/(admin)/admin-dashboard/page.tsx) overview.
- The left-hand navigation (defined in [`src/app/(admin)/components/admin-nav.tsx`](./src/app/(admin)/components/admin-nav.tsx)) now uses Lucide icons and keeps labels concise for a focused dashboard feel.
- Project, site settings, and admin profile forms all ship with direct Cloudinary upload widgets so you can drop in imagery without leaving the console.

## Deployment

When deploying (e.g., Vercel), set `DATABASE_URL` in the project environment variables to your MongoDB Atlas URI before running the build step.
