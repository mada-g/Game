import $ from 'jquery';

import config from '../data/config.js';
import {renderPublishSuccess, renderPublishFailed} from './editorTools';
//let json = JSON.stringify({name: "tadic", shirt: 11});

export default function publish(data){
  data.submitBy = 'user';

  data = JSON.stringify(data);

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    url: `${config.postServer}/game/levelpublish`,
    data: data,
    success: function(res){
      if(res.status === "success"){
        console.log("SAVE SUCCESS");
        $('.publish-text').empty();
        $('.publish-text').append(renderPublishSuccess(res.levelID));
      }
      else{
        $('.publish-text').empty();
        $('.publish-text').append(renderPublishFailed());
      }
      console.log('AJAX RESPONSE: ');
      console.log(res);

    }
  });
}
