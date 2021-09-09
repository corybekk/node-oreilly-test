const express = require('express') 
const Dockerode = require('dockerode') 
const db = require('../db/sqlite3')
const router = new express.Router() 

const docker = new Dockerode()

//list all images
router.get('/api/image/', async (req, res) => {   
    
    try {
        const images = await docker.listImages()
        res.send(images)
    } catch (e) {
        res.send({"error": e})
    }
})

//get image details
router.get('/api/image/:id/', async (req, res) => {   
   
    try {
        imageName = req.params.id
        const image = docker.getImage(imageName)
        const details = await image.inspect()
        res.send(details)
    } 
    catch(e) {
        res.send({"error": e})
    }

})

//add a new image (pull an image)
router.post('/api/image/', async (req, res) => {   
    
    const imageName = req.body.imageName

    try {
        let stream = await docker.pull(imageName)
        docker.modem.followProgress(stream,(err, result) => {
            if (err){
                return console.log(err)
            }
            res.send({"message":"image added"})
        })
    }
    catch (e) {
        res.send({"error": e})
    }
})

//delete an image
router.delete('/api/image/:id/', async (req, res) => {    
    
    try {
        const imageName = req.params.id
        const image = docker.getImage(imageName)
        const status = await image.remove()
        res.send(status[2])
    } 
    catch(e) {
        res.send({"error": e})
    }
})

module.exports = router