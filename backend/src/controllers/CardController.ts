import { Mongo } from '../../deps.ts';
import { Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
export function createCard<T, E, M>(router: Router, card: Model<T>, board: Model<E>, list: Model<M>) {
    router.post(`/${card.name}`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const name = content.name;
        const boardId = content.boardId;
        const listId = content.listId;

        try {
            await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
            await list.schema.findOne({ _id: new Mongo.ObjectId(listId) });
        } catch (error) {
            ctx.response.body = { message: 'U fucekd up', error };
            return;
        }

        const payload: any = { name, boardId: new Mongo.ObjectId(boardId), listId: new Mongo.ObjectId(listId) };

        const _objectId = await card.schema.insertOne(payload);
        ctx.response.body = {
            message: `${card.name} created!`,
        };
    });
}
