import { Oak } from '../../deps.ts';
import { Context, Next } from '../types.ts';

export const error = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (error) {
        const { message, name, path, type } = error;
        const status = error.status || error.statusCode || Oak.Status.InternalServerError;

        ctx.response.status = status;
        ctx.response.body = { message, name, path, type, status };
    }
};
