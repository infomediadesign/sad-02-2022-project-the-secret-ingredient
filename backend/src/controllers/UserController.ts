import { create, bcrypt, getNumericDate, validate, required, isEmail } from '../../deps.ts';
import { UserSchema } from '../models/User.ts';
import { Model, Router } from '../types.ts';

export const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, ['sign', 'verify']);

export function registerUser(router: Router, user: Model<UserSchema>) {
    router.post('/register', async (ctx) => {
        const body = ctx.request.body();
        const content = await body.value;
        const { password, passwordCheck, username, email } = content;

        const [passes, errors] = await validate(content, {
            username: required,
            password: required,
            passwordCheck: required,
            email: isEmail,
        });
        console.log({ passes, errors });

        if (!password || !passwordCheck || !username || !email) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: "Don't be lazy 🦥, enter all fields value",
            };
            return;
        }

        const existingUser = await user.schema.findOne({ email });
        if (existingUser != null) {
            console.log(existingUser);
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'user already exists, think of something unique 🦄',
            };
            return;
        }
        // ctx.throw(400, "Don't be lazy 🦥, enter all fields value");
        if (password.length < 5) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: 'Password is too small, try harder 🤪',
            };
            return;
        }
        //  ctx.throw(400, 'Password is too small, try harder 🤪');
        if (password != passwordCheck) {
            ctx.response.status = 400;
            ctx.response.body = {
                msg: "Password don't match 👿",
            };
            return;
        }

        // ctx.throw(400, 'username already exists, think of something unique 🦄');

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const payload = { username, email, password: passwordHash };
        const newUserId = await user.schema.insertOne(payload);
        ctx.response.body = { _id: newUserId, username, email, passwordHash };
    });
}

export function loginUser(router: Router, user: Model<UserSchema>) {
    router.post('/login', async (ctx) => {
        const Headers = ctx.request.headers;
        const authHeader = Headers.get('Authorization');

        const body = ctx.request.body();
        const content = await body.value;
        const { username, password } = content;

        if (!username || !password) {
            ctx.response.status = 422;
            ctx.response.body = {
                msg: 'Please provide a username and a password!',
            };
            return;
        }

        const u = await user.schema.findOne({ username });
        if (u == null) {
            ctx.response.status = 422;
            ctx.response.body = {
                msg: 'Incorrect username!',
            };
            return;
        }

        const jwt =
            authHeader == null
                ? await create({ alg: 'HS512', typ: 'JWT' }, { exp: getNumericDate(60 * 60), iss: u.username }, key)
                : authHeader;

        if (!bcrypt.compareSync(password, u.password)) {
            ctx.response.status = 422;
            ctx.response.body = {
                msg: 'Incorrect password!',
            };
            return;
        }

        ctx.response.body = {
            username: u.username,
            passwordHash: u.password,
            jwt,
        };
    });
}
