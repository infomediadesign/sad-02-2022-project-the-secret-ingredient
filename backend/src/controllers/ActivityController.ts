import { Mongo } from '../../deps.ts';
import { Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
export function createActivity<T, E>(router: Router, activity: Model<T>, board: Model<E>) {
    router.post(`/${activity.name}`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const text = content.text;
        const boardId = content.boardId;

        try {
            await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
        } catch (error) {
            ctx.response.body = { message: 'U fucekd up', error };
            return;
        }

        const payload: any = { text, boardId: new Mongo.ObjectId(boardId) };

        const _objectId = await activity.schema.insertOne(payload);
        ctx.response.body = {
            message: `${activity.name} created!`,
        };
    });
}
