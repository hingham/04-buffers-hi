'use strict';

const fs = require('fs');
var Buffer = require('buffer/').Buffer;

let text = '';


//set up a promise so that we know the text is resolved
let setPromise = new Promise(function(resolve, reject) {
  //read in the text file
  fs.readFile('./pair-programming.txt', (err, data) => {
    if (err) {
      console.log('error');
    }
    for (let char of data) {
      text += String.fromCharCode(char);
    }
    resolve(data, text);
    return text;
  });
});


//call set promise with the data so we can add in the html tags, chain fs.write with .then
setPromise.then((data, text) => {

//set up article buffers to add at the end
  let htmlArticle = Buffer.alloc('<article>'.length);
  let htmlArticleEnd = Buffer.alloc('</article>'.length);
  htmlArticle.fill('<article>');
  htmlArticleEnd.fill('</article>');

  let previousIdx = 0;
  //bufArray will contain all the buffers that will be ultimately concatenated
  let bufArray = [];

  //create a new buffer for each line break
  for (let i = 0; i < data.length; i++) {

    if (data[i].toString(16) === 'a') {
      let b = Buffer.alloc(i - previousIdx); //sets container of correct length
      b = data.slice(previousIdx, i);

      bufArray.push(b);
      previousIdx = i;
    }
  }

  let bufLen = bufArray.length;

  //add the h2 tags around each header
  for (let i = 0; i < bufLen; i++) {

    if (bufArray[i].length < 34 && bufArray[i].length > 9) {

      let h2 = Buffer.alloc('<h2>'.length);
      let h2Close = Buffer.alloc('</h2>'.length);
      h2.fill('<h2>');
      h2Close.fill('</h2>');
      bufArray[i] = Buffer.concat([h2,bufArray[i],h2Close], (h2.length + bufArray[i].length + h2Close.length));

    }
  }
  let finalBuffer = Buffer.alloc(0);

  //concatenate your array of buffers to be one buffer
  for(let i = 0; i <bufArray.length; i++ ) {
    let len = finalBuffer.length + bufArray[i].length;
    finalBuffer = Buffer.concat([finalBuffer, bufArray[i]], len);
  }

  finalBuffer = Buffer.concat([htmlArticle, finalBuffer, htmlArticleEnd], (htmlArticle.length + finalBuffer.length + htmlArticleEnd.length));
  return finalBuffer;

//write your buffer to a new html file
}).then((buffer) => {
  fs.writeFile('./pair-programming.html', buffer, (err) => {
    if (err) {return console.log(err); }
    console.log('file saved');
  });
});