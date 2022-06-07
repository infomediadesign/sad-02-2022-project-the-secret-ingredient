import { Context, Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { Mongo, Status } from '../../deps.ts';
import { BoardSchema } from '../models/Board.ts';
import { ActivitySchema } from '../models/Activity.ts';
import { CardSchema } from '../models/Card.ts';
import { ListSchema } from '../models/List.ts';
import { UserSchema } from '../models/User.ts';

// Create board using userID
export function createBoard(router: Router, board: Model<BoardSchema>, user: Model<UserSchema>) {
    router.post(`/${board.lowerName}`, authMiddleware, async (ctx: Context) => {
        const body = ctx.request.body();
        const content = await body.value;

        const { name, image } = content;
        const userId = new Mongo.ObjectId(content.userId);

        const u = await user.schema.findOne({ _id: userId });
        ctx.assert(u != null, Status.FailedDependency, 'User not found!');

        const payload = { name, image, userId };
        const _objectId = await board.schema.insertOne(payload);

        ctx.response.body = {
            message: `${board.name} created!`,
        };
    });
}

// Get all boards for a user
export function getBoards(router: Router, board: Model<BoardSchema>) {
    router.get(`/${board.lowerName}s/:userID`, authMiddleware, async (ctx) => {
        const id = ctx.params.userID;
        const data = await board.schema.find({ userId: new Mongo.ObjectId(id) }).toArray();

        ctx.response.body = {
            message: `${board.name} retrieved!`,
            data,
        };
    });
}

// Get  a Board based on id of a user
export function getBoard(router: Router, board: Model<BoardSchema>) {
    router.get(`/${board.lowerName}/:id`, authMiddleware, async (ctx) => {
        const id = ctx.params.id;
        const b = await board.schema.findOne({ userID: new Mongo.ObjectId(id) });

        if (b == null) {
            ctx.response.status = 401;
            ctx.response.body = {
                message: 'Board not found!',
            };
        }

        ctx.response.body = {
            message: `${board.name} retrieved!`,
            b,
        };
    });
}

// Get lists based on boardId
export function getlistsByBoardId(router: Router, board: Model<BoardSchema>, list: Model<ListSchema>) {
    router.get(`/${board.lowerName}/lists/:id`, authMiddleware, async (ctx) => {
        const _id = new Mongo.ObjectId(ctx.params.id);

        const Board = await board.schema.findOne({
            _id,
        });

        if (!Board) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'No boards found to fetch the list!',
            };
        }

        const l = await list.schema.find({ boardId: _id }).toArray();
        if (l.length === 0) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'No activities found to fetch!',
            };
        }
        ctx.response.body = {
            msg: 'Lists present in this board!',
            lsit: l,
        };
    });
}

// GetCards based on BoardID
export function getCardsByBoardId(router: Router, board: Model<BoardSchema>, card: Model<CardSchema>) {
    router.get(`/${board.lowerName}/cards/:boardId`, authMiddleware, async (ctx) => {
        const boardId = new Mongo.ObjectId(ctx.params.boardId);
        const userId = new Mongo.ObjectId(ctx.params.userID);

        const Board = await board.schema.findOne({ _id: boardId, userId });
        if (!Board) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'No boards found to fetch the cards!',
            };
        }
        const Card = await card.schema.find({ boardId }).toArray();
        ctx.response.body = {
            msg: 'Cards present in this board!',
            Card,
        };
    });
}

// Fetch all activities based on boardid
export function getActivitysByBoardId(router: Router, board: Model<BoardSchema>, activity: Model<ActivitySchema>) {
    router.get(`/${board.lowerName}/activitys/:id`, authMiddleware, async (ctx) => {
        const id = ctx.params.id;

        const Board = await board.schema.findOne({
            _id: new Mongo.ObjectId(id),
        });
        if (!Board) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'no boards found to fetch the list.',
            };
        }
        const activities = await activity.schema.find({ boardId: new Mongo.ObjectId(id) }).toArray();
        if (activities.length === 0) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'no activities found to fetch.',
            };
        }
        ctx.response.body = {
            msg: 'Activities present in this board',
            activities,
        };
    });
}

// Update board based on boardid
export function updateBoardContent(router: Router, board: Model<BoardSchema>) {
    router.put(`/${board.lowerName}/:id`, authMiddleware, async (ctx) => {
        const id: string = ctx.params.id;
        const body = ctx.request.body();
        const value = await body.value;

        const Board = await board.schema.updateOne(
            { _id: new Mongo.ObjectId(id) },
            {
                $set: { name: value.name, image: value.image },
            }
        );
        ctx.response.body = Board;
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
