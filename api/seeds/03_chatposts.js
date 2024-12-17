/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('chatposts').del()
    await knex('chatposts').insert([
      {project_id: 1, user_id: 4, post_text: 'some chitter chatter pitter patter',
        last_updated: new Date().toISOString()
      },
      {project_id: 1, user_id: 3, post_text: 'some moooore chatter',
        last_updated: new Date().toISOString()
      }
    ]);
  };