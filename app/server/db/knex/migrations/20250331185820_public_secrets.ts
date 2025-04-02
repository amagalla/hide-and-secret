import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.raw(`
        CREATE TABLE IF NOT EXISTS public_secrets (
        secret_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        message         VARCHAR(500),
        profile_id      BIGINT UNSIGNED NOT NULL,
        latitude        DECIMAL (10, 7) NOT NULL,
        longitude       DECIMAL (10, 7) NOT NULL,
        PRIMARY KEY     (secret_id),
        FOREIGN KEY     (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
        );
    `)
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.raw(`
        drop table if exists public_secrets;
    `)
}