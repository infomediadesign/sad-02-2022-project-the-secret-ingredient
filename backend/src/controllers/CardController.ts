import { Mongo, Status, V } from '../../deps.ts';
import { Context, Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { CardSchema } from '../models/Card.ts';
import { BoardSchema } from '../models/Board.ts';
import { ListSchema } from '../models/List.ts';
import { ActivitySchema } from '../models/Activity.ts';
import { oakAssert } from '../util.ts';

export function createCard(
    router: Router,
    card: Model<CardSchema>,
    board: Model<BoardSchema>,
    list: Model<ListSchema>
) {
    router.post(`/${card.lowerName}`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;

        const { name, order, bId, lId } = content;

        const [passes, errors] = await V.validate(content, {
            name: V.required,
            order: V.required,
            bId: V.required,
            lId: V.required,
        });
        oakAssert(ctx, passes, Status.BadRequest, undefined, errors);

        const boardId = new Mongo.ObjectId(bId);
        const listId = new Mongo.ObjectId(lId);

        const b = await board.schema.findOne({ _id: boardId });
        const l = await list.schema.findOne({ _id: listId });

        oakAssert(ctx, b != null && l != null, Status.FailedDependency, 'Relationships unclear! [Board and List]');

        const _id = await card.schema.insertOne({
            name,
            boardId: new Mongo.ObjectId(boardId),
            listId: new Mongo.ObjectId(listId),
            order,
        });

        ctx.response.body = {
            message: `${card.name} created!`,
            card: { _id, name, order },
        };
    });
}

// Get a card based on ID
export function getCard(router: Router, card: Model<CardSchema>) {
    router.get(`/${card.lowerName}/:id`, authMiddleware, async (ctx) => {
        const _id = new Mongo.ObjectId(ctx.params.id);
        const c = await card.schema.findOne({
            _id,
        });

        oakAssert(ctx, c != null, Status.BadRequest, 'Card not found!');

        ctx.response.body = {
            message: `${card.name} retrieved`,
            card: c,
        };
    });
}

// Fetch activities based on card-id
export function getActivitysBycardId(router: Router, card: Model<CardSchema>, activity: Model<ActivitySchema>) {
    router.get(`/${card.lowerName}/:id/activitys`, authMiddleware, async (ctx) => {
        const _id = new Mongo.ObjectId(ctx.params.id);

        const c = await card.schema.findOne({ _id });
        const activities = await activity.schema.find({ cardId: _id }).toArray();

        oakAssert(
            ctx,
            c != null && activities != null,
            Status.FailedDependency,
            'No cards found to fetch the activities!'
        );

        ctx.response.body = {
            message: 'Activities present in this card retrieved.',
            activities,
        };
    });
}

// Update card content based on id
export function updateCardContent(router: Router, card: Model<CardSchema>) {
    router.put(`/${card.lowerName}/:id`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const _id = new Mongo.ObjectId(ctx.params.id);
        const { name, order } = content;

        const [passes, errors] = await V.validate(content, {
            name: V.required,
            order: V.required,
        });
        oakAssert(ctx, passes, Status.BadRequest, undefined, errors);

        const _c = await card.schema.updateOne(
            { _id },
            {
                $set: { name, order },
            }
        );

        ctx.response.body = {
            message: 'Card updated.',
            list: { _id, name, order },
        };
    });
}

// Celete card based on cardid
export function deleteCard(router: Router, card: Model<CardSchema>) {
    router.delete(`/${card.lowerName}/:id`, authMiddleware, async (ctx) => {
        const _data = await card.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });

        ctx.response.body = {
            message: `${card.name} deleted!`,
        };
    });
}
