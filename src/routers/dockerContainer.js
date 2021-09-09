const express = require('express') 
const Dockerode = require('dockerode') 
const { promisify } = require('util')
const db = require('../db/sqlite3')
const router = new express.Router() 

const docker = new Dockerode()

//list running containers
router.get('/api/container/', async (req, res) => {   

    try {
        const containers = await docker.listContainers({"all":true}) 
        const availableContainers = containers.map((container) => (
            {id: container.Id, 
            image: container.Image, 
            state: container.State}
        ));
        res.status(200).send(availableContainers)
    } 
    catch (e) {
        res.status(404).send({"error": e})
    }
})

//get container details
router.get('/api/container/:id/', async (req, res) => {   
    
    const containerId = req.params.id

    try {
        const containers = await docker.listContainers()
        const container = containers.filter(container => container.Id.startsWith(containerId)) 
        if (container.length === 0){
            return res.status(404).send({"error":'no container found'})
        }
        const containerDetails = {
            "Id":container[0].Id,
            "Image": container[0].Image,
            "Command": container[0].Command,
            "Created": container[0].Created,
            "Status": container[0].Status,
            "Ports": container[0].Ports,
            "Names": container[0].Names[0]
        }
        res.status(200).send(containerDetails)
    } catch(e) {
        res.status(404).send({"error": e})
    }
})


//launch a container (docker create + start)
router.post('/api/container/', async (req, res) => {
    
    const imageName = req.body.imageName
    const selectSQL = `SELECT * FROM images`   
    //promisify the db query method
    const selectRows = promisify(db.all.bind(db));  

    try {  
        
        /* I dont think we need to explicitly check against vetted images
        because it already fails if the image is invalid.
        I put the vetted image check because the specs asked for it.*/
        
        // query the db to get vetted images
        const rows = await selectRows(selectSQL,[])  
        // check if the provided images exists in the db   
        isValideImage = rows.some(row => row.image_name === imageName)  

        if (!isValideImage){ 
            return res.status(404).send({"error":"not a valid docker Image!"})
        }
        //create the container from the image and then start it
        const container = await docker.createContainer(
            {
                Image: imageName,
                Cmd: ['tail','-f','/dev/null'] //keeps the container running
            })
        const startCont = await container.start()
        res.send({"message":"container started"})         
    } 
    catch (e) {
        res.send({"error": e})
    }  
})

//terminate a running container
router.delete('/api/container/:id/', async (req, res) => {   
    
    const containerId = req.params.id

    try {
        //this API takes long to respond because we need to wait for the
        //container to stop before removing the container.
        const container = docker.getContainer(containerId)
        const containerStop = await container.stop()
        const containerRemove = await container.remove()
        res.status(200).send({"message":"container removed"})
    } catch(e) {
        res.status(404).send({"error": e})
    }
})


module.exports = router