import { MongoClient } from 'mongodb'
let db;

async function connectToDb(cb) {
    const client = new MongoClient('mongodb://127.0.0.1:27017'); //Specifies the name of the db server
    await client.connect(); //Waits for the server, acting as client to the db server, to connect 
    db = client.db('blog-db'); //Specifies the database name.
    cb();
}

export  {
    db,
    connectToDb,
}