import showcase from '../data/showcaseLevels.js';
import config from '../data/config';

export function renderShowcaseLevels(){
  let dom = '';
  showcase.forEach((show) => {
    dom += `<div class="show-level"><a href="${config.server}/level/${show.levelID}">
      <div>${show.name}</div>
    </a></div>`
  })

  return `<div class="showcase">
    ${dom}
  </div>`
}


export function renderUserLevels(levels){
  let dom = '';

  levels.forEach((level) => {
    dom += `<div class="show-level"><a href="${config.server}/level/${level.levelID}">
      <div>${level.name}</div>
    </a></div>`
  })

  return `<div class="userlevels">
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
    <div class="title">enter a name for your custom level</div>
    <input type="text" class="level-name"/>
  </div>
  <br/>
  <div class="param head">
    <div class="title">choose a size for your level <span>(max. 4500 blocks)</span> </div>
  </div>
  <div class="param">
    <div class="title">width <span>(blocks)</span>: </div>
    <input type="text" class='columns'/>
  </div>
  <div class="param">
    <div class="title">height <span>(blocks)</span>: </div>
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
//      <div class="back-image"><img src="/img/examplelevel.png"/></div>

export function renderMenu(userLevels){
  return `<div class="menu">

    <div class="intro">
      <div class="back-image"><img src="/img/examplelevel.png"/></div>
      <div class="intro-content">
      <span class="headline">Create, Share & Play</span>
      <br/>
      <div>The game is simple. Avoid obstacles, jump over enemies and catch <span>the star</span></div>
      </div>
    </div>

    <div class="create-menu">
      <div class="title">Play one of the user submitted levels or create your own!</div>
      <div class="create-level">
        <div class="btn">
          Create Level!
        </div>
      </div>
      <div class="bottom-border"></div>
    </div>

    <div class="highlight">
      <div class="title">showcase levels</div>
      <br/>
      ${renderShowcaseLevels()}

      <div class="bottom-border"></div>
    </div>

    <div class="usersub">
    <div class="title">user submitted levels</div>
    ${renderUserLevels(userLevels)}
    </div>

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
