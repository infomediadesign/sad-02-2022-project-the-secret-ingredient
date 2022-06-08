import { Context, Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { Mongo, Status } from '../../deps.ts';
import { BoardSchema } from '../models/Board.ts';
import { ActivitySchema } from '../models/Activity.ts';
import { CardSchema } from '../models/Card.ts';
import { ListSchema } from '../models/List.ts';
import { UserSchema } from '../models/User.ts';
import { decodeJwtFromHeader, oakAssert } from '../util.ts';

// Create board using userId
export function createBoard(router: Router, board: Model<BoardSchema>, user: Model<UserSchema>) {
    router.post(`/${board.lowerName}`, authMiddleware, async (ctx: Context) => {
        const body = ctx.request.body();
        const content = await body.value;

        const { name, image, uId } = content;

        oakAssert(
            ctx,
            name != null && image != null && uId != null,
            Status.BadRequest,
            'Please provide the parameters: name, image and uId in the request-body!'
        );

        const userId = new Mongo.ObjectId(content.userId);

        const u = await user.schema.findOne({ _id: userId });
        ctx.assert(u != null, Status.FailedDependency, 'User not found!');

        const _id = await board.schema.insertOne({ name, image, userId });

        ctx.response.body = {
            board: { _id, name, image },
            message: `${board.name} created!`,
        };
    });
}

// Get all boards for a user
export function getBoards(router: Router, board: Model<BoardSchema>) {
    router.get(`/${board.lowerName}s/:userId`, authMiddleware, async (ctx) => {
        const userId = new Mongo.ObjectId(ctx.params.userId);
        const b = await board.schema.find({ userId }).toArray();

        ctx.response.body = {
            message: `${board.name} retrieved!`,
            board: b,
        };
    });
}

// Get  a Board based on id of a user
export function getBoard(router: Router, board: Model<BoardSchema>) {
    router.get(`/${board.lowerName}/:userId`, authMiddleware, async (ctx) => {
        const userId = new Mongo.ObjectId(ctx.params.id);
        const b = await board.schema.findOne({ userId });

        oakAssert(ctx, b != null, Status.BadRequest, 'Board not found!');

        ctx.response.body = {
            message: `${board.name} retrieved!`,
            board: b,
        };
    });
}

// Get lists based on boardId
export function getlistsByBoardId(router: Router, board: Model<BoardSchema>, list: Model<ListSchema>) {
    router.get(`/${board.lowerName}/lists/:bardId`, authMiddleware, async (ctx) => {
        const _id = new Mongo.ObjectId(ctx.params.bardId);

        const b = await board.schema.findOne({
            _id,
        });

        oakAssert(ctx, b != null, Status.BadRequest, 'No boards found to fetch the list!');

        const lists = await list.schema.find({ boardId: _id }).toArray();

        oakAssert(ctx, lists.length !== 0, Status.BadRequest, 'No activities found to fetch!');

        ctx.response.body = {
            message: 'Lists present in this board!',
            lists,
        };
    });
}

// GetCards based on BoardID
export function getCardsByBoardId(router: Router, board: Model<BoardSchema>, card: Model<CardSchema>) {
    router.get(`/${board.lowerName}/cards/:boardId`, authMiddleware, async (ctx) => {
        const Headers = ctx.request.headers;
        const authHeader = Headers.get('Authorization');

        oakAssert(ctx, authHeader != null, Status.BadRequest, 'No token supplied!');

        const { _id } = decodeJwtFromHeader(authHeader);
        oakAssert(ctx, typeof _id === 'string', Status.BadRequest, 'Wrong token-payload!');

        const boardId = new Mongo.ObjectId(ctx.params.boardId);
        const userId = new Mongo.ObjectId(_id);

        const b = await board.schema.findOne({ _id: boardId, userId });

        oakAssert(ctx, b != null, Status.BadRequest, 'No boards found to fetch the cards!');

        const cards = await card.schema.find({ boardId }).toArray();

        ctx.response.body = {
            message: 'Cards retrieved.',
            cards,
        };
    });
}

// Fetch all activities based on boardid
export function getActivitysByBoardId(router: Router, board: Model<BoardSchema>, activity: Model<ActivitySchema>) {
    router.get(`/${board.lowerName}/activitys/:id`, authMiddleware, async (ctx) => {
        const _id = new Mongo.ObjectId(ctx.params.id);

        const b = await board.schema.findOne({
            _id,
        });
        oakAssert(ctx, b != null, Status.BadRequest, 'No boards found to fetch the list!');

        const activities = await activity.schema.find({ boardId: _id }).toArray();
        oakAssert(ctx, activities.length !== 0, Status.BadRequest, 'No activities found to fetch!');

        ctx.response.body = {
            message: 'Activities present in this board retrieved.',
            activities,
        };
    });
}

// Update board based on boardid
export function updateBoardContent(router: Router, board: Model<BoardSchema>) {
    router.put(`/${board.lowerName}/:id`, authMiddleware, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const { name, image } = content;
        const _id = new Mongo.ObjectId(ctx.params.id);

        oakAssert(ctx, name != null && image != null, Status.BadRequest, 'Name and image must be provided!');

        const _b = await board.schema.updateOne(
            { _id },
            {
                $set: { name, image },
            }
        );

        ctx.response.body = {
            message: 'Board updated.',
            board: { _id, name, image },
        };
    });
}

// Delete board based on boardId
export function deleteBoard(router: Router, board: Model<BoardSchema>) {
    router.delete(`/${board.lowerName}/:id`, authMiddleware, async (ctx) => {
        const _data = await board.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${board.name} deleted!`,
        };
    });
}
