import $ from 'jquery';

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
    dom += `<div class="block-type-group">
      <div class="title">${group}</div>
      ${renderBlocksinGroup(blocks[group])}
    </div>`
  }

  return dom;
}


var enemyType = () => {
  var types = [
    'fireball',
    'spike'
  ]

  var dom = "";

  types.forEach((type) => {
    dom += `<div class="enemy-type-container">
      <div class="enemy-type roaming ${type}" data-type="${type}"></div>
    </div>`
  })

  return dom;
}


/*
<div class="params-elem delay" data-delay="0.5">0.5s</div>
<div class="params-elem delay" data-delay="1">1s</div>
<div class="params-elem delay" data-delay="2">2s</div>
<div class="params-elem delay" data-delay="3">3s</div>
<div class="params-elem delay" data-delay="4">4s</div>

<div class="params-elem cycle" data-cycle="1">1s</div>
<div class="params-elem cycle" data-cycle="2">2s</div>
<div class="params-elem cycle" data-cycle="3">3s</div>
<div class="params-elem cycle" data-cycle="4">4s</div>

*/
export function morphableBlockParams(){
  return `<div class="morphable-params">
    <div class="delay-selection param">
      <div class="title">Delay</div>
      <input type="text" class="delay-input" />
    </div>

    <div class="cycle-selection param">
      <div class="title">Cycle</div>
      <input type="text" class="cycle-input" />
    </div>

    <div class="morph-block-selection param">
    </div>

  </div>`
}

export function morphStates(states){
  return `<div class="title">States</div>
    <div class="morph-state-container">
      <div class="morph-state square ${states[0]}" data-morph="0"></div>
    </div>
    <div class="morph-state-container">
      <div class="morph-state square ${states[1]}" data-morph="1"></div>
    </div>`
}

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
    <div class="behaviour" data-behaviour="morphable">Morphable</div>
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
    <div class="btn">OK</div>
  </div>`
}
