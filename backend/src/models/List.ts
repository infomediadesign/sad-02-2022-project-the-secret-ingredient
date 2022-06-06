import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface ListSchema {
    name: string;
    boardId: Mongo.ObjectId;
    order: string;
}

export function List(db: Mongo.Database): Model<ListSchema> {
    const name = 'List';

    return {
        name,
        lowerName: name.toLowerCase(),
        schema: db.collection<ListSchema>('list'),
    };
}
// 62923e24f734ac8cff838c20
