var id_hash = new URLSearchParams(queryString).get("id_hash");
var active_button=null;
var initial_button_color="";

function post_action(action){
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/action_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send(action);
  active_button.style.border="2px solid white";
  var buttons = document.getElementsByClassName("song_button");
  for (var i=0;i<buttons.length;i++){
    if (typeof(buttons[i]) !== undefined){
      buttons[i].disabled=true;
    }
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status !== 200) {
        window.setTimeout(function(){
          post_action(action)
        },10);
      }else{
        active_button.style["background-color"]=initial_button_color;
        active_button.style["border"]="0";
        if (active_button.id === "shuffle_queue_button"){
          document.getElementById("shuffle_image").style.border="0";
          document.getElementById("shuffle_image").style["background_color"]="#b9bbbe";
        }
        active_button=null;
        for (var i=0;i<buttons.length;i++){
          if (typeof(buttons[i]) !== undefined){
            buttons[i].disabled=false;
          }
        }
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
      else if (buttons[i].id.startsWith("shuffle_queue_button")){
        buttons[i].onclick=function(){
          if (active_button === null){
            var button_el = (event.target || event.srcElement);
            active_button=button_el;
            initial_button_color="#b9bbbe";
            document.getElementById("shuffle_image").style.border="2px solid white";
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
