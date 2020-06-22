import { IWork } from "../models/work.model";
import { Resource } from "../models/resource.model";
import { allocateSlot } from "./slots";

export function allocate(rsc: Resource, work: IWork): string {

  if (rsc === "slot") {
    return allocateSlot(work);
  }
  if (rsc === "equipment") {
    // Todo: Implement another resource and replace this
    return allocateSlot(work);
  }
  return "default";
}