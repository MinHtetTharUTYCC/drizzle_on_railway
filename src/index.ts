import { createServer } from 'node:http';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { usersTable } from './schema';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle({
    client: pool,
});

await migrate(db, { migrationsFolder: './migrations' });

const server = createServer(async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);

    if (url.pathname === '/users') {
        const users = await db.select().from(usersTable);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        return;
    }

    res.writeHead(200);
    res.end('OK');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
