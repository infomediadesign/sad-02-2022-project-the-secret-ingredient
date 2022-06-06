import { Model, Router } from '../types.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { Mongo } from '../../deps.ts';

//create board using userID
export function createBoard<T, E>(router: Router, board: Model<T>, user: Model<E>) {
    router.post(`/${board.name}`, authMiddleware, async function (ctx) {
        const body = ctx.request.body();
        const content = await body.value;
        const name = content.name;
        const image = content.image;
        const userid = content.userID;
        // const selectedUser = ctx.state.user;
        // console.log(selectedUser);
        // console.log(selectedUser);
        try {
            // await user.schema.findOne({ username: selectedUser }).then(async function (res: any) {
            await user.schema.findOne({ _id: new Mongo.ObjectId(userid) });
        } catch (error) {
            ctx.response.body = { message: 'U fucekd up', error };
            console.log(error);
            return;
        }

        const payload = { name, image, userId: new Mongo.ObjectId(userid) } as any;
        const _objectId = await board.schema.insertOne(payload);
        ctx.response.body = {
            message: `${board.name} created!`,
        };
    });
}
//get all boards for a user
export function getBoards<T>(router: Router, board: Model<T>) {
    router.get(`/${board.name}s/:userID`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.userID;
        const data = await board.schema.find({ userId: new Mongo.ObjectId(id) }).toArray();
        console.log(data);
        ctx.response.body = {
            message: `${board.name} retrieved!`,
            data,
        };
    });
}

//get  a Board based on id of a user

export function getBoard<T>(router: Router, board: Model<T>) {
    router.get(`/${board.name}/:id`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.id;
        try {
            const data = await board.schema.findOne({ userID: new Mongo.ObjectId(id) });
            ctx.response.body = {
                message: `${board.name} retrieved`,
                data,
            };
        } catch (e) {
            ctx.response.body = {
                message: `${e}`,
            };
        }
    });
}

//get lists based on boardId
export function getlistsByBoardId<T, E>(router: Router, board: Model<T>, list: Model<E>) {
    router.get(`/${board.name}/lists/:id`, authMiddleware, async (ctx: any) => {
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
        const List = await list.schema.find({ boardId: new Mongo.ObjectId(id) }).toArray();
        if (List.length === 0 || undefined) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'no activities found to fetch.',
            };
        }
        ctx.response.body = {
            msg: 'Lists present in this board',
            List,
        };
    });
}

//getCards based on BoardID
export function getCardsByBoardId<T, E>(router: Router, board: Model<T>, card: Model<E>) {
    router.get(`/${board.name}/cards/:id`, authMiddleware, async (ctx: any) => {
        const id = ctx.params.id;
        const userid = ctx.params.userID;

        const Board = await board.schema.findOne({ userID: new Mongo.ObjectId(userid), _id: id });
        if (!Board) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'no boards found to fetch the cards.',
            };
        }
        const Card = await card.schema.find({ boardId: id }).toArray;
        ctx.response.body = {
            msg: 'cards present in this board',
            Card,
        };
    });
}

//fetch all activities based on boardid
export function getActivitysByBoardId<T, E>(router: Router, board: Model<T>, activity: Model<E>) {
    router.get(`/${board.name}/activitys/:id`, authMiddleware, async (ctx: any) => {
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
        const Activity = await activity.schema.find({ boardId: new Mongo.ObjectId(id) }).toArray();
        if (Activity === []) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'no activities found to fetch.',
            };
        }
        ctx.response.body = {
            msg: 'Activities present in this board',
            Activity,
        };
    });
}
//update board based on boardid
export function updateBoardContent<T>(router: Router, board: Model<T>) {
    router.put(`/${board.name}/:id`, authMiddleware, async (ctx) => {
        const id: string = ctx.params.id;
        const body = ctx.request.body();
        const value = await body.value;

        const Board = await board.schema.updateOne({ _id: new Mongo.ObjectId(id) }, {
            $set: { name: value.name, image: value.image },
        } as any);
        ctx.response.body = Board;
        console.log(Board);
    });
}

//delete board based on boardId
export function deleteBoard<T>(router: Router, board: Model<T>) {
    router.delete(`/${board.name}/:id`, authMiddleware, async (ctx) => {
        const _data = await board.schema.deleteOne({
            _id: new Mongo.ObjectId(ctx.params.id),
        });
        ctx.response.body = {
            message: `${board.name} deleted!`,
        };
    });
}
