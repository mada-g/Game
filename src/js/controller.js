import $ from 'jquery';

import PlatformerGame from './game';

var pf = new PlatformerGame(50, 100, 20);





$(document).ready(function(){

  pf.init();
  pf.run();

})
