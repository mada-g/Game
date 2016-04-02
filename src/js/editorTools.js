import $ from 'jquery';

export function toolbox(){
  return `<div class="toolbox">
    <div class="toolbox-header">
      <div class="header-elem" data-header="block">
        add block
      </div>
      <div class="header-elem" data-header="enemy">
        add enemy
      </div>
    </div>

    <div class="toolbox-content group">

    </div>
  </div>`
}

var blockTypes = () => {
  var types = [
    'empty',
    'wall',
    'green-wall',
    'sky',
    'enemy',
    'snake',
    'brick',
    'sunset',
    'desert'
  ];

  var dom = "";

  types.forEach((type) => {
    dom += `<div class="block-type-container">
      <div class="block-type square ${type}" data-type="${type}"></div>
    </div>`
  })



  return dom;
}


var enemyType = () => {
  var types = [
    'fireball',
    'spike'
  ]

  var dom = "";

  types.forEach((type) => {
    dom += `<div class="enemy-type roaming ${type}" data-type="${type}"></div>`
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
    <div class="delay-selection">
      <div class="title">Delay</div>
      <input type="text" class="delay-input" />
    </div>

    <div class="cycle-selection">
      <div class="title">Cycle</div>
      <input type="text" class="cycle-input" />
    </div>

    <div class="morph-block-selection">
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

export function blockSelector(){
  return `<div class="block-params">
  <div class="behaviour-selection">
    <div class="behaviour" data-behaviour="static">Static</div>
    <div class="behaviour" data-behaviour="morphable">Morphable</div>
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
      <div class="dir selected" data-dir="vertical">vertical</div>
      <div class="dir" data-dir="horizontal">horizontal</div>
    </div>
    <div class="enemy-speed">
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
