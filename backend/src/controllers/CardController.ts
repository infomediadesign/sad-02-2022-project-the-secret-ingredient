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

//get a card based on ID
export function getCard<T>(router: Router, card: Model<T>) {
    router.get(`/${card.name}/:id`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.id;
        try {
            const Card = await card.schema.findOne({
                _id: new Mongo.ObjectId(id),
            });
            console.log(card);
            ctx.response.body = {
                message: `${card.name} retrieved`,
                Card,
            };
        } catch (e) {
            ctx.response.body = {
                message: `${e}`,
            };
        }
    });
}

// fetch activities based on card-id
export function getActivitysBycardId<T, E>(router: Router, card: Model<T>, activity: Model<E>) {
    router.get(`/${card.name}/:id/activitys`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.id;
        try {
            const Card = await card.schema.findOne({ _id: new Mongo.ObjectId(id) });
            if (!Card) {
                ctx.response.status = 400;
                ctx.response.body = {
                    msg: 'no cards found to fetch the activities.',
                };
            }
            const Activity = await activity.schema.find({ cardId: id });
            ctx.response.body = {
                msg: 'activities present in this card',
                Activity,
            };
        } catch (e) {
            ctx.response.body = {
                msg: e,
            };
        }
    });
}

// update card content based on id
export function updateCardContent<T>(router: Router, card: Model<T>) {
    router.put(`/${card.name}/:id`, authMiddleware, async (ctx) => {
        const id: string = ctx.params.id;
        const body = ctx.request.body();
        const value = await body.value;

        const Card = await card.schema.updateOne({ _id: new Mongo.ObjectId(id) }, {
            $set: { name: value.name, order: value.order },
        } as any);
        ctx.response.body = Card;
        console.log(Card);
    });
}

// delete card based on cardid
export function deleteCard<T>(router: Router, card: Model<T>) {
    router.delete(`/${card.name}/:id`, authMiddleware, async (ctx) => {
        const _data = await card.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${card.name} deleted!`,
        };
    });
}
