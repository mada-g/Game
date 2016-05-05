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
  animID: null,
  animCount: 0,
  cycle : 500,
  timer: 0,
  toggle: true,
  currentTimeout: 500,
  cycle_0: 500,
  cycle_1: 500,
  morphState_0: 'green-wall',
  morphState_1: 'empty',
  morphIndex: 0,
  initDelayID: null,
  delay: 10,

  init: function(){
    if(this.morphable){
      this.update(this.morphState_0);
      //if(this.intervalID) clearInterval(this.intervalID);
      if(this.initDelayID) clearTimeout(this.initDelayID);
      if(this.animID) cancelAnimationFrame(this.animID);

      console.log("delay: " + this.delay);

      this.initDelayID = setTimeout(() => {
        this.morph();
        this.animMorph();
      }, this.delay);
    }
  },

  render: function(){
    return `<div id="${this.row}-${this.column}" class="square ${this.state}" style="top:${this.row*this.size}px; left:${this.column*this.size}px; height:${this.size}px; width:${this.size}px"></div>`;
  },

  setState: function(state){
    this.prevState = this.state;
    this.state = state;
  },


  buildAnimation: function(animator){
    var prevTime = null;

    var frame = (time) => {
      if(prevTime){
        let dt = time - prevTime;
        dt = (dt < 100) ? dt : 0;
        animator(dt);
      }
      prevTime = time;

      if(this.morphable) this.animID = requestAnimationFrame(frame);
    }

    return requestAnimationFrame(frame);
  },

  morphAnimator: function(dt){

  },

  animMorph: function(){
    //this.animCount++;
    let timer = 0;
    let toggle = true;
    let currentTimeout = this.cycle_0;

    this.animID = this.buildAnimation((dt) => {
      if(!this.morphable) return;
//      timer += dt;
      let delta = Math.floor(dt/10) * 10;
      timer += delta;
      //timer = Math.floor(timer/100) * 100;
      //timer = timer - (timer % 100);
      if(timer >= currentTimeout){
        timer = 0;
        if(toggle){
          currentTimeout = this.cycle_1;
          this.update(this.morphState_1);
        } else{
          currentTimeout = this.cycle_0;
          this.update(this.morphState_0);
        }


        toggle = !toggle;
      }
    });
  },

  morph: function(){
    this.toggle = true;
    /*var toggle = true;
    let lifetime = this.cycle_0;
    let morphState = this.morphState_0;

    let morphFuncAlt = () => {
      clearInterval(this.intervalID);
      if(toggle){
        lifetime = this.cycle_1;
        morphState = this.morphState_1;
      } else{
        lifetime = this.cycle_0;
        morphState = this.morphState_0;
      }
      this.update(morphState);

      toggle = !toggle;

      this.intervalID = setInterval(morphFuncAlt, lifetime);

    }

      this.intervalID = setInterval(morphFuncAlt, lifetime);
*/
    /*this.intervalID = setInterval(() => {
    //  console.log(this.morphStates);
      if(toggle){
        this.update(this.morphState_1);
      }
      else{
        this.update(this.morphState_0);
      }
      toggle = !toggle;
    }, this.cycle);
    */

  },

  suspendMorph: function(){
    this.morphable = false;
    //if(this.intervalID) clearInterval(this.intervalID);
    if(this.initDelayID) clearTimeout(this.initDelayID);
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
