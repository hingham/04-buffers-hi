'use strict';

const fs = require('fs');
const fill = require('buffer-fill');

let buffer = Buffer.from([]);

let str = `'use strict';
let arr = ['hannah', 'lena', 'caiti'];

arr.forEach(name =>{
    console.log(name);
});`



// set up a write file, param = loop.js 
function fillFile(file, buffer){
    console.log(buffer.fill(9));
    // console.log(letters);
    buffer = Buffer.allocUnsafe(100).fill(str);
    console.log(buffer);    // changeString(names);

    fs.writeFile(file, buffer, function(err){
        if(err){
            return console.log(err);
        }
        else{
            console.log("The file was created");
        }
    })

}

fillFile('loop.js', buffer);
