import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface CardSchema {
    _id: Mongo.ObjectId;
    name: string;
    order: number;
    listId: Mongo.ObjectId;
    boardId: Mongo.ObjectId;
}

export function Card(db: Mongo.Database): Model<CardSchema> {
    const name = 'card';

    return {
        name,
        lowerName: () => name.toLowerCase(),
        schema: db.collection<CardSchema>('card'),
    };
}
