/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_table', table => {
    table.increments('id'); // Auto-incrementing primary key
    table.string('fname').notNullable(); // First name
    table.string('lname').notNullable(); // Last name
    table.string('email').unique().notNullable(); // Email
    table.string('p1_account'); // P1 account
    table.string('p1_auth'); // P1 authentication
    table.integer('type'); // Type as an integer (or string if preferred)
    table.string('password').notNullable(); // Password (hashed)
    table.string('availability'); // User availability
    table.string('experience'); // CSV-separated experience
    table.string('languages'); // CSV-separated languages
    table.string('operating_systems'); // CSV-separated operating systems
    table.string('avatar_url'); // Optional avatar URL
    table.time('time_available'); // Available time
    table.boolean('is_supracoder').defaultTo(false); // Default: not a Supracoder
    table.timestamps(true, true); // Adds created_at and updated_at timestamps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_table');
};
