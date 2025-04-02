import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.raw(`
        CREATE TABLE IF NOT EXISTS secret_stash (
            stash_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            message         VARCHAR(500),
            profile_id              BIGINT UNSIGNED NOT NULL,
            PRIMARY KEY     (stash_id),
            FOREIGN KEY     (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
        );
    `)
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.raw(`
        drop table if exists secret_stash;
    `)
}

