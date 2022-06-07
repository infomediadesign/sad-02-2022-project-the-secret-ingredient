import { Mongo } from '../../deps.ts';
import { Model } from '../types.ts';

export interface UserSchema {
    username: string;
    email: string;
    password: string;
}

export function User(db: Mongo.Database): Model<UserSchema> {
    const name = 'User';
    const lowerName = name.toLowerCase();

    return {
        name,
        lowerName,
        schema: db.collection<UserSchema>(name),
    };
}
