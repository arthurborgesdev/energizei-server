const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const cors = require('cors');

const MONGODB_URL = "mongodb://heroku_pj5qws5n:j66hhrtsj1b489346gsmng6s2f@ds231090.mlab.com:31090/heroku_pj5qws5n";
const dbName = "heroku_pj5qws5n";
const ENERGIZEI_URL = "https://energizei-server.herokuapp.com/";
// see jsonParser documentation on npm for how to use
var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.post('/credentials', (req, res) => {
  console.log(req.body);
  if(req.body.username == "Arthur" &&
     req.body.password == "ene@321"
   ) {
      res.sendFile(path.join(__dirname, "/public/dashboard.html"))
      res.redirect("https://energizei-server.herokuapp.com/dashboard.html")
   } else {
      res.sendFile(path.join(__dirname, "/public/index.html"))
      res.redirect("https://energizei-server.herokuapp.com/index.html")
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

//  cors(),
// ------------------QUERIED from the DB ------------

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
  // Must especify find so it does not loads all DB (over 1700 docs)
  // filter by device id or by time
  console.log(moment());
  var last24HoursFormated = moment().subtract(24, "h").format();
  collection
    .find({
      "device_id": {
        // here the "device_id" must have correspondented id of the requester
        $eq: "b22e4ea06305185933d4f81c44ab7d16"
      },
      "msg_type": {
        $eq: "sensorWeather"
      },
      "time_iso": {
        $gt: last24HoursFormated
      }
    }).project({
      //"time_iso": 1,
      //"temp": 1,
      //"humid": 1,
      "device_id": 0,
      "msg_type": 0,
      "_id": 0
    }).toArray(function(err, docs) {
      if(err) throw err;
      callback(docs);
    })
};

/* Exemplo de retorno
{
  "_id":"5b2a7e225deb0b0004fa2123",
  "time_iso":"2018-06-20T13:17:36-03:00",
  "device_id":"b22e4ea06305185933d4f81c44ab7d16",
  "msg_type":"sensorWeather",
  "temp":"26.2",
  "humid":"60.6"
}
*/

// ----------------------------------------------

//Sent by device
app.post('/weather', (req, res) => {
  var theBody = JSON.stringify(req.body);
  // first print, to see if the data sent by the device is been received by then
  // controller
  // console.log(theBody);
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    var weather = req.body;
    /* ---- Here is the authentication process, which is not completed yet-----
    var weatherAuth = JSON.stringify(req.body);
    console.log(weatherAuth);
    console.log(weatherAuth.hasOwnProperty("temperature"));
    */

    storeWeather(db, weather, function(docs) {
      // After the data is stored, it logs only the meaningful part of data
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

// ?
//  maybe it's just a step to test/populate the database/ to see if things are ok
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

const insertDocuments = function(db, data, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne({ weather: data }, function(err, result) {
    console.log("Inserted data into the collection");
    callback(result);
  });
}

const findIR = function(db, callback) {
  const collection = db.collection('infrared');
  // finish building this query after findMany weather with D3.js
  collection.findOne() //...
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
