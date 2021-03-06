var active_button=null;
var initial_button_color="";

function post_action(action){
  var xhttp = new XMLHttpRequest();
  var id_hash = new URLSearchParams(queryString).get("id_hash");
  xhttp.open("POST", "/action_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send(action);
  var buttons = document.getElementsByClassName("song_button");
  active_button.disabled=true;
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status !== 200) {
        window.setTimeout(function(){
          post_action(action)
        },10);
      }else{
        active_button.style["background-color"]=initial_button_color;
        if (active_button.id === "shuffle_queue_button"){
          document.getElementById("shuffle_image").style["background_color"]="#b9bbbe";
        }else if (active_button.id === "toggle_pause_button"){
          document.getElementById("toggle_pause_image").style["background_color"]="#b9bbbe";
        }else if (active_button.id === "skip_button"){
          document.getElementById("skip_image").style["background_color"]="#b9bbbe";
        }
        active_button.disabled=false;
        active_button=null;
      }
    }
  }
}

function update_buttons(){
  var buttons = document.getElementsByClassName("song_button");
  for (var i=0;i<buttons.length;i++){
    if (typeof(buttons[i]) !== undefined){
      if (buttons[i].id.startsWith("remove_song_button")){
        buttons[i].onclick=function(event){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="red";
            button_el.style["background-color"]="DarkRed";
            remove_song_action(button_el.id.split("remove_song_button-")[1]);
          }
        }
      }
      else if (buttons[i].id.startsWith("move_up_button")){
        buttons[i].onclick=function(event){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            button_el.style["background-color"]="#292b2e";
            var index = parseInt(button_el.id.split("move_up_button-")[1]);
            move_song_action(index,index-1);
          }
        }
      }
      else if (buttons[i].id.startsWith("move_down_button")){
        buttons[i].onclick=function(event){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            button_el.style["background-color"]="#292b2e";
            var index = parseInt(button_el.id.split("move_down_button-")[1]);
            move_song_action(index,index+1);
          }
        }
      }
      else if (buttons[i].id === "shuffle_queue_button"){
        buttons[i].onclick=function(){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            button_el.style["background-color"]="#292b2e";
            shuffle_queue_action();
          }
        }
      }
      else if (buttons[i].id.startsWith("clear_queue_button")){
        buttons[i].onclick=function(){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="red";
            button_el.style["background-color"]="DarkRed";
            clear_queue_action();
          }
        }
      }
      else if (buttons[i].id === "pause_play_button"){
        buttons[i].onclick=function(){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            button_el.style["background-color"]="#292b2e";
            toggle_pause_action();
          }
        }
      }
      else if (buttons[i].id === "skip_button"){
        buttons[i].onclick=function(){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            button_el.style["background-color"]="#292b2e";
            skip_action();
          }
        }
      }
      else if (buttons[i].id === "rewind_button"){
        buttons[i].onclick=function(){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            button_el.style["background-color"]="#292b2e";
            rewind_action();
          }
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

function toggle_pause_action(){
  post_action("TOGGLE_PAUSE");
}

function skip_action(){
  post_action("SKIP");
}

function rewind_action(){
  post_action("REWIND");
}

update_buttons();
