import $ from "jquery";

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
  size: 10,
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

    if(!t.grid.editEnemy){
      if(t.grid.editBlockMorphable){
        t.update(t.grid.morphStates(0));
      }
      else{
        t.update(t.grid.editBlockType);
      }
    }
    else{
      t.update(`enemy-marker ${t.grid.editEnemyType}`);
    }
  },

  handleExit: (t) => {
    if(!t.grid.mouseDown || t.grid.editBlockMorphable || t.grid.editEnemy) t.update(t.prevState);
  },

  handleClick: (t) => {
    if(t.grid.editEnemy){
      t.grid.addEnemy(t.row, t.column);
    }
    else{
      t.prevState = t.state;
      if(t.grid.editBlockMorphable){
        console.log("NEW " + t.morphStates);
        t.morphState_0 = t.grid.morphStates(0);
        t.morphState_1 = t.grid.morphStates(1);
        t.delay = t.grid.editBlockDelay * 1000;
        t.cycle = t.grid.editBlockCycle * 1000;
        t.morphable = true;
        t.init();
      }
      else{
        t.morphable = false;
        if(t.intervalID) clearInterval(t.intervalID);
        if(t.initDelayID) clearTimeout(t.initDelayID);
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
