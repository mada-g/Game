var renderLevelSelection = function(levels){
  var dom = "";

  levels.forEach((level, id) => {
    dom += `<div class="level-selection" data-level-num="${id}">
      level ${id+1}
    </div>`
  })

  return dom;
}

export function renderMenu(levels){
  return `<div class="menu">
    <div class="create-level">
      <div class="btn">
        Create Level!
      </div>
    </div>

    <div class="highlight">${renderLevelSelection(levels)}</div>
    <div class="all-list"></div>
  </div>`
}

export function renderGameArea(){
  return `
  <div class="mode">
    edit level
  </div>
  <div class="game">
    <div class="viewport">
      <div class="content"></div>
    </div>
  </div>`
}
