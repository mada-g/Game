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
  editBlockCycle_0: 2,
  editBlockCycle_1: 2,
  editBlockMorphStates: ['green-wall', 'empty'],
  placePlayerMarker: false,
  placeStarMarker: false,
  brushX: 1,
  brushY: 1,
  sqMarker: [-1,-1],

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

  registerEditorInput: function(){
    $('.enemy-marker').click((e) => {
      console.log('MARKER!!');
      if(this.editMode === 'erase'){
        var id = e.target.getAttribute('data-enemy-id');
        console.log("delete id " + id);
        $(e.target).remove();

        this.level.removeEnemy(id);
      }
    });
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
      sq.cycle_0 = obj.cycle_0;
      sq.cycle_1 = obj.cycle_1;
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

  removeSquareMarker: function(r, c){
    let sq = this.read(r,c);
    sq.update(sq.prevState);
  },

  addSquareMarker: function(r,c){
    let sq = this.read(r,c);
    sq.update(this.editBlockType);
  },

  unmarkSquare: function(r,c){
    if(this.editMode === "block"){
      this.unbrush(r,c);
    }
    else
    this.read(r,c).update(this.read(r,c).prevState);
  },

  markSquare: function(r,c){
    let sq = this.read(r,c);

    switch (this.editMode) {
      case "block": {
        //sq.update(this.editBlockType); break;
        this.brush(false, r,c); break;
      }
      case "enemy": {
        sq.update(`enemy-marker ${this.editEnemyType}`); break;
      }
      case "erase": {
        sq.update(sq.state);
        break;
      }
      case "star": {
        sq.update('star-marker'); break;
      }
      case "player": {
        sq.update('player-marker'); break;
      }
      case "morph": {
        sq.update(`${this.editBlockMorphStates[0]}`); break;
      }
    }
  },

  modSquare: function(r,c){
    switch (this.editMode) {
      case "block": {
        this.brush(true, r,c); break;
        /*let sq = this.read(r,c);
        sq.suspendMorph();
        this.removeMorph(r,c);
        sq.update(this.editBlockType); break;*/
      }
      case "enemy": {
        this.addEnemy(r,c); break;
      }
      case "erase": {
        break;
      }
      case "star": {
        //this.unmarkSquare(r,c);
        this.placeStar(r,c); break;
      }
      case "player": {
        //this.unmarkSquare(r,c);
        this.placePlayer(r,c); break;
      }
      case "morph": {
        this.read(r,c).morphable = false;
        this.placeMorph(r,c); break;
      }
    }
  },

  renderEnemyMarker: function(type, x, y, id){
    console.log(x + "~~~~~~~~" + y);
    return `<div data-enemy-id="${id}" class="placeholder enemy-marker ${type}" style="height:${this.sqSize}px; width:${this.sqSize}px; top:${y}px; left:${x}px;"></div>`
  },

  renderPlayerMarker: function(x,y){
    $('.placeholder.player-marker').remove();
    return `<div class="placeholder square player-marker" style="height:${0.7*this.sqSize}px; width:${0.7*this.sqSize}px; top:${y}px; left:${x}px;"></div>`
  },



  renderAllEnemyMarkers: function(){
    var dom = "";
    this.level.roamingObjs.forEach((obj) => {
      dom += this.renderEnemyMarker(obj.type, obj.spawnX, obj.spawnY, obj.id);
    })

    return dom;
  },

  renderStarMarker: function(x,y){
    $('.placeholder.star-marker').remove();
    return `<div class="placeholder square star-marker" style="height:${0.7*this.sqSize}px; width:${0.7*this.sqSize}px; top:${y}px; left:${x}px;"></div>`
  },

  unbrush: function(r,c){
    let startX = c - Math.floor(this.brushX/2);
    startX = startX < 0 ? 0 : startX;

    let endX = c + Math.ceil(this.brushX/2);
    endX = endX > this.width ? this.width : endX;

    let startY = r - Math.floor(this.brushY/2);
    startY = startY < 0 ? 0 : startY;

    let endY = r + Math.ceil(this.brushY/2);
    endY = endY > this.height ? this.height : endY;

    for(let x = startX; x < endX; x++){
      for(let y = startY; y<endY; y++){
        this.read(y,x).update(this.read(y,x).prevState);
      }
    }
  },

  brush: function(mod, r, c){
    let startX = c - Math.floor(this.brushX/2);
    startX = startX < 0 ? 0 : startX;

    let endX = c + Math.ceil(this.brushX/2);
    endX = endX > this.width ? this.width : endX;

    let startY = r - Math.floor(this.brushY/2);
    startY = startY < 0 ? 0 : startY;

    let endY = r + Math.ceil(this.brushY/2);
    endY = endY > this.height ? this.height : endY;

    for(let x = startX; x < endX; x++){
      for(let y = startY; y<endY; y++){
        if(mod && this.read(y,x).morphable){
          this.read(y,x).suspendMorph();
          this.removeMorph(y,x);
        }
        this.read(y,x).update(this.editBlockType);
      }
    }
  },

  addEnemy: function(r, c){
    const id = this.level.addEnemy(this.editEnemyType, this.editEnemyDir, this.editEnemySpeed, c*this.sqSize, r*this.sqSize);

    console.log('ID ' + id);

    $('.editor').append(
      this.renderEnemyMarker(this.editEnemyType, c*this.sqSize, r*this.sqSize, id)
    );

    this.registerEditorInput();

  },

  removeEnemy: function(id){

  //  this.level.removeEnemy(id);
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
    this.level.placeMorph(r,c, this.editBlockMorphStates, this.editBlockDelay*1000, this.editBlockCycle_0*1000, this.editBlockCycle_1*1000);
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
