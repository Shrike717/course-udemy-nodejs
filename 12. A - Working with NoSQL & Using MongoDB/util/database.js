require('dotenv').config()
const mongodb = require("mongodb");
// Creating client object
const MongoClient = mongodb.MongoClient;

// Declaring internal variable to later store a connection in
let _db;

// Method for connecting and then storing the connection to the DB. This keeps running.
const mongoConnect = (callback) => {
  MongoClient.connect(process.env.DB_URI)
  .then(client => {
    console.log("Connected!");
    _db = client.db()
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

// Method to return access to the connected DB if it exists.
const getDb = () => {
  if(_db) {
    return _db;
  }
  throw "No Database found!";
}

// Because exporting several functions named exports
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
