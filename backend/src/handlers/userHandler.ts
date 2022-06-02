import { create, bcrypt, getNumericDate } from '../deps.ts';
// import { auth } from '../middlewares/authMiddleware.ts';
import { Model, Router } from '../types.ts';
const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, ['sign', 'verify']);

export function registerUser<T>(router: Router, user: Model<T>) {
    router.post('/register', async (ctx) => {
        const body = ctx.request.body();
        const value = await body.value;
        const { password, passwordCheck, username } = value;
        try {
            const existingUser = await user.schema.findOne({ username });

            if (!password || !passwordCheck || !username) {
                ctx.response.status = 400;
                ctx.response.body = {
                    msg: "Don't be lazy 🦥, enter all fields value",
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
            // ctx.throw(400, "Password don't match 👿");
            if (existingUser) {
                console.log(existingUser);
                ctx.response.status = 400;
                ctx.response.body = {
                    msg: 'username already exists, think of something unique 🦄',
                };
                return;
            }
            // ctx.throw(400, 'username already exists, think of something unique 🦄');

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            // deno-lint-ignore no-explicit-any
            const payload = { username, passwordHash } as any;
            const newUserOId = await user.schema.insertOne(payload);
            ctx.response.body = { _id: newUserOId, username, passwordHash };
        } catch (error) {
            if (error) {
                ctx.response.status = 422;
                ctx.response.body = {
                    msg: 'validationError',
                };
                return;
            }
        }
    });
}
export function loginUser<T>(router: Router, user: Model<T>) {
    router.post('/login', async (ctx) => {
        const body = ctx.request.body();
        const value = await body.value;
        const { username, password } = value;

        try {
            await user.schema.findOne({ username }).then(async function (e: any) {
                if (!bcrypt.compareSync(password, e.passwordHash!)) {
                    ctx.response.status = 422;
                    ctx.response.body = {
                        msg: 'incorrect password',
                    };
                    return;
                }
                // deno-lint-ignore no-unreachable
                const jwt = await create(
                    { alg: 'HS512', typ: 'JWT' },
                    { exp: getNumericDate(60 * 60), iss: e.username! },
                    key
                );
                if (!e) {
                    ctx.response.status = 422;
                    ctx.response.body = {
                        msg: 'incorrect username',
                    };
                    return;
                }

                ctx.response.body = {
                    username: e.username,
                    passwordHash: e.passwordHash,
                    jwt,
                };
            });

            if (!username || !password) {
                {
                    ctx.response.status = 422;
                    ctx.response.body = {
                        msg: 'Please provide username and password',
                    };
                }
            }
        } catch (error) {
            if (error) {
                ctx.response.status = 422;
                ctx.response.body = {
                    msg: 'incorrect Username',
                };
                return;
            }
        }
    });
}
