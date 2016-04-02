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

  init: function(){
    //$('#player').remove();
    $('.content').append(this.render());

    this.elem = document.querySelector('#player');
  },

  reset: function(){
    this.pos = [5,0];
  },

  suspend: function(){
    this.elem.remove();
  },

  render: function(){
    return `<div id="player" style="width:${this.size[0]}px; height:${this.size[1]}px; left:40px; top:10px;"></div>`
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

  boundaries: function(newVals){

    var nPos = newVals[2];
    var step = this.game.sqSize;

    var bounds = {
      top: [],
      down: [],
      left: [],
      right:[]
    };

  //  var bounds = [];

    var vertices = [
      [
        nPos[0] - 4,
        nPos[0] + this.size[0] + 4
      ],
      [
        nPos[1] - 4,
        nPos[1] + this.size[1] + 4
      ]
    ];

    /*var xO = nPos[0];
    var xEnd = nPos[0] + this.size[0];
    var yO = nPos[1];
    var yEnd = nPos[1] + this.size[1];
*/
    /*for(var x = xO; x<xEnd; x++){
      for(var y = yO; y<yEnd; y++){
        bounds.push(this.game.squareAt([x, fixed]));
      }
    }*/

    for(var i=0; i<2; i++){
      var origin = nPos[0];
      var end = nPos[0] + this.size[0];
      var fixed = vertices[1][i];

      for(var x=origin; x<=end; x += step){
        bounds[this.borders[i]].push(this.game.squareAt([x, fixed]));
      }
    }

    for(var i=0; i<2; i++){
      var origin = nPos[1];
      var end = nPos[1] + this.size[1];
      var fixed = vertices[0][i];

      for(var y=origin; y<=end; y += step){
        bounds[this.borders[2+i]].push(this.game.squareAt([fixed, y]));
      }
    }

    return bounds;

  },

  evaluateMotion: function(dt){
  //  var newX = (Math.abs(this.vX) < 1 |) ? 0 : (this.vX/2);
  //  var newY = (Math.abs(this.vY) < 1 |) ? 0 : (this.vY/2);

    var new_vX = this.vX;
    var new_vY = this.vY;

    if(this.keys.right){
      //new_vX = (new_vX > 50) ? 50 : (new_vX + 2)
      new_vX = this.speedMult;
    }
    if(this.keys.left){
      //new_vX = (new_vX < -50) ? -50 : (new_vX - 2)
      new_vX = -1 * this.speedMult;
    }

    if(!this.keys.right && !this.keys.left){
//      new_vX = (Math.abs(new_vX) < 1) ? 0 : (new_vX/1.5);
      new_vX = 0;
    }

  new_vY += (new_vY > 50) ? 0 : 3;

  //new_vY = 0;

  if(this.keys.up && this.grounded){
    this.jumping = true;
    new_vY = -70;
    this.grounded = false;
  }

    var newPos = [
      this.pos[0] + dt * new_vX *0.003,
      this.pos[1] + dt * new_vY *0.003
    ]

    return [
      new_vX,
      new_vY,
      newPos
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
  //  Vs[0] = Vs[0] * 0.5;
  //  Vs[1] = Vs[1] * 0.5;

    if(!this.death){
      this.death = true;
      this.deathAnim();
    }

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

  checkEnemies: function(obj, newPos){
    //var xAligned = false;

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

    /*if(obj.pos[0] >= newPos[0] && obj.pos[0] <= (newPos[0] + this.size[0])
      || (obj.pos[0] + obj.size) >= newPos[0] &&  (obj.pos[0] + obj.size) <= (newPos[0] + this.size[0])
       || this.size[0] < obj.size obj.pos[1] && newPos[0] > obj.pos[0] && newPos[0] < (obj.pos[0] + obj.size))
    */

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

    var bounds = this.boundaries(newVals);

    this.borders.forEach((b) => {
      newVals = this.motionOutcome(b, bounds, newVals);
    });


    var enemyTouched = false;

    this.game.roamingObjs.forEach((obj) => {
      if(this.checkEnemies(obj, newVals)){
        enemyTouched = true;
      }
    })

    if(enemyTouched){
      this.collide_enemy();
    }

    this.executeMotion(newVals);



    this.pos[0] += dt * this.vX *0.003;
    this.pos[1] += dt * this.vY *0.003;

    this.elem.style.left = this.pos[0] + 'px';
    this.elem.style.top = this.pos[1] + 'px';


//    console.log(this.vY);

  },

  run: function(){
    this.input();
  }
}


export default Player;
