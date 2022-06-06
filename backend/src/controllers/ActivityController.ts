import { Mongo } from '../../deps.ts';
import { Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
export function createActivity<T, E, R>(router: Router, activity: Model<T>, board: Model<E>, card: Model<R>) {
    router.post(`/${activity.name}`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const text = content.text;
        const boardId = content.boardId;
        const CardId = content.cardId;

        try {
            await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
            await card.schema.findOne({ _id: new Mongo.ObjectId(CardId) });
        } catch (error) {
            ctx.response.body = { message: 'U fucekd up', error };
            return;
        }

        const payload: any = { text, boardId: new Mongo.ObjectId(boardId), cardId: new Mongo.ObjectId(CardId) };

        const _objectId = await activity.schema.insertOne(payload);
        ctx.response.body = {
            message: `${activity.name} created!`,
        };
    });
}
//delete activity based on activityID
export function deleteAcitivity<T>(router: Router, activity: Model<T>) {
    router.delete(`/${activity.name}/:id`, authMiddleware, async (ctx) => {
        const _data = await activity.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${activity.name} deleted!`,
        };
    });
}
