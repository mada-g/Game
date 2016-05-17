import Koa from 'koa';
import router from './api';
import parse from 'co-body';
import serve from 'koa-static';
import mongoose from 'mongoose';

import keys from '../keys';
import render from './template-renderer';

import * as mongo from './mongo';

let uri = keys.mongoURI;

let app = Koa();

mongo.init(uri);

app.use(serve('public'));

app.use(router.routes());

app.listen(3000);

console.log("server listening on port 3000...");
