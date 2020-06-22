import { Schema, Document } from "mongoose";
import * as mongoose from "mongoose";
import { Resource } from "./resource.model";

export interface IWork extends Document {
  customerRef: string;
  dateBegin: Date;
  dateEnd: Date;
  resources: Resource[];
}

const WorkSchema: Schema = new Schema({
  customerRef: { type: String, required: true },
  dateBegin: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  resources: { type: [String] },
});

export const Work = mongoose.model<IWork>("Work", WorkSchema, "works");
