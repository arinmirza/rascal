import { Schema, Document } from "mongoose";
import * as mongoose from "mongoose";

export interface ICustomer extends Document {
  phone: string,
  firstName: string,
  lastName: string,
  email: string,
  stats: object
}

const CustomerSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  email: { type: String },
  stats: { type: Object }
});

export const Customer = mongoose.model<ICustomer>("Resource", CustomerSchema, "customers");
