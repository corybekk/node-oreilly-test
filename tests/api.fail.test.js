const request = require('supertest') //express test library for http calls
const app = require('../src/app')
const dockerode = require('dockerode')

jest.mock('dockerode', () => {
    return function() {
        return {
            listContainers: jest.fn(), 
            createContainer: jest.fn(),
            stop: jest.fn(),
            remove: jest.fn()
        }
    }
})

test('pull docker containers failure', async () => {
    
    const docker = new dockerode() //make mocked docker
    docker.listContainers.mockResolvedValue({}) //tell listContainers to return empty obj
    const response = await request(app).get('/api/container/').expect(404)
})

test('pull docker container detail failure', async () => {
    const response = await request(app).get('/api/container/123').expect(404)
})

test('launch docker container failure', async () => {
    const response = await request(app).post('/api/container/123').expect(404)
})
    
test('delete docker container failure', async () => {
    const response = await request(app).delete('/api/container/123').expect(404)
})

test('add image', async () =>{
    const response = await request(app).post('/api/image/123/').expect(404)  
})



