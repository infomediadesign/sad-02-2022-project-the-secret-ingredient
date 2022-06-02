import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface CardSchema {
    name: string;
    listId: Mongo.ObjectId;
    boardId: Mongo.ObjectId;
    order: string;
}

export function Card(db: Mongo.Database): Model<CardSchema> {
    return {
        name: 'card',
        schema: db.collection<CardSchema>('card'),
    };
}
