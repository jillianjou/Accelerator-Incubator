import fetch from 'node-fetch';

import express from 'express';
const app = express();

const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=9262b874e52e419ab2355f131f296ba7');
const data = await response.json();
const article = data["articles"];

app.get('/all', (req, res) => {
  const arr = [];
  for(var i in data["articles"]){
    arr.push(article[i].title);
    arr.push(article[i].description);
    arr.push(article[i].source.name);
    arr.push(article[i].url);
    arr.push( );
  }
  res.send(arr);
})

app.get('/titles', (req, res) => {
  const arr = [];
  for(var i in data["articles"]){
    arr.push(article[i].title);
    arr.push( );
  }
  res.send(arr);
})


app.listen(3000, () => {
      console.log('Listening on localhost 3000')
})
