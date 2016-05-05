import _ from 'underscore';

import Grid from './Grid';
import Enemy from './enemy';

var Level = function(levelMap){
  this.init(levelMap);
}

Level.prototype = {
  grid: null,
  arr: [[]],
  roamingObjs: [],
  column: 0,
  row: 0,
  sqSize: 20,
  name: "",
  playerSpawn: [0,0],
  starPosition: [0,0],
  sqMorph: {},

  init: function(levelMap){
    this.column = levelMap.column;
    this.row = levelMap.row;
    this.arr = levelMap.arr;
    this.roamingObjs = levelMap.roamingObjs;
    this.sqMorph = levelMap.sqMorph || {},
    this.name = levelMap.name || "custom game";

    this.playerSpawn = levelMap.playerSpawn || [20,20];
    this.starPosition = levelMap.starPosition || [50,50];

    this.grid = new Grid(this.row, this.column, this.sqSize, this);

    console.log(levelMap);

    this.arr.forEach((r, rI) => {
      r.forEach((elem, cI) => {
        this.grid.read(rI, cI).setState(elem);
      })
    });

  },

  addEnemy: function(type, dir, speed, x, y){
    const n = this.roamingObjs.length;
    this.roamingObjs.push(
      {type, dir, speed, id:`enemy-${n}`, spawnX: x, spawnY: y}
    )

  return `enemy-${n}`;
  },

  removeEnemy: function(id){
    this.roamingObjs = this.roamingObjs.filter((val) => {
      return val.id !== id
    });
  },

  placePlayer: function(x, y){
    this.playerSpawn[0] = x;
    this.playerSpawn[1] = y;
  },

  placeStar: function(x,y){
    this.starPosition[0] = x;
    this.starPosition[1] = y;
  },

  placeMorph: function(r,c, morphStates, delay, cycle_0, cycle_1){
    this.sqMorph[`${r}-${c}`] = {row: r, column: c, delay, cycle_0, cycle_1, state1: morphStates[0], state2: morphStates[1]};
  },

  removeMorph: function(r,c){
    this.sqMorph = _.omit(this.sqMorph, `${r}-${c}`);
  },

  extract: function(){
    return {
      name: this.name,
      row: this.row,
      column: this.column,
      arr: JSON.stringify(this.extractGrid()),
      roamingObjs: JSON.stringify(this.roamingObjs),
      sqMorph: JSON.stringify(this.sqMorph),
      starPosition: this.starPosition,
      playerSpawn: this.playerSpawn
    }
  },

  extractGrid: function(){

    var arr = [];

    for(var r = 0; r< this.row; r++){
        var nRow = [];
      for(var c = 0; c<this.column; c++){
        nRow.push(this.grid.read(r,c).state);
      }
      arr.push(nRow);
    }


/*    this.grid.forEach((r) => {
      let nRow = [];
      r.forEach((elem) => {
        nRow.push(elem.state);
      })
      arr.push(nRow);
    })
*/
    return arr;
  },

  update: function(r, c, state){
    this.grid.update([r,c], state);
  }

}

export default Level;
