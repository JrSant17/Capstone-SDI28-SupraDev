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
            is_active: false 
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
        },
        {
            id: 8,
            project_id: 2,
            milestone: 'Kickoff',
            description: 'Project initialization, requirements gathering, and planning phase.',
            started: new Date('2024-12-01T10:00:00Z'), 
            completed: new Date('2024-12-05T18:00:00Z'), 
            index: 1,
            is_active: false // Completed milestone
        },
        {
            id: 9,
            project_id: 2,
            milestone: 'Development',
            description: 'Coding and integration of software features and functionality.',
            started: new Date('2024-12-06T09:00:00Z'), 
            completed: new Date('2025-01-06T19:00:00Z'), 
            index: 2,
            is_active: false 
        },
        {
            id: 10,
            project_id: 2,
            milestone: 'Testing',
            description: 'Verification of functionality, performance, and reliability through quality assurance processes.',
            started: new Date('2025-01-06T03:00:00Z'), 
            completed: new Date('2025-02-06T16:00:00Z'), 
            index: 3,
            is_active: true 
        },
        {
            id: 11,
            project_id: 2,
            milestone: 'User Showcase',
            description: 'Demonstrating the product’s features and capabilities to key users and stakeholders for their evaluation and feedback.',
            started: null,
            completed: null,
            index: 4,
            is_active: false 
        },
        {
            id: 12,
            project_id: 2,
            milestone: 'Funding',
            description: 'Securing funding to enable deployment, scaling, and sustainment of the application.',
            started: null,
            completed: null,
            index: 5,
            is_active: false 
        },
        {
            id: 13,
            project_id: 2,
            milestone: 'Deployment',
            description: 'Launching the application in a live production environment for end-users.',
            started: null,
            completed: null,
            index: 6,
            is_active: false 
        },
        {
            id: 14,
            project_id: 2,
            milestone: 'Program of Record',
            description: 'Application deployed and available for use!.',
            started: null,
            completed: null,
            index: 7,
            is_active: false 
        },
        {
            id: 15,
            project_id: 3,
            milestone: 'Kickoff',
            description: 'Project initialization, requirements gathering, and planning phase.',
            started: new Date('2024-12-01T10:00:00Z'), 
            completed: new Date('2024-12-05T18:00:00Z'), 
            index: 1,
            is_active: false 
        },
        {
            id: 16,
            project_id: 3,
            milestone: 'Development',
            description: 'Coding and integration of software features and functionality.',
            started: new Date('2024-12-05T18:00:00Z'), 
            completed: new Date('2025-02-06T16:00:00Z'), 
            index: 2,
            is_active: false 
        },
        {
            id: 17,
            project_id: 3,
            milestone: 'Testing',
            description: 'Verification of functionality, performance, and reliability through quality assurance processes.',
            started: new Date('2025-03-05T18:00:00Z'), 
            completed: new Date('2025-04-06T16:00:00Z'), 
            index: 3,
            is_active: false 
        },
        {
            id: 18,
            project_id: 3,
            milestone: 'User Showcase',
            description: 'Demonstrating the product’s features and capabilities to key users and stakeholders for their evaluation and feedback.',
            started: new Date('2025-04-06T16:00:00Z'), 
            completed: null, 
            index: 4,
            is_active: true 
        },
        {
            id: 19,
            project_id: 3,
            milestone: 'Funding',
            description: 'Securing funding to enable deployment, scaling, and sustainment of the application.',
            started: null,
            completed: null,
            index: 5,
            is_active: false 
        },
        {
            id: 20,
            project_id: 3,
            milestone: 'Deployment',
            description: 'Launching the application in a live production environment for end-users.',
            started: null,
            completed: null,
            index: 6,
            is_active: false 
        },
        {
            id: 21,
            project_id: 3,
            milestone: 'Program of Record',
            description: 'Application deployed and available for use!.',
            started: null,
            completed: null,
            index: 7,
            is_active: false 
        },
        {
            id: 22,
            project_id: 4,
            milestone: 'Kickoff',
            description: 'Project initialization, requirements gathering, and planning phase.',
            started: new Date('2024-12-01T10:00:00Z'), 
            completed: new Date('2024-12-05T18:00:00Z'), 
            index: 1,
            is_active: false // Completed milestone
        },
        {
            id: 23,
            project_id: 4,
            milestone: 'Development',
            description: 'Coding and integration of software features and functionality.',
            started: new Date('2024-12-06T09:00:00Z'), 
            completed: null, 
            index: 2,
            is_active: true 
        },
        {
            id: 24,
            project_id: 4,
            milestone: 'Testing',
            description: 'Verification of functionality, performance, and reliability through quality assurance processes.',
            started: null,
            completed: null,
            index: 3,
            is_active: false 
        },
        {
            id: 25,
            project_id: 4,
            milestone: 'User Showcase',
            description: 'Demonstrating the product’s features and capabilities to key users and stakeholders for their evaluation and feedback.',
            started: null,
            completed: null,
            index: 4,
            is_active: false 
        },
        {
            id: 26,
            project_id: 4,
            milestone: 'Funding',
            description: 'Securing funding to enable deployment, scaling, and sustainment of the application.',
            started: null,
            completed: null,
            index: 5,
            is_active: false 
        },
        {
            id: 27,
            project_id: 4,
            milestone: 'Deployment',
            description: 'Launching the application in a live production environment for end-users.',
            started: null,
            completed: null,
            index: 6,
            is_active: false 
        },
        {
            id: 28,
            project_id: 4,
            milestone: 'Program of Record',
            description: 'Application deployed and available for use!.',
            started: null,
            completed: null,
            index: 7,
            is_active: false 
        }

    ]);
};