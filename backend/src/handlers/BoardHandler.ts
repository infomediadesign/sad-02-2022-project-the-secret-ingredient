import { Mongo } from '../deps.ts';
import { Model, Router } from '../types.ts';

export function createBoard<T>(router: Router, board: Model<T>) {
    router.post(`/${board.name}`, async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const name = content.name;
        const image = content.image;

        try {
            // await board.schema.findOne({ _id: new Mongo.ObjectId(boardId) });
            const payload: any = { name, image };

            const _objectId = await board.schema.insertOne(payload);
            ctx.response.body = {
                message: `${board.name} created!`,
            };
        } catch (error) {
            ctx.response.body = { message: 'U fucekd up', error };
            return;
        }
    });
}
