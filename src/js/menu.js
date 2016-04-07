import showcase from '../data/showcaseLevels.js';
import config from '../data/config';

export function renderShowcaseLevels(){
  let dom = '';
  showcase.forEach((show) => {
    dom += `<a href="${config.server}/level/${show.levelID}"><div class="show-level">
      <div>${show.name}</div>
    </div></a>`
  })

  return `<div class="showcase">
    ${dom}
  </div>`
}


var renderLevelSelection = function(levels){
  var dom = "";

  levels.forEach((level, id) => {
    dom += `<div class="level-selection" data-level-num="${id}">
      level ${id+1}
    </div>`
  })

  return dom;
}

export function renderStatusMessage(message, status){
  return `<div class="message ${status}">
    ${message}
  </div>`
}


export function renderHeader(mode, name, r, c){
  return `<div class="subtitle">
    <span class="mode-name">${mode}</span>  /  <span class="level-name">${name}</span>  /  <span class="size">${c}x${r}</span>
  </div>`
};

export function renderLevelInit(){
return `<div class="level-init">
  <div class="param">
    <div class="title">level name: </div>
    <input type="text" class="level-name"/>
  </div>
  <br/>
  <div class="param head">
    <div class="title">size <span>(max. 4500 blocks)</span> </div>
  </div>
  <div class="param">
    <div class="title">columns <span>(blocks)</span>: </div>
    <input type="text" class='columns'/>
  </div>
  <div class="param">
    <div class="title">rows <span>(blocks)</span>: </div>
    <input type="text" class='rows'/>
  </div>

  <br/>

  <div class="param">
    <div class="status"></div>
  </div>

  <div class="create-button">
    create level
  </div>
</div>`
}

export function renderMenu(levels){
  return `<div class="menu">
    <div class="create-level">
      <div class="btn">
        Create Level!
      </div>
    </div>

    <div class="highlight">${renderShowcaseLevels()}</div>
    <div class="all-list"></div>
  </div>`
}

export function renderGameArea(){
  return `
  <div class="game">
    <div class="viewport">
      <div class="content"></div>
    </div>
  </div>`
}
