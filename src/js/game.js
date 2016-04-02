import $ from 'jquery';

import Level from './level';
import Grid from './Grid';
import Player from './Player';
import Editor from './editor';
import Enemy from './enemy';

import {level1} from '../data/levels.js';

var Game = function(row, column, sqSize){
  this.row = row;
  this.column = column;
  this.sqSize = sqSize;
}

Game.prototype = {

  row: 1,
  column: 1,
  sqSize: 20,
  grid: [[]],
  level: null,
  scrollVal_left: 40,
  scrollVal_top: 0,
  mode: 'play',
  editor: false,
  editorObj: null,


  roamingObjs: [],

  player: null,

  init: function(level){

    if(level === null){
      this.level = new Level({row: 30, column: 200, arr: [], roamingObjs: []});
    }
    else{
      this.level = level;
    }

    if(this.player === null){
      this.player = new Player(this);
    }
    this.player.init();

    this.level.update(0,0, 'food');
    $('.content').append(`<div class="play-area">${this.level.grid.render()}</div>`);
    //$('.content').append(level.grid.render());
    $('.viewport').removeClass('mode-editor');
    $('.viewport').addClass('mode-playing');


    this.roamingObjs = [];

    this.level.roamingObjs.forEach((obj, id) => {
      this.roamingObjs.push(new Enemy(obj.type, obj.dir, obj.speed, obj.spawnX, obj.spawnY, `enemy-${id}`, this.level.grid));
    })


    this.activateRoamingObjs();

    this.run();

  },

  suspend: function(){
    this.pause();
    this.player.suspend();

    this.roamingObjs.forEach((obj)=>{obj.suspend()});

    $('.play-area').remove();

    return this.level;
  },

  activateRoamingObjs: function(){
    this.roamingObjs.forEach((obj) => {
      if(!obj.dead)
        obj.init();
    })
  },

  squareAt: function(pos){
    var x = pos[0];
    var y = pos[1];

    y = Math.floor(y/this.sqSize);
    x = Math.floor(x/this.sqSize);

    return this.level.grid.read(y,x);
  },

  buildAnimation: function(animator){
    var prevTime = null;

    var frame = (time) => {
      if(prevTime){
        const dt = Math.min(time - prevTime, 100);
        animator(dt);
      }
      prevTime = time;

      if(this.mode === 'play') requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  },


  viewportPosition: function(pos, scrollLeft, scrollTop){
    return [
      pos[0] - scrollLeft,
      pos[1] - scrollTop
    ];
  },

  viewportScroll: function(actor){
    let scrollLeft = $('.viewport').scrollLeft();
    let scrollTop = $('.viewport').scrollTop();

    let vPos = this.viewportPosition(actor.pos, scrollLeft, scrollTop);

    if(vPos[0] > 700){
      $('.viewport').scrollLeft(scrollLeft + vPos[0] - 700);
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

  play: function(){
    this.mode = 'play';
    this.buildAnimation((dt) => {
      //let actor = (this.editor ? this.editorObj : this.player);
      this.player.animate(dt);

      this.roamingObjs.forEach((obj) => {
        obj.animate(dt);
      })

      this.viewportScroll(this.player);
    })
  },

  pause: function(){
    this.mode = 'pause';
  },

  run: function(){
    this.player.run();
    this.play();
    $('.viewport').scrollTop(0);
  },

}

export default Game;
