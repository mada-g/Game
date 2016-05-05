import $ from 'jquery';

import squareTypes from "../data/squareTypes";

var allSpeeds = [10, 20, 35, 60, 100];

var Enemy = function(type, dir, speed, spawnX, spawnY, id, grid){
  this.id = id;
  this.dir = dir;
  this.spawnX = spawnX;
  this.spawnY = spawnY;

  this.type = type;
  this.grid = grid;
  this.size = grid.sqSize;

  this.speedMult = allSpeeds[speed];
  console.log("mult: " + this.speedMult);
};

Enemy.prototype = {
  grid: null,
  vX: 0,
  vY: 1,
  size: 20,
  type: 'fireball',
  spawnX: 0,
  spawnY: 0,
  xPos: 0,
  yPos: 0,
  speedMult: 100,
  elem: null,
  id: -1,
  immortal: false,
  dead: false,
  delay: 3000,
  timeoutID: null,
  borders: [
    'top',
    'down',
    'left',
    'right'
  ],

  init: function(){



    if(this.dir === 'horizontal'){
      this.vX = this.speedMult;
      this.vY = 0;
    }
    else{
      this.vX = 0;
      this.vY = this.speedMult;
    }

    this.xPos = this.spawnX;
    this.yPos = this.spawnY;

    $('.content').append(this.render());

    this.elem = document.querySelector(`#${this.id}`);

    $(`#${this.id}`).click((e) => {
      if(this.grid.editMode === 'erase'){
        console.log('erasing...');
        this.remove();
      }
    })

  },

  render: function(){
    return `<div id="${this.id}" class="roaming ${this.type}" style="width:${this.size}px; height:${this.size}px; left:${this.spawnX}px; top:${this.spawnY}px;"></div>`
  },

  suspend: function(){
    clearTimeout(this.timeoutID);
    $(`#${this.id}`).remove();
  },

  remove: function(){
    this.suspend();
    this.grid.removeEnemy(this.id);
  },

  boundaries: function(dt){

    var nPos = [
      this.xPos + dt * this.vX *0.003,
      this.yPos + dt * this.vY *0.003
    ];

    //var nPos = this.pos;


    var step = this.grid.sqSize;

    var bounds = [];

    var Xs = [
      nPos[0] +1,
      nPos[0] + this.size -1,
      nPos[0] + this.size/2
    ];

    var Ys = [
      nPos[1] +1,
      nPos[1] + this.size -1,
      nPos[1] + this.size/2
    ];


    for(var x=0; x<Xs.length; x++){
      for(var y=0; y<Ys.length; y++){
        //console.log(x + " - " + y);
        bounds.push(this.grid.squareAt([Xs[x], Ys[y]]));
      }
    }

    return bounds;
  },

  collide_wall: function(){

    if(this.dir === 'horizontal'){
      this.vX = -1*this.vX;
    }
    else if(this.dir === 'vertical'){
      this.vY = -1*this.vY;
    }
  },

  collide_enemy: function(){

    if(this.immortal){
      this.collide_wall();
    }
    else{
      this.dead = true;
      this.respawnDelay();
      $(`#${this.id}`).remove();
    }
  },


  motionOutcome: function(sq){



    var type = (!sq) ? 'wall' : squareTypes[sq.state];

    var isEmpty = true;

//    console.log("state: " + sq.state);
//    console.log("type : " + type);

    if(type === 'wall'){
      this.collide_wall();
      isEmpty = false;
    }

    else if(type === 'enemy'){
      this.collide_enemy();
      isEmpty = false;
    }

    return isEmpty;

  },

  respawnDelay: function(){
    this.timeoutID = setTimeout(() => {
      //this.render();
      this.init();
      this.dead = false;
    }, this.delay);
  },

  animate: function(dt){

    if(this.dead){
      return;
    }

    var bounds = this.boundaries(dt);

    for(var i = 0; i< bounds.length; i++){
      //console.log(bounds[i].row + " -  " + bounds[i].column);
      if(!this.motionOutcome(bounds[i])) break;
      //bounds[i].update('empty');
    }

    //console.log(this.spawnX + " -- " + this.spawnY);

  //  console.log(allSpeeds[this.speedIndex]);


    this.xPos += dt * this.vX *0.003;
    this.yPos += dt * this.vY *0.003;

    if(this.dir === 'vertical'){
      if(this.vY > 0){
        this.yPos = Math.floor(this.yPos/2.5) * 2.5;
      }
      else{
        this.yPos = Math.ceil(this.yPos/2.5) * 2.5;
      }
    }
    else{
      if(this.vX > 0){
        this.xPos = Math.floor(this.xPos/2.5) * 2.5;
      }
      else{
        this.xPos = Math.ceil(this.xPos/2.5) * 2.5;
      }
    }

    this.elem.style.left = this.xPos + 'px';
    this.elem.style.top = this.yPos + 'px';
  },


};


export default Enemy;
