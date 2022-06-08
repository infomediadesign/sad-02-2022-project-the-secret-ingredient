import { create, bcrypt, getNumericDate, validate, required, isEmail, Status, dayjs } from '../../deps.ts';
import { authMiddleware } from '../middlewares/auth.ts';
import { UserSchema } from '../models/User.ts';
import { Context, Model, Router } from '../types.ts';
import { decodeJwtFromHeader } from '../util.ts';

export const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, ['sign', 'verify']);

export function registerUser(router: Router, user: Model<UserSchema>) {
    router.post('/register', async (ctx: Context) => {
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

        ctx.assert(
            password && passwordCheck && username && email,
            Status.BadRequest,
            `Don't be lazy 🦥, enter all fields value`
        );
        ctx.assert(password === passwordCheck, Status.BadRequest, `Password don't match 👿`);
        ctx.assert(password.length > 5, Status.BadRequest, 'Password is too small, try harder 🤪');

        const existingUser = await user.schema.findOne({ email });

        ctx.assert(existingUser == null, Status.FailedDependency, 'User already exists, think of something unique 🦄');

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const payload = { username, email, password: passwordHash };
        const newUserId = await user.schema.insertOne(payload);

        ctx.response.body = {
            message: `User "${username}" registered.`,
            _id: newUserId,
            username,
            email,
            passwordHash,
        };
    });
}

export function loginUser(router: Router, user: Model<UserSchema>) {
    router.post('/login', async (ctx: Context) => {
        const Headers = ctx.request.headers;
        const authHeader = Headers.get('Authorization');

        const body = ctx.request.body();
        const content = await body.value;
        const { email, password, stayLoggedIn } = content;

        ctx.assert(email != null && password != null, Status.BadRequest, 'Please provide an email and a password!');

        const u = await user.schema.findOne({ email });
        ctx.assert(u != null, Status.FailedDependency, `No User with E-Mail: ${email} found!`);
        ctx.assert(bcrypt.compareSync(password, u.password), Status.BadRequest, 'Incorrect password!');

        const expDate = stayLoggedIn != null && stayLoggedIn === true ? dayjs().add(99, 'year') : dayjs().add(1, 'day');
        const exp = getNumericDate(expDate.toDate());
        const iat = getNumericDate(dayjs().toDate());

        const jwt =
            authHeader == null
                ? await create(
                      { alg: 'HS512', typ: 'JWT' },
                      { exp, iss: { _id: u._id.toString(), email: u.email, username: u.username }, iat },
                      key
                  )
                : authHeader;

        ctx.response.body = {
            message: `Logged in as "${u.username}"`,
            ...u,
            jwt,
        };
    });
}

export function me(router: Router, user: Model<UserSchema>) {
    router.get('/me', authMiddleware, async (ctx: Context) => {
        const Headers = ctx.request.headers;
        const authHeader = Headers.get('Authorization');

        ctx.assert(authHeader != null, Status.BadRequest, 'No token supplied!');

        const { email } = decodeJwtFromHeader(authHeader);
        ctx.assert(typeof email === 'string', Status.BadRequest, 'Wrong token-payload!');

        const u = await user.schema.findOne({ email });
        ctx.assert(u != null, Status.BadRequest, 'User from token not found!');

        ctx.response.body = { message: `User "${u.username}" retrieved.`, ...u };
    });
}
