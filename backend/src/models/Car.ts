import { Mongo } from '../deps.ts';
import { Model } from '../types.ts';

export interface CarSchema {
    _id: Mongo.ObjectId;
    height: number;
    width: number;
    length: number;
}

export function Car(db: Mongo.Database): Model<CarSchema> {
    return {
        name: 'Car',
        schema: db.collection<CarSchema>('cars'),
    };
}
