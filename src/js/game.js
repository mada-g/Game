import $ from 'jquery';

import Level from './level';
import Grid from './Grid';
import Player from './Player';
import Editor from './editor';
import Enemy from './enemy';

import {renderHeader} from './menu';
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

    $('.content').empty();

    if(level === null){
      this.level = new Level({row: 30, column: 200, arr: [], roamingObjs: []});
    }
    else{
      this.level = level;
    }

    if(this.player === null){
      this.player = new Player(this);
    }

    this.player.init(this.level.playerSpawn);

    $('.content').append(`<div class="play-area">${this.level.grid.render()}</div>`);
    //$('.content').append(level.grid.render());
    $('.viewport').removeClass('mode-editor');
    $('.viewport').addClass('mode-playing');
    $('.win-message').remove();
    $('.play-area').append(this.renderStar(this.level.starPosition));
    $('.subtitle-container').empty();
    $('.subtitle-container').append(renderHeader("playing", this.level.name, this.level.row, this.level.column));

    this.roamingObjs = [];

    this.level.roamingObjs.forEach((obj, id) => {
      this.roamingObjs.push(new Enemy(obj.type, obj.dir, obj.speed, obj.spawnX, obj.spawnY, `enemy-${id}`, this.level.grid));
    })

    this.activateRoamingObjs();
    this.level.grid.activateMorph();

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

  activateMorph: function(){
    console.log(this.level.sqMorph);

    for(let key in this.level.sqMorph){
      const obj = this.level.sqMorph[key];
      const sq = this.level.grid.read(obj.row, obj.column);
      sq.morphable = true;
      sq.delay = obj.delay;
      sq.cycle = obj.cycle;
      sq.morphState_0 = obj.state1;
      sq.morphState_1 = obj.state2;
      sq.init();
    }
  },

  renderStar: function(starPosition){
    console.log("star: " + starPosition);

    return `<div id="star" style="width:${this.level.sqSize}px; height:${this.level.sqSize}px; left:${starPosition[0]}px; top:${starPosition[1]}px;">
      <div class="clockwise"></div>
      <div class="anticlockwise"></div>
    </div>`
  },

  squareAt: function(pos){
    var x = pos[0];
    var y = pos[1];

    y = Math.floor(y/this.sqSize);
    x = Math.floor(x/this.sqSize);

    return this.level.grid.read(y,x);
  },

  animateStar: function(dt){

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

    const vWidth = $('.viewport').width();
    const vHeight = $('.viewport').height();

    let vPos = this.viewportPosition(actor.pos, scrollLeft, scrollTop);

    if(vPos[0] > (vWidth*0.7)){
      $('.viewport').scrollLeft(scrollLeft + vPos[0] - vWidth*0.7);
    }
    else if(vPos[0] < (vWidth*0.3)){
      $('.viewport').scrollLeft(scrollLeft - (vWidth*0.3 - vPos[0]));
    }

    if(vPos[1] > (vHeight*0.6)){
      $('.viewport').scrollTop(scrollTop + vPos[1] - vHeight*0.6);
    }
    else if(vPos[1] < (vHeight*0.4)){
      $('.viewport').scrollTop(scrollTop - (vHeight*0.4 - vPos[1]));
    }
  },

  renderWinMessage: function(){
    return `<div class="win-message">
      <div class="win-content">
        <div class="title">
        Level Completed!
        </div>
        <div class="btns">
        <div class="btn restart" data-btn="restart">restart</div>
        <div class="btn" data-btn="menu">main menu</div>
        </div>
      </div>
    </div>`
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

  win: function(){
    this.pause();
    $('.game').append(this.renderWinMessage());
    $('.btn').click((e) => {
      this.init(this.level);
    });
  },

  run: function(){
    this.player.run();
    this.play();
    $('.viewport').scrollTop(0);
  },

}

export default Game;
