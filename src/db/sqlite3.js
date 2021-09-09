const sqlite3 = require('sqlite3')

//create sqlite3 db connection
const db = new sqlite3.Database('./src/db/docker.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message)
    } else {
        //create the vetted images table
        db.run('CREATE TABLE images( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            image_name NVARCHAR(20)  NOT NULL UNIQUE\
        )', (err) => {
 
            //insert a few test images on server start.
            //Also do a quick test to prevent duplicate key insert error on server restart.
            db.all(`SELECT * FROM images`, [], (err, rows) => {
                if (err) {
                    return res.status(404).send(err);
                }
                const found = rows.find((row) => row.image_name === 'alpine:3.11' || row.image_name === 'alpine:3.12')

                // I'm not sure how many vetted images are supposed to be in the db
                // so I will only add a few. 
                if(!found){
                    let insert = 'INSERT INTO images (image_name) VALUES (?)'
                    db.run(insert, ["alpine:3.11"],(err, result) => {console.log(err)})
                    db.run(insert, ["alpine:3.12"],(err, result) => {console.log(err)})
                }
            });
   
        })
    }
});

module.exports = db

