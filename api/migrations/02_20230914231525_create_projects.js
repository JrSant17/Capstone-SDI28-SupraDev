/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('project_table', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('problem_statement').notNullable();
    table.integer('submitter_id').notNullable();
    table.foreign('submitter_id').references('user_table.id');
    table.boolean('is_approved').defaultTo(false);
    table.boolean('is_accepted').defaultTo(false);
    table.integer('accepted_by_id');
    table.foreign('accepted_by_id').references('user_table.id');
    table.boolean('is_completed').defaultTo(false);
    table.integer('bounty_payout');
    table.string('github_url');
    table.string('program_language_type').notNullable();
    table.dateTime('date_created').defaultTo(knex.fn.now());
    table.dateTime('end_date'); 
    table.integer('desired_number_coders'); 
    table.string('project_state').notNullable(); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('project_table', table => {
    table.dropForeign('submitter_id');
    table.dropForeign('accepted_by_id');
  })
  .then(function() {
    return knex.schema.dropTableIfExists('project_table');
  });
};
