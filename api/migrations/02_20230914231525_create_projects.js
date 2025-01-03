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
    table.integer('coders_needed')
    table.string('program_languages');
    table.integer('project_owner');
    table.foreign('project_owner').references('user_table.id');
    table.dateTime('date_created').defaultTo(knex.fn.now());
    table.dateTime('end_date'); 
    table.integer('priority_level');
    table.string('funding_source');
    table.string('funding_poc');
    table.decimal('estimated_cost', 14, 2);
    table.string('funding_department');
    table.text('requirements');
    table.string('url');
    table.dateTime('last_updated').defaultTo(knex.fn.now());
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
    table.dropForeign('project_owner');
  })
  .then(function() {
    return knex.schema.dropTableIfExists('project_table');
  });
};
