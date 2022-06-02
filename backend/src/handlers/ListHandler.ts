import { Mongo } from '../../deps.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';
import { Model, Router } from '../types.ts';

export function createList<T, E>(router: Router, list: Model<T>, board: Model<E>) {
    router.post(`/${list.name}`, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const name = content.name;
        const order = content.order;
        const boardId = content.boardId;

        try {
            await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
        } catch (error) {
            ctx.response.body = { message: 'U fucekd up', error };
            return;
        }

        const payload: any = { name, boardId: new Mongo.ObjectId(boardId), order };

        const _objectId = await list.schema.insertOne(payload);
        ctx.response.body = {
            message: `${list.name} created!`,
        };
    });
}
