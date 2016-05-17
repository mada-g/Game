import $ from 'jquery';
import fetch from 'isomorphic-fetch';

import config from '../data/config';

import {renderHeader, renderLevelInit, renderStatusMessage, renderMenu, renderGameArea} from './menu';
import Level from './level';
import Game from './game';

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
      $('.mode-button').text("play level");
    }
    else{
      editor.suspend();
      pf.init(new Level(editor.level.extract()));
      editing = false;
      $('.mode-button').text("edit level");
    }
  })

  $('.header .title').click(() => {
    window.location.href = `${config.server}/game`;
  })



  $(window).resize(() => {resizeViewport(level)});
}

let w = window;

$(document).ready(function(){


  let game = new Game(50, 100, 20);

  let levelData = window._levelData;

  levelData.roamingObjs = JSON.parse(levelData.roamingObjs);
  levelData.sqMorph = JSON.parse(levelData.sqMorph);
  levelData.arr = JSON.parse(levelData.arr);

  let level = new Level(levelData);


  $('.main-area').empty();
  $('.main-area').append(renderGameArea());

  resizeViewport(level);


  game.init(level);

  registerGameInput(level);

})
