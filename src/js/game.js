import $ from 'jquery';

import Grid from './Grid';
import Player from './Player';

var styles = [
  'empty',
  'snake',
  'collision',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six'

];

var Game = function(row, column, sqSize){
  this.row = row;
  this.column = column;
  this.sqSize = sqSize;
  this.grid = new Grid(row, column, sqSize);
}

Game.prototype = {

  row: 1,
  column: 1,
  sqSize: 10,
  grid: [[]],
  scrollVal_left: 40,
  scrollVal_top: 0,

  player: null,

  init: function(){

    for(var i = 0; i<50; i++){
      this.grid.read(3,i).update('food');
      this.grid.read(i, 50).update('wall');
      this.grid.read(15, i).update('wall');
    }

    $('.content').append(this.grid.render());

    this.player = new Player(this);
  },

  squareAt: function(pos){
    var x = pos[0];
    var y = pos[1];

    y = Math.floor(y/this.sqSize);
    x = Math.floor(x/this.sqSize);

    return this.grid.read(y,x);
  },

  buildAnimation: function(animator){
    var prevTime = null;

    var frame = (time) => {
      if(prevTime){
        const dt = Math.min(time - prevTime, 100);
        animator(dt);
      }
      prevTime = time;

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  },


  viewportPosition: function(pos, scrollLeft, scrollTop){
    return [
      pos[0] - scrollLeft,
      pos[1] - scrollTop
    ];
  },

  viewportScroll: function(){
    let scrollLeft = $('.viewport').scrollLeft();
    let scrollTop = $('.viewport').scrollTop();

    let vPos = this.viewportPosition(this.player.pos, scrollLeft, scrollTop);

    //console.log(this.player.pos[0]);
    //console.log(vPos[0]);
    //console.log($('.viewport').scrollLeft());

    if(vPos[0] > 400){
      $('.viewport').scrollLeft(scrollLeft + vPos[0] - 400);
    }
    else if(vPos[0] < 200){
      $('.viewport').scrollLeft(scrollLeft - (200 - vPos[0]));
    }

    if(vPos[1] > 250){
      $('.viewport').scrollTop(scrollTop + vPos[1] - 250);
    }
    else if(vPos[1] < 200){
      $('.viewport').scrollTop(scrollTop - (200 - vPos[1]));
    }
  },

  run: function(){

    /*var intervalID = setInterval(() => {
      this.scrollVal += 10;
      $('.viewport').scrollLeft(this.scrollVal);
    }, 100)*/

    this.player.run();

    this.buildAnimation((dt) => {
      this.player.animate(dt);
      this.viewportScroll();
      //console.log(dt);
    })


    $('.viewport').scrollTop(0);
    $('.viewport').scrollLeft(40);


//    this.squareAt([9.43, 100]);

  },

}

export default Game;
