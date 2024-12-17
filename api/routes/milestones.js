// milestones.js
const express = require('express');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const router = express.Router();

// GET request for fetching milestones for a specific project
router.get('/:projectId/milestones', async (req, res) => {
    const { projectId } = req.params;
    const projectIdInt = parseInt(projectId, 10);

    
    if (isNaN(projectIdInt)) {
        return res.status(400).json({ error: 'Invalid projectId' }); 
    }

    try {
        
        const milestones = await knex('milestones')
            .where('project_id', projectIdInt)
            .orderBy('index', 'asc');

        
        if (milestones.length === 0) {
            return res.status(404).json({ error: 'No milestones found for this project' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(milestones);
    } catch (error) {
        console.error('Error fetching milestones:', error);
        return res.status(500).json({ error: 'Failed to fetch milestones', details: error.message });
    }
});

// PATCH for updating milestone details
router.patch('/:projectId/milestones', async (req, res) => {
    const { projectId } = req.params;
    const { index, is_active, started, completed } = req.body;

    if (!projectId || isNaN(parseInt(projectId, 10))) {
        return res.status(400).json({ error: 'Invalid projectId' });
    }

    if (!index || isNaN(parseInt(index, 10))) {
        return res.status(400).json({ error: 'Invalid milestone index' });
    }

    try {
        const projectIdInt = parseInt(projectId, 10);
        const indexInt = parseInt(index, 10);

            const milestones = await knex('milestones')
            .where({ project_id: projectIdInt })
            .orderBy('index', 'asc'); 

        if (milestones.length === 0) {
            return res.status(404).json({ error: 'No milestones found for this project' });
        }

        const milestoneExists = milestones.find(milestone => milestone.index === indexInt);
        if (!milestoneExists) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        if (is_active) {
            await knex('milestones')
                .where({ project_id: projectIdInt })
                .update({ is_active: false });
        }

        const updateFields = {};
        if (is_active !== undefined) updateFields.is_active = is_active;
        if (started !== undefined) updateFields.started = started;
        if (completed !== undefined) updateFields.completed = completed;

        await knex('milestones')
            .where({ project_id: projectIdInt, index: indexInt })
            .update(updateFields);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({ error: 'Failed to update milestone' });
    }
});

//POST route for creating default milestones
router.post('/:projectId/milestones/create', async (req, res) => {
    const { projectId } = req.params;

    if (!projectId || isNaN(parseInt(projectId, 10))) {
        return res.status(400).json({ error: 'Invalid projectId' });
    }

    const projectIdInt = parseInt(projectId, 10);

    try {
        let milestones = await knex('milestones')
            .where({ project_id: projectIdInt })
            .orderBy('index', 'asc');

        if (milestones.length === 0) {
            
            const maxIdResult = await knex('milestones').max('id as max_id').first();
            const maxId = maxIdResult?.max_id || 0;

            await knex.raw(`
                SELECT setval('milestones_id_seq', ?, false);
            `, [maxId + 1]);

            const defaultMilestones = [
                { 
                    project_id: projectIdInt, 
                    milestone: 'Kickoff', 
                    description: 'Project initialization, requirements gathering, and planning phase.',
                    index: 1, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                },
                { 
                    project_id: projectIdInt, 
                    milestone: 'Development', 
                    description: 'Coding and integration of software features and functionality.',
                    index: 2, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                },
                { 
                    project_id: projectIdInt, 
                    milestone: 'Testing', 
                    description: 'Verification of functionality, performance, and reliability through quality assurance processes.',
                    index: 3, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                },
                { 
                    project_id: projectIdInt, 
                    milestone: 'User Showcase', 
                    description: 'Demonstrating the product’s features and capabilities to key users and stakeholders for their evaluation and feedback.',
                    index: 4, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                },
                { 
                    project_id: projectIdInt, 
                    milestone: 'Funding', 
                    description: 'Securing funding to enable deployment, scaling, and sustainment of the application.',
                    index: 5, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                },
                { 
                    project_id: projectIdInt, 
                    milestone: 'Deployment', 
                    description: 'Launching the application in a live production environment for end-users.',
                    index: 6, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                },
                { 
                    project_id: projectIdInt, 
                    milestone: 'Program of Record', 
                    description: 'Application deployed and available for use!.',
                    index: 7, 
                    is_active: false, 
                    started: null, 
                    completed: null 
                }
            ];

            await knex('milestones').insert(defaultMilestones);

            milestones = defaultMilestones;
        }

        res.status(201).json({ success: true, milestones });
    } catch (error) {
        console.error('Error creating default milestones:', error);
        res.status(500).json({ error: 'Failed to create default milestones' });
    }
});

module.exports = router;