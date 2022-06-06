import { Mongo } from '../../deps.ts';
import { Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { CardSchema } from '../models/Card.ts';
import { BoardSchema } from '../models/Board.ts';
import { ListSchema } from '../models/List.ts';
import { ActivitySchema } from '../models/Activity.ts';

export function createCard(
    router: Router,
    card: Model<CardSchema>,
    board: Model<BoardSchema>,
    list: Model<ListSchema>
) {
    router.post(`/${card.lowerName}`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;

        const { name, boardId, listId, order } = content;

        const b = await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
        const l = await list.schema.findOne({ _id: new Mongo.ObjectId(listId) });

        if (!b || !l) {
            ctx.response.status = 400;
            ctx.response.body = { message: 'Relationships unclear! [Board and List]' };
            return;
        }

        const _objectId = await card.schema.insertOne({
            name,
            boardId: new Mongo.ObjectId(boardId),
            listId: new Mongo.ObjectId(listId),
            order,
        });

        ctx.response.body = {
            message: `${card.name} created!`,
        };
    });
}

// Get a card based on ID
export function getCard(router: Router, card: Model<CardSchema>) {
    router.get(`/${card.lowerName}/:id`, authMiddleware, async (ctx) => {
        const id = ctx.params.id;
        const c = await card.schema.findOne({
            _id: new Mongo.ObjectId(id),
        });

        if (c == null) {
            ctx.response.status = 400;
            ctx.response.body = { message: 'Card not found!' };
            return;
        }

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

        if (!c || !activities) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: 'No cards found to fetch the activities!',
            };
            return;
        }

        ctx.response.body = {
            message: 'Activities present in this card.',
            activities,
        };
    });
}

// Update card content based on id
export function updateCardContent(router: Router, card: Model<CardSchema>) {
    router.put(`/${card.lowerName}/:id`, authMiddleware, async (ctx) => {
        const id = ctx.params.id;
        const body = ctx.request.body();
        const content = await body.value;
        const { name, order } = content;

        const c = await card.schema.updateOne(
            { _id: new Mongo.ObjectId(id) },
            {
                $set: { name, order },
            }
        );

        ctx.response.body = c;
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
