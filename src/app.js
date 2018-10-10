// app.js
//Lap Yan Cheung (lyc286)

const webby = require('./webby.js');
const app = new webby.App();
const path = require('path');

// add me some middlware!
app.use((req, res, next) => {
 console.log(req.method, req.path);
 next();
});

//add a route
app.get('/hello', function(req, res) {
 // send back a response if route matches
 res.send('<h1>YUPPY</h1>');
});


app.use(webby.static(path.join(__dirname, '..', 'public')));

//Homepage -> return html
app.get('/', function(req, res) {
  console.log(req.method, req.path);
  res.send('<html><head><link href="/css/styles.css" rel="stylesheet"></head><body><h2>Lemur Gallery</h2><p><a href="/gallery">Click for Lemur(s)</a></p></body></html>');
});

app.get('/gallery', function(req, res) {
  console.log(req.method, req.path);
  let randomPicsName = [];
  let randNumber = Math.floor(Math.random() * Math.floor(3))+2;
  if (randNumber<1){
    randNumber =1;
  }
  //Generate random file names
  for (let i=0; i<randNumber; i++) {
    const randFileNumber = (Math.floor(Math.random() * Math.floor(4)))+1;
    randomPicsName.push(`animal${randFileNumber}.jpg`);
  }
  console.log("Files used: "+randomPicsName);
  //Incorporate random file names to page
  let retString = `<html><head><link href="/css/styles.css" rel="stylesheet"></head><body><h3>Random Images of ${randNumber} Lemur(s)</h3><p>`
  for (let i=0; i<randomPicsName.length; i++){
    retString += `<img src=\"img/${randomPicsName[i]}\">`;
  }
  retString += `</p></body></html>`;
  res.send(retString);
});

//Redirect to /gallery
app.get('/pics', function(req, res) {
  const key = app.createRouteKey(req.method, '/gallery');
  console.log("Redirect: "+key);
  app.routes[key](req, res.status(300));
});


app.listen(3000, '127.0.0.1');
