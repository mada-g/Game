import $ from 'jquery';

import Square from './Square';
import squareTypes from '../data/squareTypes';

var Player = function(game){
  this.game = game;
}


Player.prototype = {
  game: null,
  startPos: [10,10],
  vX: 0,
  vY: 0,
  speedMult: 50,
  size: [20,40],
  pos: [40,10],
  elem: null,
  jumping: false,
  grounded: false,
  deathCount: 0,
  death: false,
  keys: {
    right: false,
    left: false,
    up: false,
    down: false
  },
  borders: [
    'top',
    'down',
    'left',
    'right'
  ],

  init: function(spawn){
    this.startPos = spawn;

    $('.content').append(this.render());

    this.elem = document.querySelector('#player');

    this.reset();
  },

  reset: function(){
    this.pos[0] = this.startPos[0];
    this.pos[1] = this.startPos[1];
  },

  suspend: function(){
    this.elem.remove();
  },

  render: function(){
    return `<div id="player" style="width:${this.size[0]}px; height:${this.size[1]}px; left:${this.startPos[0]}px; top:${this.startPos[1]}px;"></div>`
  },

  input: function(){
    $(document).keydown((event) => {
      if(event.keyCode === 39){
        this.keys.right = true;
      }
      if(event.keyCode === 37){
        this.keys.left = true;
      }
      if(event.keyCode === 38){
        this.keys.up = true;
      }
      if(event.keyCode === 40){
        this.keys.down = true;
      }
    })

    $(document).keyup((event) => {
      if(event.keyCode === 39){
        this.keys.right = false;
      }
      if(event.keyCode === 37){
        this.keys.left = false;
      }
      if(event.keyCode === 38){
        this.keys.up = false;
      }
      if(event.keyCode === 40){
        this.keys.down = false;
      }
    })
  },

  boundaries: function(xP, yP){



    var bounds = [];

    var Xs = [
      xP,
      xP + this.size[0],
      xP + this.size[0]/2
    ];

    var Ys = [
      yP,
      yP + this.size[1],
      yP + this.size[1]/2
    ];

    for(var x=0; x<Xs.length; x++){
      for(var y=0; y<Ys.length; y++){
        bounds.push(this.game.squareAt([Xs[x], Ys[y]]));
      }
    }

    return bounds;
  },


  evaluateMotion: function(dt){
    var new_vX = this.vX;
    var new_vY = this.vY;

    if(this.keys.right){
      new_vX = this.speedMult;
    }
    if(this.keys.left){
      new_vX = -1 * this.speedMult;
    }

    if(!this.keys.right && !this.keys.left){
      new_vX = 0;
    }

  new_vY += (new_vY > 50) ? 0 : 3;

  if(!this.jumping && this.keys.up && this.vY === 0){
    this.jumping = true;
    new_vY = -70;
    this.grounded = false;
  }
  else if(this.vY > 0){
    this.jumping = false;
  }


    var newPos = [
      this.pos[0] + dt * new_vX *0.003,
      this.pos[1] + dt * new_vY *0.003
    ]

    return [
      new_vX,
      new_vY,
    ];
  },

  executeMotion: function(newVs){
    this.vX = newVs[0];
    this.vY = newVs[1];
  },


  collide_wall(side, Vs, sq){

    switch (side) {
      case 'top': {
        Vs[1] = (Vs[1] < 0) ? 0 : Vs[1];
        break;
      }
      case 'down': {
        Vs[1] = (Vs[1] > 0) ? 0 : Vs[1];
        this.grounded = true;
        break;
      }
      case 'left': {
        Vs[0] = (Vs[0] <= 0) ? 0 : Vs[0];
        break;
      }
      case 'right': {
        Vs[0] = (Vs[0] >= 0) ? 0 : Vs[0];
        break;
      }

    }

    return Vs;

  },

  collide_enemy: function(){
    if(!this.death){
      this.death = true;
      this.deathAnim();
    }
  },

  winGame: function(){
    this.game.win();
  },

  isWall: function(bounds){
    var collide = false;
    bounds.forEach((sq) => {

      var type = (!sq) ? 'wall' : squareTypes[sq.state];

      if(type === 'wall'){
        collide = true;
      }
      else if(type === 'enemy'){
        this.collide_enemy();
      }
    })
    return collide;
  },

  motionOutcome: function(side, bounds, newVs){

    var border = bounds[side];
    var Vs = newVs;

    border.forEach((sq) => {

      var type = (!sq) ? 'wall' : squareTypes[sq.state];

      if(type === 'wall'){
        Vs = this.collide_wall(side, Vs, sq);
      }
      else if(type === 'enemy'){
        this.collide_enemy();
      }
    })

    return Vs;

  },

  checkStar: function(){
    const starX = this.game.level.starPosition[0];
    const starY = this.game.level.starPosition[1];

    const starSize = this.game.level.sqSize;

    var distX = Math.abs((this.pos[0] + this.size[0]/2) - (starX + starSize/2));
    var distY = Math.abs((this.pos[1] + this.size[1]/2) - (starY + starSize/2));

    if(distX < (this.size[0]/2 + starSize/2) && distY < (this.size[1]/2 + starSize/2)){
      return true;
    }
    else{
      return false;
    }

  },

  checkEnemies: function(obj, newPos){
    if(obj.dead){
      return false;
    }

    var distX = Math.abs((this.pos[0] + this.size[0]/2) - (obj.xPos + obj.size/2));

    var distY = Math.abs((this.pos[1] + this.size[1]/2) - (obj.yPos + obj.size/2));

    if(distX < (this.size[0]/2 + obj.size/2) && distY < (this.size[1]/2 + obj.size/2)){
      return true;
    }
    else{
      return false;
    }

  },

  deathAnim: function(){
    var toggle = true;
    var intervalID = setInterval(() => {
      if (toggle) $('#player').addClass('damaged');
      else $('#player').removeClass('damaged') ;

      toggle = !toggle;

      if(this.deathCount++ > 6){
        clearInterval(intervalID);
        this.deathCount = 0;
        this.death = false;
        this.reset();
      }
    }, 100)

  },

  animate: function(dt){
    if(this.elem == null){
      this.elem = document.querySelector('#player');
    }

    var newVals = this.evaluateMotion(dt);

    this.grounded = false;

    var boundsX = this.boundaries(this.pos[0] + dt * newVals[0] *0.003, this.pos[1]);
    var boundsY = this.boundaries(this.pos[0], this.pos[1] + dt * newVals[1] *0.003)

    if(this.isWall(boundsX)){
      this.vX = 0;
    }
    else{
      this.vX = newVals[0];
    }

    if(this.isWall(boundsY)){
      this.vY = 0;
    }
    else{
      this.vY = newVals[1];
    }

    var st = this.checkStar();
    if(st) {
      this.winGame();
      return;
    }

    var enemyTouched = false;

    this.game.roamingObjs.forEach((obj) => {
      if(this.checkEnemies(obj, newVals)){
        enemyTouched = true;
      }
    })

    if(enemyTouched){
      this.collide_enemy();
    }


    this.pos[0] += dt * this.vX *0.003;
    this.pos[1] += dt * this.vY *0.003;

    this.elem.style.left = this.pos[0] + 'px';
    this.elem.style.top = this.pos[1] + 'px';

  },

  run: function(){
    this.input();
  }
}


export default Player;
