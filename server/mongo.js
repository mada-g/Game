import mongoose from 'mongoose';
import shortid from 'shortid';

let Level = null;
let db = null;

export function init(uri){
  mongoose.connect(uri);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', success);
}

let success = function(){

  let LevelSchema = mongoose.Schema({
    name: String,
    row: Number,
    column: Number,
    starPosition: [Number],
    playerSpawn: [Number],
    sqMorph: String,
    roamingObjs: String,
    arr: String,
    levelID: String,
    submitBy: String,
  })

  Level = mongoose.model('Level', LevelSchema);

  console.log("success...");
}


export function get(query){
  return new Promise((resolve, reject) => {
    Level.findOne(query).then((level) => {
      resolve(level);
    }).catch((error) => {reject(error)});
  })
}


export function getAll(query, selection){
  return new Promise((resolve, reject) => {
    Level.find(query, selection).then((levels) => {
      resolve(levels);
    }).catch((error) => {reject(error)});
  })
}

export function save(data){
  console.log("ready...");

  return new Promise((resolve, reject)=>{
    let levelID = shortid.generate();
    data.levelID = levelID;

    let doc = new Level(data);

    doc.save((err, doc) => {
      if(err){
        console.log(err);
        reject(err);
      }
      else{
        console.log('SAVED!');
        resolve(levelID);
      }

    })

  });

}
