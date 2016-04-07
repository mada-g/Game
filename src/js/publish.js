import $ from 'jquery';

//let json = JSON.stringify({name: "tadic", shirt: 11});

export default function publish(data){
  data.submitBy = 'user';

  data = JSON.stringify(data);

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    url: 'http://localhost:3000/levelpublish',
    data: data,
    success: function(res){
      console.log('AJAX RESPONSE: ');
      console.log(res);
    }
  });
}
