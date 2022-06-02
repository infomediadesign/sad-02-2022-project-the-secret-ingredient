import { verify } from '../../deps.ts';
import { key } from '../handlers/userHandler.ts';
import { Context, Next } from '../types.ts';

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
    if (data) {
        console.log(data);
    } else {
        ctx.response.status = 401;
        return;
    }
};
