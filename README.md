# Node.js + Drizzle ORM + Railway PostgreSQL Tutorial

This is a mini-project built following the Drizzle ORM tutorial. It sets up a simple HTTP server that interacts with a PostgreSQL database hosted on Railway.

## Tech Stack

- Node.js (Native HTTP module)
- Drizzle ORM (PostgreSQL Core)
- `node-postgres` (`pg` client pool)
- TypeScript

## How to Run Locally

1. Clone the repository.
2. Run `pnpm install`.
3. Create a `.env` file and add your `DATABASE_URL`.
4. Run `npx drizzle-kit generate` and `npx drizzle-kit migrate`.
5. Run `pnpm run start`.
