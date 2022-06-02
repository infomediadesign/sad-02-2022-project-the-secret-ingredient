import { verify } from '../../deps.ts';
import { exported } from '../handlers/userHandler.ts';

const key = await window.crypto.subtle.importKey('raw', exported, { name: 'HMAC', hash: 'SHA-512' }, true, [
    'sign',
    'verify',
]);

export const authMiddleware = async (ctx: any, next: Function) => {
    const Headers = ctx.request.headers;
    const authHeader = Headers.get('Authorization');
    if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = {
            msg: 'unauthorized access',
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
        console.log(data.payload);
    } else {
        ctx.response.status = 401;
        return;
    }
};
