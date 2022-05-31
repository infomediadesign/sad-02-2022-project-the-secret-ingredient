import { oak, create, bcrypt, jwt } from '../deps.ts';
import { auth } from '../middlewares/authMiddleware.ts';
import { Model, Router } from '../types.ts';

export function registerUser<T>(router: Router, user: Model<T>) {
    router.post('/register', async (ctx) => {
        const { password, passwordCheck, Username } = req.body;
        try {
            if (!password || !passwordCheck || !Username)
                return ctx.response.status(400).json({ msg: "Don't be lazy 🦥, enter all fields value" });

            if (password.length < 5)
                return ctx.response.status(400).json({ msg: 'Password is too small, try harder 🤪' });
            if (password != passwordCheck) return ctx.response.status(400).json({ msg: "Password don't match 👿" });

            const existingUser = await user.schema.findOne({ Username });
            if (existingUser)
                return ctx.response.status(400).json({ msg: 'Username exists, think of something unique 🦄' });

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const payload: any = { Username, passwordHash };
            const newUser = await user.schema.insertOne(payload);
            ctx.response.send({ username: ctx.response.Username, _id: ctx.response._id });
        } catch (error) {
            if (error.name === 'validationError') ctx.response.status(422);
            next(error);
        }
    });
}
