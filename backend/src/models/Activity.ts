import { Mongo } from '../deps.ts';
import { Model } from '../types.ts';

export interface ActivitySchema {
    _id: Mongo.ObjectId;
    text: string;
    boardId: Mongo.ObjectId;
}

export function Activity(db: Mongo.Database): Model<ActivitySchema> {
    return {
        name: 'Activity',
        schema: db.collection<ActivitySchema>('Activity'),
    };
}
