import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface BoardSchema {
    _id: Mongo.ObjectId;
    name: string;
    image: {
        color: string;
        thumbnail: string;
        full: string;
    };
    userID: Mongo.ObjectId;
}

export function Baord(db: Mongo.Database): Model<BoardSchema> {
    return {
        name: 'Board',
        schema: db.collection<BoardSchema>('Boards'),
    };
}
