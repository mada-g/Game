import $ from 'jquery';

import {renderHeader, renderLevelInit, renderStatusMessage, renderMenu, renderGameArea} from './menu';

import config from '../data/config.js';
import {level1, level2} from '../data/levels.js';

import Level from './level';
import PlatformerGame from './game';
import Editor from './editor';


var rows = 1;
var columns = 1;

var editing = false;

var pf = new PlatformerGame(50, 100, 20);
var editor = new Editor(null);

var L1 = new Level(level1);
var L2 = new Level(level2);

var levels = [level1, level2];

var resizeViewport = function(level){
  const docWidth = $(document).width()*0.9;
  const docHeight = $(window).height()*0.7;

  const viewWidth = (docWidth < (level.column * level.sqSize)) ? "90%" : `${level.column * level.sqSize}px`;
  const viewHeight = (docHeight < (level.row * level.sqSize)) ? "70vh" : `${level.row * level.sqSize}px`;

  $('.game').css({'width': viewWidth,
                  'height' : viewHeight});

}

var registerGameInput = function(level){
  $('.mode-button').click(() => {
    if(!editing){
      editor.init(pf.suspend());
      editing = true;
      //$('.mode-container').empty();
      //$('.mode-container').append(`<div class="mode-button">play level</div>`)
      $('.mode-button').text("play level");
    }
    else{
      //pf.init(editor.suspend());

      pf.init(editor.suspend());
      editing = false;
      //$('.mode-container').empty();
      //$('.mode-container').append(`<div class="mode-button">edit level</div>`)
      $('.mode-button').text("edit level");
    }
  })

  $(window).resize(() => {resizeViewport(level)});

}

var registerMenuInput = function(){
  $('.level-selection').click((e) => {
    editing = false;
    var levelNum = e.target.getAttribute('data-level-num');
    openGame(new Level(levels[levelNum]));
  })

  $('.create-level .btn').click((e) => {
    openLevelInit();

//    openGame(null);
  })


  $('.header .title').click(() => {
    window.location.href = `${config.server}/game`;
  })
}


function registerLevelInitInput(){
  rows = 20;
  columns = 120;
  name = "";

  $('.columns').val(columns);
  $('.rows').val(rows);

  $('.create-button').click((e) => {
    editing = true;
    openGame(new Level({
      row: rows,
      column: columns,
      roamingObjs: [],
      arr: [],
      name: name
    }))
  });

  $('.columns').bind('input propertychange', (e) => {
     var val = $(e.target).val();
     if(val === "") val = "1";
     val = parseFloat(val) || 1;
     val = val < 1 ? 1 : val;

     val = val > (4500/rows) ? Math.floor(4500/rows) : val;

     console.log(val);

     columns = val;
  });

  $('.rows').bind('input propertychange', (e) => {
     var val = $(e.target).val();
     if(val === "") val = "1";
     val = parseFloat(val) || 1;
     val = val < 1 ? 1 : val;
     val = val > (4500/columns) ? Math.floor(4500/columns) : val;
     console.log(val);

     rows = val;
  });

  $('.level-name').bind('input propertychange', (e) => {
     var val = $(e.target).val();
     console.log(val);

     name = val;
  });

  $('.columns').change((e) => {$(e.target).val(columns)});
  $('.rows').change((e) => {$(e.target).val(rows)});

};

function openLevelInit(){
  $('.main-area').empty();
  $('.main-area').append(renderLevelInit());
  $('.status').empty();

  registerLevelInitInput();

}



function openGame(level){
  $('.main-area').empty();
  $('.main-area').append(renderGameArea());

  $('.mode-container').empty();
  resizeViewport(level);

  if(!editing){
    pf.init(level);
    $('.mode-container').append(`<div class="mode-button">edit level</div>`)
  }
  else{
    editor.init(level);
    $('.mode-container').append(`<div class="mode-button">play level</div>`)
  }
  registerGameInput(level);
}

var openMenu = function(levels){
  $('.main-area').empty();
  $('.main-area').append(renderMenu(levels));
  $('.mode-container').empty();
  registerMenuInput();
  //pf.suspend();
  //editor.suspend();
}


$(document).ready(function(){

  let userLevels = window._userLevels;

  console.log(userLevels);

  openMenu(userLevels);
  //openGame(L2);


  //pf.init(null);
//  pf.run();

//  editor.init();


})
