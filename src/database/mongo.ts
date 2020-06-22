const { MongoMemoryServer } = require("mongodb-memory-server");
//const { MongoClient } = require("mongodb");
import mongoose from "mongoose";

let database: any = null;

async function startDatabase() {
  console.log(mongoose);
  const mongo = new MongoMemoryServer();
  const mongoDBURL = await mongo.getConnectionString();
  const connection = await mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
  });
  database = connection.connection.db;
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

export {
  getDatabase,
  startDatabase,
};
