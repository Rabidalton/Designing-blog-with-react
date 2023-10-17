import { MongoClient } from 'mongodb'
let db;

async function connectToDb(cb) {
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@blog-db.0fjq0kj.mongodb.net/?retryWrites=true&w=majority`); //Specifies the name of the db server
    await client.connect(); //Waits for the server, acting as client to the db server, to connect 
    db = client.db('blog-db'); //Specifies the database name.
    cb();
}

export  {
    db,
    connectToDb,
}