// deno-lint-ignore-file
import { verify, Mongo, Oak } from '../../deps.ts';
import { key } from '../controllers/UserController.ts';
import { User } from '../models/User.ts';
import { Context, Model, Next, Router } from '../types.ts';
import { router } from '../main.ts';

export const authMiddleware = async (ctx: Context, _next: Next) => {
    const Headers = ctx.request.headers;
    const authHeader = Headers.get('Authorization');

    if (authHeader == null) {
        ctx.response.status = 401;
        ctx.response.body = {
            msg: 'Unauthorized!',
        };
        return;
    }
    const jwt = authHeader.split(' ')[1];
    if (!jwt) {
        ctx.response.status = 401;
        return;
    }
    const data = await verify(jwt, key);

    console.log(data);
    if (data) {
        // async function selectUser<T>(user: Model<T>, data: any) {
        //     (await user.schema.findOne({ username: data.iss })) as any;
        // }
        // const model = User(db);
        // const selectedUser = await selectUser(model, data);
        // ctx.state.user = selectedUser;
        await _next();
        // const username = data.iss;
        // ctx.state.user = username;

        // ctx.state.user = username;
        // console.log(username);
    } else {
        ctx.response.status = 401;
        return;
    }
};
