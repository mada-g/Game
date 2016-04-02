import $ from 'jquery';

import {renderMenu, renderGameArea} from './menu';

import {level1, level2} from '../data/levels.js';

import Level from './level';
import PlatformerGame from './game';
import Editor from './editor';

var editing = false;

var pf = new PlatformerGame(50, 100, 20);
var editor = new Editor(null);

var L1 = new Level(level1);
var L2 = new Level(level2);

var levels = [level1, level2];

var registerGameInput = function(){
  $('.mode').click(() => {
    if(!editing){
      editor.init(pf.suspend());
      editing = true;
    }
    else{
      pf.init(editor.suspend());
      editing = false;
    }
  })
}

var registerMenuInput = function(){
  $('.level-selection').click((e) => {
    editing = false;
    var levelNum = e.target.getAttribute('data-level-num');
    openGame(new Level(levels[levelNum]));
  })

  $('.create-level .btn').click((e) => {
    editing = true;
    openGame(null);
  })
}

function openGame(level){
  $('.main-area').empty();
  $('.main-area').append(renderGameArea());

  if(!editing){
    pf.init(level);
  }
  else{
    editor.init(level);
  }
  registerGameInput();
}

var openMenu = function(levels){
  $('.main-area').empty();
  $('.main-area').append(renderMenu(levels));
  registerMenuInput();
  //pf.suspend();
  //editor.suspend();
}


$(document).ready(function(){


  openMenu(levels);
  //openGame(L2);


  //pf.init(null);
//  pf.run();

//  editor.init();


})
