import Router from 'koa-router';
import render from './template-renderer';
import parse from 'co-body';
import * as mongo from './mongo';

let router = Router();

router.post('/levelpublish', function *(next){
  this.req.body = yield parse(this);
  this.body = this.req.body;
  console.log(this.body);

  mongo.save(this.body);
})

router.get('/level/:id', function *(req, res){
  let data = yield mongo.get({levelID: `${this.params.id}`});

  //data.roamingObjs = JSON.parse(data.roamingObjs);
  //data.sqMorph = JSON.parse(data.sqMorph);

  console.log(data);

  this.body = yield render('level', {levelData: JSON.stringify(data)});

})

export default router;
