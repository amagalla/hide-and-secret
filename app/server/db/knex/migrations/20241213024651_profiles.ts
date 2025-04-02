import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
        CREATE TABLE IF NOT EXISTS profiles (
            profile_id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            email               VARCHAR(255) DEFAULT NULL UNIQUE,
            google_id           VARCHAR(255) DEFAULT NULL UNIQUE,
            google_email        VARCHAR(255) DEFAULT NULL UNIQUE,
            username            VARCHAR(255) DEFAULT NULL UNIQUE,
            password            VARCHAR(255) DEFAULT NULL,
            has_username        BOOLEAN DEFAULT FALSE,
            score               INT NOT NULL DEFAULT 0,
            created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (profile_id),
            CONSTRAINT UQ_USERNAME UNIQUE (username),
            CONSTRAINT CK_PASSWORD_LENGTH CHECK (CHAR_LENGTH(password) BETWEEN 8 AND 64)
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
        drop table if exists profiles;
    `);
}
