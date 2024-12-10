/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_table', table => {
    table.increments('id'); 
    table.string('fname').notNullable(); 
    table.string('lname').notNullable(); 
    table.string('email').unique().notNullable(); 
    table.string('p1_account');
    table.string('p1_auth'); 
    table.integer('type'); 
    table.string('password').notNullable();
    table.string('availability'); 
    table.string('experience'); 
    table.string('languages'); 
    table.string('operating_systems');
    table.string('avatar_url');
    table.time('time_available');
    table.boolean('is_supracoder').defaultTo(false);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_table');
};
