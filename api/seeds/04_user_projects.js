/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex.schema.raw('TRUNCATE user_projects CASCADE');
  await knex('user_projects').del()
  await knex('user_projects').insert([
    {user_id: 1, project_id: 1, datetime_joined: new Date(2024, 11, 10, 8, 0, 0), last_updated: new Date().toISOString()},
    {user_id: 1, project_id: 2, datetime_joined: new Date(2024, 11, 11, 8, 0, 0), last_updated: new Date().toISOString()},
    {user_id: 2, project_id: 1, datetime_joined: new Date(2024, 11, 12, 8, 0, 0), last_updated: new Date().toISOString()},
    {user_id: 3, project_id: 3, datetime_joined: new Date(2024, 11, 13, 8, 0, 0), last_updated: new Date().toISOString()},
    {user_id: 4, project_id: 2, datetime_joined: new Date(2024, 11, 14, 8, 0, 0), last_updated: new Date().toISOString()},
    {user_id: 1, project_id: 3, datetime_joined: new Date(2024, 11, 15, 8, 0, 0), last_updated: new Date().toISOString()},
    {user_id: 1, project_id: 4, datetime_joined: new Date(2024, 11, 16, 8, 0, 0), last_updated: new Date().toISOString()}
  ]);
};
