import { Mongo } from '../../deps.ts';
import { Model, Router } from '../types.ts';
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
    router.post(`/${activity.lowerName}`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;

        const { text, boardId, cID } = content;
        const cardId = new Mongo.ObjectId(cID);

        const b = await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
        const c = await card.schema.findOne({ _id: cardId });

        if (!b || !c) {
            ctx.response.status = 401;
            ctx.response.body = { message: 'Relationships unclear! [Board, Card]' };
            return;
        }

        const payload = { text, boardId: new Mongo.ObjectId(boardId), cardId };

        const _objectId = await activity.schema.insertOne(payload);
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
