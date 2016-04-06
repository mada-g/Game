import Koa from 'koa';
import _ from 'koa-route';
import parse from 'co-body';
import serve from 'koa-static';

let app = Koa();

app.use(serve('public'));

app.use(_.post('/levelpublish', function *(req, res){
  this.req.body = yield parse(this);
  this.body = this.req.body;
  console.log(this.body);
}));

app.listen(3000);

console.log("server listening on port 3000...");
