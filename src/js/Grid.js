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
      square.init();
      square.run();
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
      square.run();
    })
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

  renderAllEnemyMarkers: function(){
    var dom = "";
    this.level.roamingObjs.forEach((obj) => {
      dom += this.renderEnemyMarker(obj.type, obj.spawnX, obj.spawnY);
    })

    return dom;
  },

  addEnemy: function(r, c){
    this.level.addEnemy(this.editEnemyType, this.editEnemyDir, this.editEnemySpeed, c*this.sqSize, r*this.sqSize);

    $('.editor').append(
      this.renderEnemyMarker(this.editEnemyType, c*this.sqSize, r*this.sqSize)
    );
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
