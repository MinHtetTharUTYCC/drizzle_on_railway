import 'dotenv/config';
import { createServer } from 'node:http';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { InsertUser, postsTable, usersTable } from './schema';
import { like, or } from 'drizzle-orm';
import { db } from './db';

await migrate(db, { migrationsFolder: './migrations' });

const server = createServer(async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);

    if (url.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
    }

    if (url.pathname === '/users' && url.searchParams.has('q')) {
        const searchQ = url.searchParams.get('q');
        const users = await db
            .select()
            .from(usersTable)
            .where(
                or(like(usersTable.name, `%${searchQ}%`), like(usersTable.email, `%${searchQ}%`)),
            );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        return;
    }

    if (url.pathname === '/users' && req.method === 'GET') {
        const users = await db.select().from(usersTable);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        return;
    }

    if (url.pathname === '/posts' && req.method === 'GET') {
        const posts = await db.select().from(postsTable);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
        return;
    }

    if (url.pathname === '/users' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const userData = JSON.parse(body);
            const newUser: InsertUser = {
                name: userData.name,
                age: userData.age,
                email: userData.email,
            };
            try {
                const [user] = await db.insert(usersTable).values(newUser).returning();

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to create user', details: error }));
            }
        });
        return;
    }

    if (url.pathname === '/posts' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const postData = JSON.parse(body);
            const newPost = {
                title: postData.title,
                content: postData.content,
                userId: postData.userId,
            };
            try {
                const [post] = await db.insert(postsTable).values(newPost).returning();
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(post));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to create post', details: error }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
