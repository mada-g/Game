import $ from 'jquery';

import Array2d from './Array2d';
import Square from './Square';

function Grid(height, width, sqSize, level){
  this.height = height;
  this.width = width;
  this.level = level;
  this.sqSize = sqSize;

  this.array = new Array2d(height, width);
  this.populate();
}

Grid.prototype = {
  sqSize: 20,
  array : [[]],
  squaresInFocus: [],
  mouseDown: false,
  editBlockType: 'wall',
  level: null,
  editEnemy: false,
  editEnemyType: 'fireball',
  editEnemyDir: 'vertical',
  editEnemySpeed: 2,
  editBlockMorphable: false,
  editBlockDelay: 0.5,
  editBlockCycle: 2,
  editBlockMorphStates: ['green-wall', 'empty'],
  placePlayerMarker: false,
  placeStarMarker: false,
  brushX: 10,
  brushY: 10,

  editMode: 'block',

  populate: function(){
    for(var r=0; r<this.height; r++)
      for(var c=0; c<this.width; c++){
        this.array.write(r,c, new Square(r,c, this.sqSize, this));
      }
  },

  read: function(r, c){
    return this.array.read(r,c);
  },

  write: function(r, c, val){
    this.array.write(r,c, val);
  },

  print: function(){
    this.array.print();
  },

  forEach: function(fn){
    this.array.forEach(fn);
  },

  clear: function(){
    this.array.forEach((elem) => {
      elem.setState('empty');
    });
    return this.render();
  },

  render: function(){
    var html = "";
    this.forEach((square) => {
      html += square.render();
      square.morphable = false;
      square.run();
      console.log(square.state);
    })
    return html;
  },

  squareAt: function(pos){
    var x = pos[0];
    var y = pos[1];

    y = Math.floor(y/this.sqSize);
    x = Math.floor(x/this.sqSize);

    return this.read(y,x);
  },

  morphStates: function(index){
    const morphState = this.editBlockMorphStates[index];
    return morphState;
  },

  activateSquares: function(){
    this.forEach((square) => {
      square.editing = true;
      square.morphable = false;
      square.run();
    })
  },

  activateMorph: function(){
    for(let key in this.level.sqMorph){
      const obj = this.level.sqMorph[key];
      const sq = this.read(obj.row, obj.column);
      sq.morphable = true;
      sq.delay = obj.delay;
      sq.cycle = obj.cycle;
      sq.morphState_0 = obj.state1;
      sq.morphState_1 = obj.state2;
      sq.init();
    }
  },

  suspendSquares: function(){
    this.forEach((square) => {
      square.editing = false;
    })
  },

  renderEnemyMarker: function(type, x, y){
    console.log(x + "~~~~~~~~" + y);
    return `<div class="placeholder enemy-marker ${type}" style="height:${this.sqSize}px; width:${this.sqSize}px; top:${y}px; left:${x}px;"></div>`
  },

  renderPlayerMarker: function(x,y){
    $('.player-marker').remove();
    return `<div class="placeholder square player-marker" style="height:${0.7*this.sqSize}px; width:${0.7*this.sqSize}px; top:${y}px; left:${x}px;"></div>`
  },



  renderAllEnemyMarkers: function(){
    var dom = "";
    this.level.roamingObjs.forEach((obj) => {
      dom += this.renderEnemyMarker(obj.type, obj.spawnX, obj.spawnY);
    })

    return dom;
  },

  renderStarMarker: function(x,y){
    $('.star-marker').remove();
    return `<div class="placeholder square star-marker" style="height:${0.7*this.sqSize}px; width:${0.7*this.sqSize}px; top:${y}px; left:${x}px;"></div>`
  },

  brush: function(r, c){
    let startX = Math.floor(c - this.brushX/2);
    startX = startX < 0 ? 0 : startX;

    let endX = Math.ceil(c + this.brushX/2);
    endX = endX >= this.width ? 0 : endX;

    let startY = Math.floor(r - this.brushY/2);
    startY = startY < 0 ? 0 : startY;

    let endY = Math.ceil(r + this.brushX/2);
    endY = endY >= this.height ? 0 : endY;

    for(let x = startX; x < endX; x++){
      for(let y = startY; y<endY; y++){
        this.read(y,x).update(this.editBlockType);
      }
    }
  },

  addEnemy: function(r, c){
    this.level.addEnemy(this.editEnemyType, this.editEnemyDir, this.editEnemySpeed, c*this.sqSize, r*this.sqSize);

    $('.editor').append(
      this.renderEnemyMarker(this.editEnemyType, c*this.sqSize, r*this.sqSize)
    );
  },

  placePlayer: function(r,c){
    this.level.placePlayer(c*this.sqSize, r*this.sqSize);
    $('.editor').append(
      this.renderPlayerMarker(c*this.sqSize, r*this.sqSize)
    )
  },

  placeStar: function(r,c){
    this.level.placeStar(c*this.sqSize, r*this.sqSize);
    $('.editor').append(
      this.renderStarMarker(c*this.sqSize, r*this.sqSize)
    )
  },

  placeMorph: function(r,c){
    this.level.placeMorph(r,c, this.editBlockMorphStates, this.editBlockDelay*1000, this.editBlockCycle*1000);
    this.activateMorph();
  },

  removeMorph: function(r,c){
    this.level.removeMorph(r,c);
    this.activateMorph();
  },

  squareFocus: function(square){
    /*this.squaresInFocus.forEach((sq) => {
      sq.update(sq.prevState);
    });*/

    this.squareFocus = [];

    this.squaresInFocus.push(square);
    square.update('food');
  },

  update: function(coord, state){
    var r = coord[0];
    var c = coord[1];


    this.read(coord[0], coord[1]).update(state);

    //this.read(coord[0], coord[1]).setState(state);

    //console.log(this.read(coord[0], coord[1]).state);

    /*$(`#${r}-${c}`).remove();
    $('.content').append(this.read(r,c).render());
*/



    if(state ==='food'){
      console.log(this.read(r,c).state)

    }

  },

}

export default Grid;
