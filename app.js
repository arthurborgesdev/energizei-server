const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const MONGODB_URL = "mongodb://heroku_pj5qws5n:j66hhrtsj1b489346gsmng6s2f@ds231090.mlab.com:31090/heroku_pj5qws5n";
const dbName = "heroku_pj5qws5n";

var urlencodedParser = bodyParser.urlencoded({ extended: false });
// see jsonParser documentation on npm for how to use
var jsonParser = bodyParser.json();

app.get('/infrared', (req, res) => {
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    console.log(data);

    findIR(db, function() {
      client.close();
      res.send("Recebeu");
    });
  })
  res.send('Hi');
});

app.post('/create', urlencodedParser, (req, res) => {
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

  collection.findOne()
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
