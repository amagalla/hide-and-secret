import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.raw(`
        CREATE TABLE IF NOT EXISTS secret_stash (
            stash_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            message         VARCHAR(500),
            id              BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY     (stash_id),
            FOREIGN KEY     (id) REFERENCES profiles(id) ON DELETE CASCADE
        );
    `)
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.raw(`
        drop table if exists secret_stash;
    `)
}

