var id_hash = new URLSearchParams(queryString).get("id_hash");

function post_action(action){
  var xhttp = new XMLHttpRequest();
  window.setTimeout(poll_queue, 500);
  xhttp.open("POST", "/action_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send(action);
}

function update_buttons(){
  var buttons = document.getElementsByClassName("song_button");
  for (var i=0;i<buttons.length;i++){
    if (typeof(buttons[i]) !== undefined){
      if (buttons[i].id.startsWith("remove_song_button")){
        buttons[i].onclick=function(event){
          var button_el = (event.target || event.srcElement);
          remove_song_action(button_el.id.split("remove_song_button-")[1]);
        }
      }
      else if (buttons[i].id.startsWith("move_up_button")){
        buttons[i].onclick=function(event){
          var button_el = (event.target || event.srcElement);
          var index = parseInt(button_el.id.split("move_up_button-")[1]);
          move_song_action(index,index-1);
        }
      }
      else if (buttons[i].id.startsWith("move_down_button")){
        buttons[i].onclick=function(event){
          var button_el = (event.target || event.srcElement);
          var index = parseInt(buttons_el.id.split("move_down_button-")[1]);
          move_song_action(index,index+1);
        }
      }
      else if (buttons[i].id.startsWith("shuffle_queue_button")){
        buttons[i].onclick=function(){
          shuffle_queue_action();
        }
      }
      else if (buttons[i].id.startsWith("clear_queue_button")){
        buttons[i].onclick=function(){
          clear_queue_action();
        }
      }
    }
  }
}

function remove_song_action(song_index){
  post_action("REMOVE_SONG,->"+song_index);
}

function move_song_action(orig_index,new_index){
  post_action("MOVE_SONG,->"+orig_index+",->"+new_index);
}

function shuffle_queue_action(){
  post_action("SHUFFLE_QUEUE");
}

function clear_queue_action(){
  post_action("CLEAR_QUEUE");
}

update_buttons();
