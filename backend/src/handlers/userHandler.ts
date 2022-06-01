import { Oak, create, bcrypt, jwt } from '../deps.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { Model, Router } from '../types.ts';

export function registerUser<T>(router: Router, user: Model<T>) {
    router.post('/register', async (ctx) => {
        const body = ctx.request.body();
        const value = await body.value;
        const { password, passwordCheck, username } = value;
        try {
            const existingUser = await user.schema.findOne({ username });

            if (!password || !passwordCheck || !username) ctx.throw(400, "Don't be lazy 🦥, enter all fields value");
            if (password.length < 5) ctx.throw(400, 'Password is too small, try harder 🤪');
            if (password != passwordCheck) ctx.throw(400, "Password don't match 👿");
            if (existingUser) ctx.throw(400, 'username already exists, think of something unique 🦄');

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const payload = { username, passwordHash } as any;
            const newUserOId = await user.schema.insertOne(payload);
            ctx.response.body = { _id: newUserOId, username };
        } catch (error) {
            if (error.name === 'validationError') ctx.throw(422);
        }
    });
}
