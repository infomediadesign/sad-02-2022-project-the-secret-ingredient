import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface UserSchema {
    username: string;
    email: string;
    password: string;
}

export function User(db: Mongo.Database): Model<UserSchema> {
    const name = 'User';

    return {
        name,
        lowerName: name.toLowerCase(),
        schema: db.collection<UserSchema>('user'),
    };
}
