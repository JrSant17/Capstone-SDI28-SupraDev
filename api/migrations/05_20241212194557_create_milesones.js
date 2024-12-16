/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('milestones', (table) => {
        table.increments('id').primary();
        table.integer('project_id').unsigned().notNullable()
            .references('id').inTable('project_table')
            .onDelete('CASCADE'); 
        table.string('milestone').notNullable(); 
        table.string('description').nullable(); 
        table.timestamp('started').nullable(); 
        table.timestamp('completed').nullable(); 
        table.integer('index').unsigned().notNullable(); 
        table.boolean('is_active').defaultTo(false).notNullable(); 
        table.unique(['project_id', 'index']); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('milestones');
};
