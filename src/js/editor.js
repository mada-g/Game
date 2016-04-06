import $ from 'jquery';

import Level from './level.js';
import {playerSpawnText, starText, toolbox, blockSelector, enemySelector, publishLevel, morphableBlockParams, morphStates} from './editorTools.js';
import {renderHeader} from './menu';



var Editor = function(level){
  this.level = level;
}

Editor.prototype = {
  game: null,
  level: null,
  running: false,
  mouseDown: false,
  morphable: false,
  morphIndex: 0,

  pl: function(pos){
    return () => {
      playerSpawnText(pos);
    }
  },

  selector: {
    "block" : blockSelector,
    "enemy" : enemySelector,
    "player-spawn": playerSpawnText,
    "star-position": starText,
    "publish": publishLevel
  },

  init: function(level){

    if(level === null){
      this.level = new Level({row: 50, column: 100, arr: [], roamingObjs:[]});
    }
    else{
      this.level = level;
    }


    this.running = true;
    $('.content').append(`<div class="editor">${this.level.grid.render()}</div>`);

    $('.editor').append(this.level.grid.renderAllEnemyMarkers());

    this.level.grid.activateSquares();

    $('.viewport').removeClass('mode-playing');
    $('.viewport').addClass('mode-editor');

    $('.editor-tools').append(toolbox());

    $('.subtitle-container').empty();
    $('.subtitle-container').append(renderHeader("editor", this.level.name, this.level.row, this.level.column));

    this.level.grid.editMode = "block";
    this.openSelector('block');

    if(this.level.starPosition){
      $('.editor').append(
        this.level.grid.renderStarMarker(this.level.starPosition[0], this.level.starPosition[1])
      )
    }
    $('.editor').append(
      this.level.grid.renderPlayerMarker(this.level.playerSpawn[0], this.level.playerSpawn[1])
    )

    this.run();

  },

  suspend: function(){
    $('.editor').remove();
    $('.toolbox').remove();

    this.level.grid.suspendSquares();
    this.running = false;

    return this.level;
  },

  openSelector(type){
    $('.toolbox-content').empty();
    let arg = undefined;
    if(type === "player-spawn"){
      arg = this.level.playerSpawn;
    }
    else if(type === "star-position"){
      arg = this.level.starPosition;
    }

    $('.toolbox-content').append(this.selector[type](arg, this.level.sqSize));

    $('.header-elem').removeClass('selected');
    $(`.header-elem[data-header="${type}"]`).addClass('selected');
    this.registerInput();
    $(window).scrollTop($(document).height());

    if(type === "enemy"){
      this.level.grid.editEnemyDir = 'vertical';
      $(".enemy-speed .speed").removeClass('selected');
      $(".enemy-direction .dir").removeClass('selected');

      $(`.enemy-speed .speed[data-speed="${this.level.grid.editEnemySpeed}"]`).addClass('selected');
      $(`.enemy-direction .dir[data-dir="${this.level.grid.editEnemyDir}"]`).addClass('selected');
    }
    else if(type==="block"){
      $(".behaviour").removeClass('selected');
      $('.behaviour[data-behaviour="static"]').addClass('selected');

      this.updateBlockSelect();
    }
  },

  updateBlockSelect: function(){
    $('.block-type-container').removeClass('selected');
    if(!this.morphable)
      $(`.block-type[data-type="${this.level.grid.editBlockType}"]`).parent().addClass('selected');
    else
      $(`.block-type[data-type="${this.level.grid.editBlockMorphStates[this.morphIndex]}"]`).parent().addClass('selected');
  },

  squareAt: function(pos){
    var x = pos[0];
    var y = pos[1];

    y = Math.floor(y/this.sqSize);
    x = Math.floor(x/this.sqSize);

    return this.level.grid.read(y,x);
  },

  registerInput: function(){

    let editName = this.level.name;
    let editRow = this.level.row;
    let editColumn = this.level.column;

    $('.player-spawn').click((e) => {
      console.log('PLAYER');
      this.level.grid.editMode = "player";
    })

    $('.star-position').click((e) => {
      console.log('Star');
      this.level.grid.editMode = "star";
    })

  $('.block-type').click((e) => {

      if(!this.morphable){
        this.level.grid.editBlockType = e.target.getAttribute('data-type');
      }
      else{
        this.level.grid.editBlockMorphStates[this.morphIndex] = e.target.getAttribute('data-type');
        $('.morph-block-selection').empty();
        $('.morph-block-selection').append(this.morphStates());
      }

      $('.block-type-container').removeClass('selected');
      $(e.target).parent().addClass('selected');
    });


    $('.enemy-type').click((e) => {
      //if(!this.running) return;
      console.log(e.target.getAttribute('data-type'));
      this.level.grid.editMode = "enemy";
      this.level.grid.editEnemyType = e.target.getAttribute('data-type');
    });

    $('.dir').click((e) => {
      this.level.grid.editEnemyDir = e.target.getAttribute('data-dir');
      $('.dir').removeClass('selected');
      e.target.className += " selected";
    });

    $('.speed').click((e) => {
      console.log(e.target.getAttribute('data-speed'));
      this.level.grid.editEnemySpeed = parseInt(e.target.getAttribute('data-speed'));
      $('.speed').removeClass('selected');
      e.target.className += " selected";
    });

    $('.behaviour').click((e) => {
      $(window).scrollTop($(document).height());
      var behaviour = e.target.getAttribute('data-behaviour');
      $('.params-detail').empty();
      $('.behaviour').removeClass('selected');
      if(behaviour === 'morphable'){
        this.morphable = true;
        this.level.grid.editMode = "morph";
        this.morphParams();
        $('.morph-block-selection').append(this.morphStates());
      }
      else{
        this.morphable = false;
        this.level.grid.editMode = "block";
      }

      $(e.target).addClass('selected');

      this.updateBlockSelect()
    });

    $('.publish-text .btn').click((e) => {
      let publish = JSON.stringify(this.level.extract());

        $.ajax({
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          url: 'http://localhost:3000/levelpublish',
          data: publish,
          success: function(res){
            console.log('AJAX RESPONSE: ');
            console.log(res);
          }
        });
    });

  },


  morphParams: function(){
    $('.params-detail').append(morphableBlockParams());

    this.morphIndex = 0;

    $('.delay').click((e) => {
      var delay = e.target.getAttribute('data-delay');
      this.level.grid.editBlockDelay = parseFloat(delay);
    });

    $('.cycle').click((e) => {
      var cycle = e.target.getAttribute('data-cycle');
      this.level.grid.editBlockCycle = parseInt(cycle);
    });

/*    $('.delay-input').change((e) => {
      console.log($(e.target).val());
    });
*/
    $('.delay-input').bind('input propertychange', (e) => {
       var val = $(e.target).val();
       if(val === "") val = "0";
       val = parseFloat(val) || 0;
       val = val < 0 ? val = 0 : val;
       val = val > 20 ? val = 20 : val;
       console.log(val);
       this.level.grid.editBlockDelay = val;
    });

    $('.delay-input').change((e) => {$(e.target).val(this.level.grid.editBlockDelay)});

    $('.cycle-input').bind('input propertychange', (e) => {
       var val = $(e.target).val();
       if(val === "") val = "0.5";
       val = parseFloat(val) || 0.5;
       val = val < 0 ? val = 0 : val;
       val = val > 20 ? val = 20 : val;
       console.log(val);
       this.level.grid.editBlockCycle = val;
    });
    $('.cycle-input').change((e) => {$(e.target).val(this.level.grid.editBlockCycle)});

  },

  morphStates: function(){
    $('.morph-block-selection').append(morphStates(this.level.grid.editBlockMorphStates));

    $('.morph-state-container').removeClass('selected');
    $(`.morph-state[data-morph="${this.morphIndex}"]`).parent().addClass('selected');

    $('.morph-state').click((e) => {
      this.morphIndex = e.target.getAttribute('data-morph');
      $('.morph-state-container').removeClass('selected');
      $(e.target).parent().addClass('selected');
      this.updateBlockSelect();
      console.log(this.morphIndex);
    });

  },

  run: function(){
    $(document).mousedown((e) => {
      if(!this.running) return;
//      e.preventDefault();
      this.level.grid.mouseDown = true;
    })

    $(document).mouseup(() => {
      if(!this.running) return;
      this.level.grid.mouseDown = false;
    })


    $('.header-elem').click((e) => {
      var type = e.target.getAttribute('data-header');
      this.openSelector(type);

      if(type === "enemy"){
        this.level.grid.editMode = "enemy";
      }
      else{
        this.morphable = false;
        this.level.grid.editMode = "block";
      }

    });

    this.registerInput();

  }


}


export default Editor;
