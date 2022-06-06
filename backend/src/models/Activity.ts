import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface ActivitySchema {
    _id: Mongo.ObjectId;
    text: string;
    cardId: Mongo.ObjectId;
    boardId: Mongo.ObjectId;
}

export function Activity(db: Mongo.Database): Model<ActivitySchema> {
    const name = 'Activity';

    return {
        name,
        lowerName: () => name.toLowerCase(),
        schema: db.collection<ActivitySchema>('Activity'),
    };
}
