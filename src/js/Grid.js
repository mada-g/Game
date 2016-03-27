import $ from 'jquery';

import Array2d from './Array2d';
import Square from './Square';

function Grid(height, width, size){
  this.height = height;
  this.width = width;

  this.size = size;

  this.array = new Array2d(height, width);
  this.populate();
}

Grid.prototype = {
  array : [[]],

  populate: function(){
    for(var r=0; r<this.height; r++)
      for(var c=0; c<this.width; c++){
        this.array.write(r,c, new Square(r,c, this.size));
      }
  },

  read: function(r, c){
    return this.array.read(r,c);
  },

  write: function(r, c, val){
    this.array.write(r,c, val);
  },

  print: function(){
    this.array.print();
  },

  forEach: function(fn){
    this.array.forEach(fn);
  },

  clear: function(){
    this.array.forEach((elem) => {
      elem.setState('empty');
    });
    return this.render();
  },

  render: function(){
    var html = "";
    this.forEach((square) => {
      html += square.render();
    })
    return html;
  },

  update: function(coord, state){
    var r = coord[0];
    var c = coord[1];

    this.read(coord[0], coord[1]).setState(state);

    //console.log(this.read(coord[0], coord[1]).state);

    $(`#${r}-${c}`).remove();
    $('.content').append(this.read(r,c).render());

    if(state ==='food'){
      console.log(this.read(r,c).state)

    }

  },

}

export default Grid;
