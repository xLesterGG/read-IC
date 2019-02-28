const fs = require('fs')
const sharp = require('sharp');


fs.readFile('flower.jpg',(err,data) => {
    console.log(data);
    sharp(data)
    .toFile('flower2.jpeg', (err, info) => {
        if(err)
        console.log(err);

        if(info)
        console.log(info);
    });
})
