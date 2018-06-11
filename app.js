const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');

const MONGODB_URL = "mongodb://heroku_pj5qws5n:j66hhrtsj1b489346gsmng6s2f@ds231090.mlab.com:31090/heroku_pj5qws5n";
const dbName = "heroku_pj5qws5n";

// see jsonParser documentation on npm for how to use
var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.post('/credentials', (req, res) => {
  console.log(req.body);
  if(req.body.username == "Arthur" &&
     req.body.password == "ene@321"
   ) {
      res.sendFile(path.join(__dirname, "/public/dashboard.html"))
   } else {
      res.sendFile(path.join(__dirname, "/public/index.html"))
   }
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/login.html"))
});

app.get('/infrared', (req, res) => {
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    //console.log(data);

    findIR(db, function() {
      client.close();
      res.send("Recebeu");
    });
  })
  res.send('Hi');
});

app.get('/weather', (req, res) => {
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    findWeather(db, function(docs) {
      console.log(docs);
      client.close();
      res.send(docs);
    });
  })
});

const findWeather = function(db, callback) {
  const collection = db.collection('documents');
  collection.find({}).toArray(function(err, docs) {
    if(err) throw err;
    callback(docs);
  })
};

app.post('/weather', (req, res) => {
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    var weather = req.body;
    // fazer aqui a autenticação
    console.log(weather);
    //console.log(req.body.hasOwnProperty("RESIN_DEVICE_UUID"));
    storeWeather(db, weather, function(docs) {
      console.log(docs.ops);
      client.close();
      res.send(docs.ops);
    });
  })
});

const storeWeather = function(db, weather, callback) {
  const collection = db.collection('documents');
  collection.insertOne(weather, function(err, r) {
    if(err) throw err;
    callback(r);
  })
};

app.post('/create', (req, res) => {
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const data = req.body;
    console.log(data);

    insertDocuments(db, data, function() {
      client.close();
      res.send("Salvou");
    });
  })
})

const findIR = function(db, callback) {
  const collection = db.collection('infrared');
  // finish building this query after findMany weather with D3.js
  collection.findOne() //...
}

const insertDocuments = function(db, data, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne({ weather: data }, function(err, result) {
    console.log("Inserted data into the collection");
    callback(result);
  });
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
