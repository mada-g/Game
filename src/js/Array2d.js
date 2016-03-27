function Array2d(row, column){
  this.row = row;
  this.column = column;
  this.grid = this.initGrid();
}

Array2d.prototype = {
  row: 1,
  column: 1,
  initGrid: function(){
    var grid = [[]];

    for(var r=0; r<this.row; r++){
      for(var c=0; c<this.column; c++){
        grid[r].push(0);
      }
      grid.push([]);
    }
    return grid;
  },

  read: function(r, c){
    if(r<0 || r>this.row || c<0 || c>this.column){
      return null;
    }
    return this.grid[r][c];
  },

  write: function(r, c, val){
    if(r<0 || r>=this.row || c<0 || c>=this.column){
      return null;
    }
    else{
      this.grid[r][c] = val;
    }
  },

  forEach: function(fn){
    this.grid.forEach(function(element){
      element.forEach(fn)
    });
  },

  map: function(fn){
    return this.grid.map(function(element){
      return element.map(fn);
    });
  },

  print: function(){
    var line = '';
    for(var r=0; r<this.row; r++){
      for(var c=0; c<this.column; c++){
        line += this.read(r,c);
      }
      line += '\n';
    }

    console.log(line);
  }
}

export default Array2d;
