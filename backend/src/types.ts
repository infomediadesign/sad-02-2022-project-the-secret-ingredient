import { Mongo, Oak } from '../deps.ts';

export interface Model<T> {
    name: string;
    schema: Mongo.Collection<T>;
}

export type Router = Oak.Router<Record<string, any>>;
