/**
 * Test the API routes/endpoints
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const knex = require('knex');
const knexConfig = require('../knexfile');
let testDb;

const request = require('supertest');
const server = require('../express');

const newSupra = require('./test_users/test_supra');
const newNormal = require('./test_users/test_normal');
const newLeader = require('./test_users/test_leader');
const newAdmin = require('./test_users/test_admin');

const supraTestProject = require('./test_projects/supra_submitted');


/**
 * Before we run tests create the database anew using our hardcoded creds for now
 * TODO: pull these from an environment file!
 */
beforeAll(async () => {
    // try {
    //     await execPromise('sudo bash ./test/supradb_test_create.sh supradb_test pg-docker');
    //     console.log(`created database!`)
    // } catch (error) {
    //     console.log(`path is: ${process.cwd()}`)
    //     throw error;
    // }

    testDb = knex(knexConfig.test);
    await testDb.migrate.latest();
    await testDb.seed.run();
});

describe('Test Invalid Routes & methods', () => {
    it('should try to GET to a nonsense route /asdfasdj2342', async () => {
        const res = await request(server).get('/asdfasdj2342');
        expect(res.statusCode).toEqual(404);
    });
    it('should return 405 for unsupported method', async () => {
        const res = await request(server).put('/users');
        expect(res.statusCode).toEqual(405);
    });
    it('should return 400 for invalid ID format', async () => {
        const res = await request(server).get('/users/invalid_id');
        expect(res.statusCode).toEqual(400);
    });
    it('should return 404 for user that dne', async () => {
        const res = await request(server).get('/users/9999999999999999999999999999');
        expect(res.statusCode).toEqual(404);
    });
});

describe('Basic User Routes', () => {
    let createdUsers = [];

    it('should get all users', async () => {
        const res = await request(server).get('/users');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
    it('should create 4 new users, of all types,  via post', async () => {
        const users = [newSupra, newNormal, newLeader, newAdmin];
        for (let user of users) {
            const res = await request(server).post('/users').send(user);
            expect(res.statusCode).toEqual(201);
            expect(res.text).toEqual('User created successfully');
        }
        const allUsersRes = await request(server).get('/users');
        expect(allUsersRes.statusCode).toEqual(200);
        expect(Array.isArray(allUsersRes.body)).toBeTruthy();

        createdUsers = allUsersRes.body.filter(u => 
            users.some(originalUser => originalUser.email === u.email)
        );
    
        expect(createdUsers.length).toEqual(4);
    });
    it('should modify the 4 new users emails, of all types, via patch', async () => {
        for (let user of createdUsers) {
            const updatedEmail = `updated_${user.email}`;
            const res = await request(server)
                .patch(`/users/${user.id}`)
                .send({ email: updatedEmail });
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(updatedEmail);
        }
    });
    it('should delete the 4 new users, of all types,  via delete', async () => {
        for (let user of createdUsers) {
            const res = await request(server).delete(`/users/${user.id}`);
            expect(res.statusCode).toEqual(204);

            const checkRes = await request(server).get(`/users/${user.id}`);
            expect(checkRes.statusCode).toEqual(404);
        }
    });
});

describe('Basic Project Routes', () => {
    let createdProjects = [];

    it('should get all projects', async () => {
        const res = await request(server).get('/projects');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
    it('should create a new project via post', async () => {
        const res = await request(server).post('/projects').send(supraTestProject);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(supraTestProject);

        const allProjectsRes = await request(server).get('/projects');
        expect(allProjectsRes.statusCode).toEqual(200);
        expect(Array.isArray(allProjectsRes.body)).toBeTruthy();

        createdProjects = allProjectsRes.body.filter(project => 
            project.name === supraTestProject.name
        );

        expect(createdProjects.length).toEqual(1);
    });

    it('should modify the project via patch', async () => {
        const updatedProblemStatement = "I need help coding a game to play at work!";
        const res = await request(server)
            .patch(`/projects/${createdProjects[0].id}`)
            .send({ problem_statement: updatedProblemStatement });

        expect(res.statusCode).toEqual(200);
        expect(res.body.problem_statement).toEqual(updatedProblemStatement);
    });

    it('should delete the project via delete', async () => {
        const res = await request(server).delete(`/projects/${createdProjects[0].id}`);
        expect(res.statusCode).toEqual(204);

        const checkRes = await request(server).get(`/projects/${createdProjects[0].id}`);
        expect(checkRes.statusCode).toEqual(404);
    });
});


/**
 * After we runs tests disconnect from database and destroy with our hardcoded creds for now
 * TODO: pull these from an environment file!
 */
afterAll(async () => {
    await testDb.migrate.rollback();
    await testDb.destroy();
    // try {
    //     await execPromise('sudo bash ./test/supradb_test_destroy.sh supradb_test pg-docker');
    //     console.log('deleted database!');
    // } catch (error) {
    //     console.error('couldnt delete supradb_test try waiting?:', error);
    // }
});
