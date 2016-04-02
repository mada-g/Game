import $ from 'jquery';


var viewportPosition = function(pos, scrollLeft, scrollTop){
    return [
      pos[0] - scrollLeft,
      pos[1] - scrollTop
    ];
};

export function viewportScroll(actor){
    let scrollLeft = $('.viewport').scrollLeft();
    let scrollTop = $('.viewport').scrollTop();

    let vPos = viewportPosition(actor.pos, scrollLeft, scrollTop);

    if(vPos[0] > 700){
      $('.viewport').scrollLeft(scrollLeft + 20);
    }
    else if(vPos[0] < 200){
      $('.viewport').scrollLeft(scrollLeft - 20);
    }

    if(vPos[1] > 250){
      $('.viewport').scrollTop(scrollTop + 20);
    }
    else if(vPos[1] < 200){
      $('.viewport').scrollTop(scrollTop - 20);
    }
};
