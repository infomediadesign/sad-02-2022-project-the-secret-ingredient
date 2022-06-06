import { Mongo } from '../../deps.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { Model, Router } from '../types.ts';

export function createList<T, E>(router: Router, list: Model<T>, board: Model<E>) {
    router.post(`/${list.name}`, authMiddleware, async (ctx) => {
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
            _objectId,
        };
    });
}

//get all lists based on boardId
export function getListsByBoardId<T>(router: Router, list: Model<T>) {
    router.get(`/${list.name}s/:boardId`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.boardId;
        const data = await list.schema.find({ boardId: new Mongo.ObjectId(id) }).toArray();
        console.log(data);
        ctx.response.body = {
            message: `${list.name} retrieved!`,
            data,
        };
    });
}

// get a list based on listId
export function getList<T>(router: Router, list: Model<T>) {
    router.get(`/${list.name}/:id`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.id;
        try {
            const List = await list.schema.findOne({
                _id: new Mongo.ObjectId(id),
            });
            console.log(List);
            ctx.response.body = {
                message: `${list.name} retrieved`,
                List,
            };
        } catch (e) {
            ctx.response.body = {
                message: `${e}`,
            };
        }
    });
}

// fetch cards based on list-id
export function getCardsByListId<T, E>(router: Router, list: Model<T>, card: Model<E>) {
    router.get(`/${list.name}/:id/cards`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.id;
        try {
            const List = await list.schema.findOne({ _id: new Mongo.ObjectId(id) });
            if (!List) {
                ctx.response.status = 400;
                ctx.response.body = {
                    msg: 'no boards found to fetch the cards.',
                };
            }
            const Card = await card.schema.find({ listId: id });
            ctx.response.body = {
                msg: 'cards present in this board',
                Card,
            };
        } catch (e) {
            ctx.response.body = {
                msg: e,
            };
        }
    });
}

// update list content based on id
export function updateListContent<T>(router: Router, list: Model<T>) {
    router.put(`/${list.name}/:id`, authMiddleware, async (ctx) => {
        const id: string = ctx.params.id;
        const body = ctx.request.body();
        const value = await body.value;

        const List = await list.schema.updateOne({ _id: new Mongo.ObjectId(id) }, {
            $set: { name: value.name, order: value.order },
        } as any);
        ctx.response.body = List;
        console.log(List);
    });
}

// delete list based on listid
export function deleteList<T>(router: Router, list: Model<T>) {
    router.delete(`/${list.name}/:id`, authMiddleware, async (ctx) => {
        const _data = await list.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${list.name} deleted!`,
        };
    });
}
