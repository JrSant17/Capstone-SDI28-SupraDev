/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */


const { faker } = require('@faker-js/faker');


exports.seed = async function (knex) {
    
    await knex('milestones').del();

    await knex('milestones').insert([
        {
            id: 1,
            project_id: 1,
            milestone: 'Kickoff',
            description: 'Project initialization, requirements gathering, and planning phase.',
            started: new Date('2024-12-01T10:00:00Z'), 
            completed: new Date('2024-12-05T18:00:00Z'), 
            index: 1,
            is_active: false // Completed milestone
        },
        {
            id: 2,
            project_id: 1,
            milestone: 'Development',
            description: 'Coding and integration of software features and functionality.',
            started: new Date('2024-12-06T09:00:00Z'), 
            completed: null, 
            index: 2,
            is_active: true 
        },
        {
            id: 3,
            project_id: 1,
            milestone: 'Testing',
            description: 'Verification of functionality, performance, and reliability through quality assurance processes.',
            started: null,
            completed: null,
            index: 3,
            is_active: false 
        },
        {
            id: 4,
            project_id: 1,
            milestone: 'User Showcase',
            description: 'Demonstrating the product’s features and capabilities to key users and stakeholders for their evaluation and feedback.',
            started: null,
            completed: null,
            index: 4,
            is_active: false 
        },
        {
            id: 5,
            project_id: 1,
            milestone: 'Funding',
            description: 'Securing funding to enable deployment, scaling, and sustainment of the application.',
            started: null,
            completed: null,
            index: 5,
            is_active: false 
        },
        {
            id: 6,
            project_id: 1,
            milestone: 'Deployment',
            description: 'Launching the application in a live production environment for end-users.',
            started: null,
            completed: null,
            index: 6,
            is_active: false 
        },
        {
            id: 7,
            project_id: 1,
            milestone: 'Program of Record',
            description: 'Application deployed and available for use!.',
            started: null,
            completed: null,
            index: 7,
            is_active: false 
        }
    ]);
};