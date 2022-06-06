import { Mongo, Status } from '../../deps.ts';
import { Context, Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { ActivitySchema } from '../models/Activity.ts';
import { BoardSchema } from '../models/Board.ts';
import { CardSchema } from '../models/Card.ts';

export function createActivity({
    router,
    activity,
    board,
    card,
}: {
    router: Router;
    activity: Model<ActivitySchema>;
    board: Model<BoardSchema>;
    card: Model<CardSchema>;
}) {
    router.post(`/${activity.lowerName}`, authMiddleware, async (ctx: Context) => {
        const body = ctx.request.body();
        const content = await body.value;

        const { text, bId, cId } = content;
        const cardId = new Mongo.ObjectId(cId);
        const boardId = new Mongo.ObjectId(bId);

        const b = await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
        const c = await card.schema.findOne({ _id: cardId });

        ctx.assert(!b || !c, Status.FailedDependency);

        const _objectId = await activity.schema.insertOne({ text, boardId, cardId });
        ctx.response.body = {
            message: `${activity.name} created!`,
        };
    });
}
//delete activity based on activityID
export function deleteAcitivity(router: Router, activity: Model<ActivitySchema>) {
    router.delete(`/${activity.lowerName}/:id`, authMiddleware, async (ctx) => {
        const _data = await activity.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${activity.name} deleted!`,
        };
    });
}
