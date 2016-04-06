import $ from "jquery";
import _ from 'underscore';

import {viewportScroll} from './camera';

function Square(row, column, size, grid){
  this.state = "empty";
  this.row = row;
  this.column = column;
  this.size = size;
  this.grid = grid;
  this.pos = [
    this.column * this.size,
    this.row * this.size
  ];
}

Square.prototype = {
  row: 0,
  column: 0,
  size: 20,
  prevState: 'empty',
  state: 'empty',
  editing: false,
  pos: [0,0],
  grid: null,
  morphable: false,
  intervalID: null,
  cycle: 500,
  morphState_0: 'green-wall',
  morphState_1: 'empty',
  morphIndex: 0,
  initDelayID: null,
  delay: 100,

  init: function(){
    if(this.morphable){
      this.update(this.morphState_0);
      if(this.intervalID) clearInterval(this.intervalID);
      if(this.initDelayID) clearTimeout(this.initDelayID);

      this.initDelayID = setTimeout(() => {
        this.morph();
      }, this.delay);
    }
  },

  render: function(){
    return `<div id="${this.row}-${this.column}" class="square ${this.state}" style="top:${this.row*this.size}px; left:${this.column*this.size}px; height:${this.size}px; width:${this.size}px"></div>`;
  },

  setState: function(state){
    this.state = state;
  },

  morph: function(){
    var toggle = true;
    this.intervalID = setInterval(() => {
    //  console.log(this.morphStates);
      if(toggle){
        this.update(this.morphState_1);
      }
      else{
        this.update(this.morphState_0);
      }
      toggle = !toggle;
    }, this.cycle);
  },

  update: function(newState){
    $(`#${this.row}-${this.column}`).removeClass(this.state);
    this.setState(newState);
    $(`#${this.row}-${this.column}`).addClass(this.state);
  },

  handleEnter: (t) => {
    t.prevState = t.state;

    if(t.grid.editMode === "morph"){
      t.update(t.grid.morphStates(0));
    }
    else if(t.grid.editMode === "player"){
      t.update('player-marker');
    }
    else if(t.grid.editMode === "star"){
      t.update('star-marker');
    }
    else if(t.grid.editMode === "enemy"){
      t.update(`enemy-marker ${t.grid.editEnemyType}`);
    }
    else if(t.grid.editMode === "block"){
      t.update(t.grid.editBlockType);
    }

  },

  handleExit: (t) => {
    if(!t.grid.mouseDown || t.grid.editMode === "morph" || t.grid.editMode === "enemy" || t.grid.editMode === "player" || t.grid.editMode === "star"){
      t.update(t.prevState);
    }
    else if(t.morphable && t.grid.editMode === "block"){
      t.morphable = false;
      t.grid.removeMorph(t.row, t.column);
      if(t.intervalID) clearInterval(t.intervalID);
      if(t.initDelayID) clearTimeout(t.initDelayID);
      t.grid.update(t.grid.editBlockType);
    }
  },

  handleClick: (t) => {
    if(t.grid.editMode === "enemy"){
      t.grid.addEnemy(t.row, t.column);
    }
    else if(t.grid.editMode === "player"){
      t.update(t.prevState);
      t.grid.placePlayer(t.row, t.column);
    }
    else if(t.grid.editMode === "star"){
      t.update(t.prevState);
      t.grid.placeStar(t.row, t.column);
    }
    else{
      t.prevState = t.state;
      if(t.grid.editMode === "morph"){
        console.log("NEW " + t.morphStates);
        t.grid.placeMorph(t.row, t.column);
        //t.morphState_0 = t.grid.morphStates(0);
        //t.morphState_1 = t.grid.morphStates(1);
        //t.delay = t.grid.editBlockDelay * 1000;
        //t.cycle = t.grid.editBlockCycle * 1000;
      //  t.morphable = true;
        //t.init();
      }
      else if(t.morphable && t.grid.editMode === 'block'){
        t.morphable = false;
        t.grid.removeMorph(t.row, t.column);
        if(t.intervalID) clearInterval(t.intervalID);
        if(t.initDelayID) clearTimeout(t.initDelayID);
        //t.update(t.grid.editBlockType);
      }
    }
  },

  run: function(){

    $(`#${this.row}-${this.column}`).hover(() => {if(this.editing){this.handleEnter(this)}}, () => {if(this.editing){this.handleExit(this)}});
    $(`#${this.row}-${this.column}`).click(() => {
      if(this.editing){this.handleClick(this)}
    });

  }

}

export default Square;
