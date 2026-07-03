import * as p from 'drizzle-orm/pg-core';

export const usersTable = p.pgTable('users', {
    id: p.serial().primaryKey(),
    name: p.text().notNull(),
    age: p.integer().notNull(),
    email: p.text().notNull().unique(),
});

export const postsTable = p.pgTable('posts', {
    id: p.serial().primaryKey(),
    title: p.text().notNull(),
    content: p.text().notNull(),
    userId: p
        .integer()
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: p.timestamp().notNull().defaultNow(),
    updatedAt: p
        .timestamp()
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
