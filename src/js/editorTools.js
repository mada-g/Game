import $ from 'jquery';

import config from '../data/config.js';
import squareTypes from '../data/squareTypes';



export function toolbox(){
  return `<div class="toolbox">
    <div class="toolbox-header">
      <div class="header-elem" data-header="block">
        add block
      </div>
      <div class="header-elem" data-header="enemy">
        place enemy
      </div>
      <div class="header-elem player-spawn" data-header="player-spawn">
        set player spawn location
      </div>
      <div class="header-elem star-position" data-header="star-position">
        place star
      </div>
      <div class="header-elem publish" data-header="publish">
        publish level
      </div>
    </div>

    <div class="toolbox-content group">

    </div>
  </div>`
}

var blockTypes = () => {

  var blocks = {
    'empty': [],
    'wall': [],
    'enemy': []
  }

  var renderBlocksinGroup = function(group){
    var d = "";

    group.forEach((type) => {
      d += `<div class="block-type-container">
        <div class="block-type square ${type}" data-type="${type}"></div>
      </div>`
    })

    return d;
  }

  for(var type in squareTypes){
    if(blocks[squareTypes[type]])
      blocks[squareTypes[type]].push(type);
  }

  var dom = "";

  for(var group in blocks){
    let gr = group;
    if(group === "enemy"){
        gr = 'enemy/damaging blocks';
    }
    else if(group === "wall"){
      gr = 'wall/obstacle';
    }
    else if(group === "empty"){
      gr = 'empty space';
    }

    dom += `<div class="block-type-group">
      <div class="title">${gr}</div>
      ${renderBlocksinGroup(blocks[group])}
    </div>`
  }

  return dom;
}


var enemyType = () => {
  var types = [
    'fireball',
    'moving-lava',
    'spike',
    'laser',
    'plasma',
    'flubber'
  ]

  var dom = "";

  types.forEach((type) => {
    dom += `<div class="enemy-type-container">
      <div class="enemy-type roaming ${type}" data-type="${type}"></div>
    </div>`
  })

  return dom;
}

export function morphableBlockParams(){
  return `<div class="morphable-params">
    <div class="delay-selection param">
      <div class="title">starting delay (seconds)</div>
      <input type="text" class="delay-input" />
    </div>

    <div class="cycle-selection param">
      <div class="title">state 1 lifetime (seconds)</div>
      <input type="text" class="cycle-input" data-cycle="first"/>
    </div>

    <div class="cycle-selection param">
      <div class="title">state 2 lifetime (seconds)</div>
      <input type="text" class="cycle-input" data-cycle="second"/>
    </div>

    <div class="morph-block-selection param">
    </div>

  </div>`
}

export function morphStates(states){
  return `<div class="title">alternating states</div>
    <div class="morph-state-box">
      <div class="morph-state-container">
        <div class="morph-state square ${states[0]}" data-morph="0"></div>
      </div>
      <div class="morph-state-sub">state 1</div>
    </div>

    <div class="morph-state-box">
      <div class="morph-state-container">
        <div class="morph-state square ${states[1]}" data-morph="1"></div>
      </div>
      <div class="morph-state-sub">state 2</div>
    </div>`
}


export function renderBrushParams(){
  return `<div class="brush-params">
    <div class="title">
      brush size
    </div>
    <br/>

    <div class="brush-dimen">
      <span>width </span>
      <input type="text" class="brush-dimen-input" data-dimen="width" />
    </div>
    <div class="brush-dimen">
      <span>height </span>
      <input type="text" class="brush-dimen-input" data-dimen="height" />
    </div>
  </div>`
};



export function playerSpawnText(pos, sqSize){
  return `<div class="info-txt player-spawn-text">
    <div>Player spawns at column: ${Math.floor(pos[0]/sqSize)}, row: ${Math.floor(pos[1]/sqSize)}</div>
    <br/>
    You can change the player's starting position by clicking in the editor where you want the player to spawn.
  </div>`
};

export function starText(pos, sqSize){
  let txt = function(pos){
    if(!pos){
      return `<div>The star's location has not yet been set</div>`
    }
    else{
      return `<div>The star is at column: ${Math.floor(pos[0]/sqSize)}, row: ${Math.floor(pos[1]/sqSize)}</div>`
    }
  }

  return `<div class="info-txt star-text">
    A level is completed when the player reaches the <span>star</span>.
    <br/>
    ${txt(pos)}
    <br/>
    You can set/change the star's location by clicking in the editor where you want the star to appear.
  </div>`
};

export function blockSelector(){
  return `<div class="block-params">
  <div class="behaviour-selection">
    <div class="behaviour" data-behaviour="static">Static</div>
    <div class="behaviour" data-behaviour="morphable">Alternating</div>
  </div>

  <div class="test">
  </div>

  <div class="params-detail">
  </div>
  </div>

  <div class='block-selector'>
      ${blockTypes()}
  </div>`
}

export function enemySelector(){
  return `<div class="enemy-params">
    <div class="enemy-direction">
      <div class="title">movement</div>
      <div class="dir" data-dir="vertical">vertical</div>
      <div class="dir" data-dir="horizontal">horizontal</div>
    </div>
    <div class="enemy-speed">
      <div class="title">speed</div>
      <div class="speed" data-speed="0">very slow</div>
      <div class="speed" data-speed="1">slow</div>
      <div class="speed" data-speed="2">normal</div>
      <div class="speed" data-speed="3">fast</div>
      <div class="speed" data-speed="4">very fast</div>
    </div>
    <div class="enemy-eraser">
      <div class="title">eraser</div>
      <div class="eraser">X</div>
      <div class="txt"></div>
    </div>
  </div>
  <div class='enemy-selector'>
      ${enemyType()}
  </div>`
}


export function levelSettings(){
  return `<div class="level-settings">
    <div class="param">
      <span>level name: </span>
      <input type="text" class="level-setting-name"/>
      <span class="btn" data-setting="name">ok</span>
    </div>

    <br/>

    <div class="param">
      <span>columns: </span>
      <input type="text" class="level-setting-col"/>
    </div>
    <div class="param">
      <span>rows: </span>
      <input type="text" class="level-setting-row"/>
    </div>
    <div class="param btn size" data-setting="size">
      ok
    </div>

  </div>`
}

export function publishLevel(){
  return `<div class="info-txt publish-text">
    <div>Are you sure you want to publish this level?</div>
    <br/>
    <div class="btn">Yes!</div>
  </div>`
}

export function renderPublishFailed(){
  return `<div>
    Uploading failed!
  </div>`
}

export function renderPublishSuccess(id){
  return `<div>
    Level successfully saved & published.
  </div>
  <br/>
  <div>You can find your custom level at</div>
  <div class="publish-link"><a href="${config.levelBase}/game/level/${id}">madalin.ski/game/level/<span>${id}</span></a></div>`
}
