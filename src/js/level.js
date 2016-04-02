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


  init: function(levelMap){
    this.column = levelMap.column;
    this.row = levelMap.row;
    this.arr = levelMap.arr;
    this.roamingObjs = levelMap.roamingObjs;

    this.grid = new Grid(this.row, this.column, this.sqSize, this);

    this.arr.forEach((r, rI) => {
      r.forEach((elem, cI) => {
        this.grid.read(rI, cI).setState(elem);
      })
    });



  },


  addEnemy: function(type, dir, speed, x, y){
    const n = this.roamingObjs.length;
    this.roamingObjs.push(
    //  new Enemy(type, dir, speed, x, y, `enemy-${n}`, this.grid)
    {type, dir, speed, id:`enemy-${n}`, spawnX: x, spawnY: y}
    )
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
    return {row: this.row, column: this.column, arr};
  },

  update: function(r, c, state){
    this.grid.update([r,c], state);
  }

}

export default Level;
