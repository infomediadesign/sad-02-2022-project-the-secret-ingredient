import { Mongo } from '../deps.ts';
import { Model } from '../types.ts';

export interface TreeSchema {
    _id: Mongo.ObjectId;
    height: number;
    type: 'Birch' | 'Oak' | 'Maple' | 'Cherry' | 'Apple';
}

export function Tree(db: Mongo.Database): Model<TreeSchema> {
    return {
        name: 'Tree',
        schema: db.collection<TreeSchema>('trees'),
    };
}
