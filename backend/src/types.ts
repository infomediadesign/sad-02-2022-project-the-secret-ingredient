import { Mongo } from './deps.ts';

export interface Model<T> {
    name: string;
    schema: Mongo.Collection<T>;
}
