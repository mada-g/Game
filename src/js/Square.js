import $ from "jquery";

function Square(row, column, size){
  this.state = "empty";
  this.row = row;
  this.column = column;
  this.size = size;
  this.pos = [
    this.column * this.size,
    this.row * this.size
  ];
}

Square.prototype = {
  row: 0,
  column: 0,
  size: 10,
  state: 'empty',
  pos: [0,0],
  
  render: function(){
    return `<div id="${this.row}-${this.column}" class="square ${this.state}" style="top:${this.row*this.size}px; left:${this.column*this.size}px; height:${this.size}px; width:${this.size}px"></div>`;
  },

  setState: function(state){
    this.state = state;
  },

  update: function(newState){
    $(`#${this.row}-${this.column}`).removeClass(this.state);
    this.setState(newState);
    $(`#${this.row}-${this.column}`).addClass(this.state);
  }

}

export default Square;
