import { Mongo, Status } from '../../deps.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { BoardSchema } from '../models/Board.ts';
import { CardSchema } from '../models/Card.ts';
import { ListSchema } from '../models/List.ts';
import { Context, Model, Router } from '../types.ts';

export function createList(router: Router, list: Model<ListSchema>, board: Model<BoardSchema>) {
    router.post(`/${list.lowerName}`, authMiddleware, async (ctx: Context) => {
        const body = ctx.request.body();
        const content = await body.value;
        const { name, order, bId } = content;
        const boardId = new Mongo.ObjectId(bId);

        const b = board.schema.findOne({ _id: boardId });

        ctx.assert(b != null, Status.BadRequest, 'Board not found!');

        const _id = await list.schema.insertOne({ name, boardId, order });

        ctx.response.body = {
            message: `${list.name} created!`,
            list: { _id, name, order },
        };
    });
}

// Get all lists based on boardId
export function getListsByBoardId(router: Router, list: Model<ListSchema>) {
    router.get(`/${list.lowerName}s/:boardId`, authMiddleware, async (ctx) => {
        const id = ctx.params.boardId;
        const lists = await list.schema.find({ boardId: new Mongo.ObjectId(id) }).toArray();

        ctx.response.body = {
            message: `${list.name} retrieved!`,
            lists,
        };
    });
}

// Get a list based on listId
export function getList(router: Router, list: Model<ListSchema>) {
    router.get(`/${list.lowerName}/:id`, authMiddleware, async (ctx) => {
        const id = ctx.params.id;
        const l = await list.schema.findOne({
            _id: new Mongo.ObjectId(id),
        });
        if (l == null) {
            ctx.response.status = 401;
            ctx.response.body = { message: 'List not found!' };
            return;
        }

        ctx.response.body = {
            message: `${list.name} retrieved`,
            list: l,
        };
    });
}

// Fetch cards based on list-id
export function getCardsByListId(router: Router, list: Model<ListSchema>, card: Model<CardSchema>) {
    router.get(`/${list.lowerName}/:id/cards`, authMiddleware, async (ctx) => {
        const _id = new Mongo.ObjectId(ctx.params.id);

        const l = await list.schema.findOne({ _id });
        const cards = await card.schema.find({ listId: _id }).toArray();
        if (l == null || cards == null) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'No lists or Cards found (with that ObjectId)!',
            };
            return;
        }

        ctx.response.body = {
            msg: 'Cards present in this board',
            cards,
        };
    });
}

// Update list content based on id
export function updateListContent(router: Router, list: Model<ListSchema>) {
    router.put(`/${list.lowerName}/:id`, authMiddleware, async (ctx) => {
        const id = ctx.params.id;
        const body = ctx.request.body();
        const content = await body.value;

        const l = await list.schema.updateOne(
            { _id: new Mongo.ObjectId(id) },
            {
                $set: { name: content.name, order: content.order },
            }
        );

        ctx.response.body = l;
    });
}

// Delete list based on listId
export function deleteList(router: Router, list: Model<ListSchema>) {
    router.delete(`/${list.lowerName}/:id`, authMiddleware, async (ctx) => {
        const _data = await list.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${list.name} deleted!`,
        };
    });
}
