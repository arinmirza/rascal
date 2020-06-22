declare module "RascalTypes" {
  export function allocate(rsc: Resource, work: Work): string;
  export type Resource = { title: string };
  export type Work = {
    _id: ObjectId,
    customer: string;
    dateRangeStart: Date;
    dateRangeEnd: Date;
    privacy: string[];
  };
}
