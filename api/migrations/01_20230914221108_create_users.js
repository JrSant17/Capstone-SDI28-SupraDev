/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_table', table => {
    table.increments('id');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('username').unique();
    table.string('email').unique().notNullable(); //TODO: add to front end form
    table.string('job_title');
    table.string('p1_account');
    table.string('p1_auth');
    table.integer('type');
    table.string('password').notNullable();
    table.string('availability');
    table.string('experience');
    table.string('languages');
    table.string('operating_systems');
    table.string('avatar_url');
    table.string('profile_pic');
    table.string('user_summary');
    table.integer('time_available');
    table.boolean('is_supracoder').defaultTo(false);
    table.integer('supradoubloons');
    table.string('command');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_table');
};
