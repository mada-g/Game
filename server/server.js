import Koa from 'koa';
import router from './api';
import parse from 'co-body';
import serve from 'koa-static';
import mongoose from 'mongoose';

import render from './template-renderer';

import * as mongo from './mongo';

let uri = 'mongodb://madalinskiHost:lavay38@ds035310.mlab.com:35310/levels';

let app = Koa();

mongo.init(uri);

app.use(serve('public'));

/*app.use(_.post('/levelpublish', function *(req, res){
  this.req.body = yield parse(this);
  this.body = this.req.body;
  console.log(this.body);

  mongo.save(this.body);
}));


app.use(_.get('/level/:id', function *(req, res){
  //this.body = yield parse(this);
  console.log(req.id);

  }));


app.use(_.get('/lev', function *(req, res){
  this.body = yield parse(this);

  mongo.get('custom game').then(data => {
  //    console.log(data);
  }).catch(console.log);
}));
*/

app.use(router.routes());

app.listen(3000);

console.log("server listening on port 3000...");
