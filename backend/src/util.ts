import { Mongo, Oak } from './deps.ts';
import { Model } from './types.ts';

export function crudFactory<T>(router: Oak.Router<Record<string, any>>, model: Model<T>) {
    router.post(`/${model.name}`, async (ctx) => {
        const body = ctx.request.body();
        const value = await body.value;

        const _objectId = await model.schema.insertOne(value);
        ctx.response.body = {
            message: `${model.name} created!`,
        };
    });
    router.get(`/${model.name}s`, async (ctx) => {
        const data = await model.schema.find().toArray();
        ctx.response.body = {
            message: `${model.name}s retrieved!`,
            data,
        };
    });
    router.get(`/${model.name}/:id`, async (ctx) => {
        const data = await model.schema.findOne({ _id: new Mongo.ObjectId(ctx.params.id) });
        ctx.response.body = {
            message: `${model.name} retrieved!`,
            data,
        };
    });
    router.put(`/${model.name}/:id`, async (ctx) => {
        const body = ctx.request.body();
        const value = await body.value;

        const data = await model.schema.updateOne({ _id: new Mongo.ObjectId(ctx.params.id) }, {
            $set: { height: value.height, type: value.type },
        } as any);

        ctx.response.body = {
            message: `${model.name} updated!`,
            data,
        };
    });
    router.delete(`/${model.name}/:id`, async (ctx) => {
        const _data = await model.schema.deleteOne({ _id: new Mongo.ObjectId(ctx.params.id) });
        ctx.response.body = {
            message: `${model.name} deleted!`,
        };
    });
}
