import { Oak, Mongo } from '../deps.ts';
import { Baord } from './models/Board.ts';
import { User } from './models/User.ts';
import { Activity } from './models/Activity.ts';
// import { crudFactory } from './util.ts';
import { List } from './models/List.ts';
import { Card } from './models/Card.ts';
import { createActivity } from './controllers/ActivityController.ts';
import { createBoard, getBoards, updateBoardContent, deleteBoard } from './controllers/BoardController.ts';
import { createList } from './controllers/ListController.ts';
import { createCard } from './controllers/CardController.ts';
import { registerUser, loginUser } from './controllers/UserController.ts';

const port = Number(Deno.env.get('APP_PORT')) || 3000;
const connectString = Deno.env.get('MONGODB_CONNECT_STRING') || 'mongodb://127.0.0.1:27017';

const appName = 'the-secret-ingredient';
const client = new Mongo.MongoClient();

await client.connect(connectString);

export const db = client.database(appName);

const app = new Oak.Application();
export const router = new Oak.Router();

const board = Baord(db);
const activity = Activity(db);
const list = List(db);
const card = Card(db);
const user = User(db);

router.get('/', (ctx) => {
    ctx.response.body = 'Server started :)';
});
router.get('/text', (ctx) => {
    try {
        ctx.throw(201, 'Whatsup my dud!');
        ctx.response.body = 'Test';
    } catch (error) {
        ctx.response.body = error;
    }
});

// crudFactory({ router, model: board });

//End Points for Board
createBoard(router, board, user);
createList(router, list, board);
createCard(router, card, board, list);
createActivity(router, activity, board);
registerUser(router, user);
loginUser(router, user);
getBoards(router, board);
updateBoardContent(router, board);
deleteBoard(router, board);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server started at: http://localhost:${port}`);

app.listen({ port });
