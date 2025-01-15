import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const clipTagRelation = sqliteTable('dp_clip_tag_relation', {
    clip_key: text('clip_key').notNull(),
    tag_id: integer('tag_id', { mode: 'number' }),
    created_at: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.clip_key, table.tag_id] })
    };
});


export type ClipTagRelation = typeof clipTagRelation.$inferSelect; // return type when queried
export type InsertClipTagRelation = typeof clipTagRelation.$inferInsert; // insert type
