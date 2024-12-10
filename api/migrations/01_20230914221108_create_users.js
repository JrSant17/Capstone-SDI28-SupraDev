/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_table', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.string('first_name').notNullable(); // equivalent of varchar(255)
    table.string('last_name').notNullable(); // equivalent of varchar(255)
    table.string('username').unique(); // equivalent of varchar(255)
    table.string('email').unique();
    table.string('job_title');
    table.string('password').notNullable(); // equivalent of varchar(255)
    table.string('profile_pic');
    table.string('user_summary');
    table.boolean('is_supracoder');
    table.integer('type');
    table.string('experience');
    table.string('languages');
    table.string('command');
    table.string('time_available');
    table.boolean('availability');
    table.string('operating_systems');
    table.string('supradoubloons');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_table');
};
