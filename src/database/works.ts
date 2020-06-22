import { getDatabase } from "./mongo";
import { ObjectID } from "mongodb";

import { IWork, Work } from "../models/work.model";
import { allocate } from "../allocators/resources";
//import {  Work } from "RascalTypes";

type Resource = { title: string };
const collectionName = "works";

async function allocateWork(work: IWork) {
  return work.resources.map((rsc) => allocate(rsc, work));
}

async function insertWork(w: any) {
  const work = new Work({...w});
  work.save.then(work => work._id)
  const insertedId = await work.save((err, work) => {
    if(err) console.log("[error] while inserting work=", work);
    else return work._id;
  });
  return insertedId;
}

async function getWorks() {
  const database = await getDatabase();
  return database.collection(collectionName).find({}).toArray();
}

async function deleteWork(id: ObjectID) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateWork(id: ObjectID, work: IWork) {
  const database = await getDatabase();
  delete work._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id) },
    {
      $set: {
        ...work,
      },
    }
  );
}

export { insertWork, getWorks, deleteWork, updateWork };
