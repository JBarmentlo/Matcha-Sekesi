const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  // db.db = client.db('sekesi_db');
  // const users = db.collection('users');
  return client
}

connect().then(console.log("Connected to MongoDB"))
module.exports = client.db('sekesi_db') 
// console.log(client.db('sekesi_db'))
// console.log("lolzs")
// const db = client.db('sekesi_db');
// const users = db.collection('users');

// const doc = { username: "Neapolitan ", shape: "round" };
// const result = await collection.insertOne(doc);
// console.log(
// `A document was inserted with the _id: ${result.insertedId}`,
// );