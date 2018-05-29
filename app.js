const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
var nunjucksRender = require('gulp-nunjucks-render');


var db;
MONGODB_URL = "mongodb://heroku_pj5qws5n:j66hhrtsj1b489346gsmng6s2f@ds231090.mlab.com:31090/heroku_pj5qws5n";

app.get('/', (req, res) => { res.send('Hi') })

app.post('/create', (req, res) => {
  MongoClient.connect(MONGODB_URL, (err, database) => {
    db.collection('weather').save(req.body, (err, result) => {
      if (err) return console.log(err)

      console.log('saved to database')
      res.redirect('/')
    })
  })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
