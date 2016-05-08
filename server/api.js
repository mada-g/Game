import Router from 'koa-router';
import render from './template-renderer';
import parse from 'co-body';
import * as mongo from './mongo';

let router = Router();

router.get('/game', function *(next){
  let data = yield mongo.getAll({submitBy: 'user'}, "name levelID");

  console.log(data);

  this.body = yield render('main', {userLevels: JSON.stringify(data)});
})

router.post('/game/levelpublish', function *(next){
  let data = yield parse(this);

  try{
    let levelID = yield mongo.save(data);
    this.response.body = {status: "success", levelID}
  }
  catch(error){
    this.response.body = {status: "error", levelID: null}
  }

})

router.get('/game/level/:id', function *(req, res){
  let data = yield mongo.get({levelID: `${this.params.id}`});

  //data.roamingObjs = JSON.parse(data.roamingObjs);
  //data.sqMorph = JSON.parse(data.sqMorph);

  console.log(data);

  this.body = yield render('level', {levelData: JSON.stringify(data)});

})

export default router;
