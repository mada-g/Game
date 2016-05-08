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
  cycle : 500,
  toggle: true,
  morphCount: 0,
  cycle_0: 500,
  cycle_1: 500,
  morphState_0: 'green-wall',
  morphState_1: 'empty',
  morphIndex: 0,
  delay: 10,

  init: function(){
    if(this.morphable){
      this.update(this.morphState_0);
      this.morph();
    }
  },

  render: function(){
    return `<div id="${this.row}-${this.column}" class="square ${this.state}" style="top:${this.row*this.size}px; left:${this.column*this.size}px; height:${this.size}px; width:${this.size}px"></div>`;
  },

  setState: function(state){
    this.prevState = this.state;
    this.state = state;
  },


  animate: function(dt, timer){
    if(!this.morphable) return;

    let t = this.toggle ? this.cycle_1 : 0;
    let timeProgress = (timer - this.delay) + t;

    if(timeProgress < 0) return;

    let count = timeProgress % (this.cycle_0 + this.cycle_1);

    if(count < this.morphCount){
      if(this.toggle) this.update(this.morphState_1);
      else this.update(this.morphState_0);

      this.toggle = !this.toggle;
    }

    this.morphCount = count;
  },


  morph: function(){
    this.toggle = false;
    this.morphCount = this.cycle_1;
  },

  suspendMorph: function(){
    this.morphable = false;
  },

  update: function(newState){
    $(`#${this.row}-${this.column}`).removeClass(this.state);
    this.setState(newState);
    $(`#${this.row}-${this.column}`).addClass(this.state);
  },

  handleEnter: (t) => {
    t.grid.markSquare(t.row, t.column);
  },

  handleExit: (t) => {
      t.grid.unmarkSquare(t.row, t.column);

      if(t.grid.mouseDown && t.grid.editMode === "block"){
        t.grid.modSquare(t.row, t.column);
      }
  },

  handleClick: (t) => {
    t.grid.modSquare(t.row, t.column);
  },

  run: function(){

    $(`#${this.row}-${this.column}`).hover(() => {if(this.editing){this.handleEnter(this)}}, () => {if(this.editing){this.handleExit(this)}});
    $(`#${this.row}-${this.column}`).click(() => {
      if(this.editing){this.handleClick(this)}
    });

  }

}

export default Square;
