import { Oak, Mongo } from './deps.ts';
import { Baord } from './models/Board.ts';
import { Activity } from './models/Activity.ts';
import { crudFactory } from './util.ts';
import { createActivity } from './handlers/ActivityHandler.ts';
import { createBoard } from './handlers/BoardHandler.ts';
import { createList } from './handlers/ListHandler.ts';
import { createCard } from './handlers/CardHandler.ts';
import { List } from './models/List.ts';
import { Card } from './models/Card.ts';

const port = 1234;
const appName = 'crud-factory-server';
const client = new Mongo.MongoClient();
await client.connect('mongodb://127.0.0.1:27017');

const db = client.database(appName);

const app = new Oak.Application();
const router = new Oak.Router();

const board = Baord(db);
const activity = Activity(db);
const list = List(db);
const card = Card(db);

crudFactory({ router, model: board });
createBoard(router, board);
createList(router, list, board);
createCard(router, card, board, list);
createActivity(router, activity, board);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server started at: http://localhost:${port}`);
app.listen({ port });
