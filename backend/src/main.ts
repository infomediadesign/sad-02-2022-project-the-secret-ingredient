import { Oak, Mongo } from './deps.ts';
import { Car } from './models/Car.ts';
import { Tree } from './models/Tree.ts';
import { crudFactory } from './util.ts';

const port = 1234;
const appName = 'crud-factory-server';
const client = new Mongo.MongoClient();
await client.connect('mongodb://127.0.0.1:27017');

const db = client.database(appName);

const app = new Oak.Application();
const router = new Oak.Router();

const tree = Tree(db);
const car = Car(db);

crudFactory(router, tree);
crudFactory(router, car);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server started at: http://localhost:${port}`);
app.listen({ port });
