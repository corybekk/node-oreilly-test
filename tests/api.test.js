const request = require('supertest') //express test library for http calls
const app = require('../src/app')
const dockerode = require('dockerode')

const listContainerResponse = 
[
    {
        "Id": "cf477b0a174c1433b54501b3203cc6b0c63ad9ea51c1b3a1e09e363bbfa69a4b",
        "Image": "node-docker_web",
        "State": "running",
        "Command": "sh",
        "Created": "1234",
        "Status": "running",
        "Ports": "1",
        "Names": ["test"]
    }
]
const containerMethods = {
    start: () => {},
    stop: () => {},
    inspect: () => {},
    remove: () => {}
}

jest.mock('dockerode', () => {
    return function() {
        return {
            listContainers: jest.fn().mockResolvedValue(listContainerResponse),
            createContainer: jest.fn().mockResolvedValue(containerMethods),
            listImages: jest.fn().mockResolvedValue(listContainerResponse),
            getImage: jest.fn().mockResolvedValue(containerMethods)

        }
    }
})
// getContainer: jest.fn().mockResolvedValue(containerMethods)
test('pull docker containers', async () =>{

    const response = await request(app).get('/api/container/').expect(200)

    expect(response.body).toEqual(expect.objectContaining([{
        id: listContainerResponse[0].Id,
        image: listContainerResponse[0].Image,
        state: listContainerResponse[0].State
      }]))
})

test('pull docker container details', async () =>{

    const response = await request(app).get('/api/container/cf477b0a').expect(200)
    
    expect(response.body).toEqual({
        Id: listContainerResponse[0].Id,
        Image: listContainerResponse[0].Image,
        Command: listContainerResponse[0].Command,
        Created: listContainerResponse[0].Created,
        Status: listContainerResponse[0].Status,
        Ports: listContainerResponse[0].Ports,
        Names: listContainerResponse[0].Names[0]
      })
})

test('launch container', async () =>{

    const response = await request(app)
        .post('/api/container/')
        .send({imageName: 'alpine:3.11'})
        .expect(200)
})

//having a hard time mocking the below request. Skipping because its a time sink at the moment.
// test('remove docker container ', async () =>{
//     const response = await request(app).delete('/api/container/cf477b0a').expect(200)  
// })

//if I had more time I would make a more thorought test
test('get image detail', async () =>{
    const response = await request(app).get('/api/image/').expect(200)  
})

//having a hard time figuring out how to mock this request.
// test('get image', async () =>{
//     const response = await request(app).get('/api/image/123/').expect(200)  
// })

test('delete images', async () =>{
    const response = await request(app).delete('/api/image/123/').expect(200)  
})