/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_projects', table => {
        table.increments('id');
        table.integer('user_id');
        table.integer('project_id');
        table.dateTime('datetime_joined').defaultTo(knex.fn.now());
        table.foreign('user_id').references('user_table.id');
        table.foreign('project_id').references('project_table.id');
        table.dateTime('last_updated').defaultTo(knex.fn.now());
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('user_projects', table => {
        table.dropForeign('user_id')
        table.dropForeign('project_id')
      })
      .then(function() {
        return knex.schema.dropTableIfExists('user_projects')
      });
};
