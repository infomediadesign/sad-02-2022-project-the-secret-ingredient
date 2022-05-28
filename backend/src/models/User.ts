import { Mongo } from '../deps.ts';
import { Model } from '../types.ts';

export interface userSchema {
    username: string;
    password: string;
}

export function user(db: Mongo.Database): Model<userSchema> {
    return {
        name: 'user',
        schema: db.collection<userSchema>('user'),
    };
}
