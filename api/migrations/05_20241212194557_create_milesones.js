/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('milestones', (table) => {
        table.increments('id').primary(); // Unique ID for each milestone
        table.integer('project_id').unsigned().notNullable()
            .references('id').inTable('project_table')
            .onDelete('CASCADE'); // Delete milestones if a project is deleted
        table.string('milestone').notNullable(); // Milestone name
        table.string('description').nullable(); // Milestone description or metadata
        table.timestamp('started').nullable(); // Timestamp when milestone started
        table.timestamp('completed').nullable(); // Timestamp when milestone completed
        table.integer('index').unsigned().notNullable(); // Index for ordering milestones
        table.boolean('is_active').defaultTo(false).notNullable(); // Track active/inactive status
        table.unique(['project_id', 'index']); // Ensure no duplicate indexes for a project
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('milestones');
};
