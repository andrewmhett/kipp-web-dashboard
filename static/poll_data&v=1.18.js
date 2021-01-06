var old_queue="";
var platform=document.getElementById("platform-tag").content;

function update_queue(queue){
  if (queue == old_queue){
    return;
  }else{
    old_queue=queue;
  }
  var song_queue = queue.split("<br>");
  var json_queue=[];
  for (var i=0;i<song_queue.length;i++){
    if (song_queue[i].length>0){
      json_queue.push(JSON.parse(song_queue[i]));
    }
  }
  var table = document.getElementById("queue_table");
  var num_rows = table.rows.length;
  for (var i=0;i<num_rows;i++){
    table.deleteRow(0);
  }
  if (song_queue[0].length==0){
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    var empty_queue_text = document.createElement('span');
    empty_queue_text.innerHTML="No Songs in Queue";
    empty_queue_text.classList.add("dark_embed");
    cell.appendChild(empty_queue_text);
    return;
  }
  for (var i=0;i<json_queue.length;i++){
    var row = table.insertRow(i);
    row.style.overflow="hidden";
    row.style.whitespace="nowrap";
    var position_cell = row.insertCell(0);
    position_cell.style.width="2%";
    var position_embed = document.createElement('span');
    position_embed.classList.add('dark_embed')
    position_embed.style["margin-right"]="5px";
    position_embed.innerHTML="#"+(i+1).toString();
    position_cell.appendChild(position_embed);
    var link_cell = row.insertCell(1);
    link_cell.style["text-align"]="left";
    link_cell.style["border-left"]="1px solid white";
    link_cell.style["border-right"]="1px solid white";
    link_cell.style.width="80%";
    link_cell.style.overflow="hidden";
    link_cell.style["max-width"]="200px";
    var link_href = document.createElement('a');
    link_href.classList.add("song_link");
    link_href.style["white-space"]="nowrap";
    link_href.overflow="hidden";
    link_href.href=json_queue[i].link;
    link_href.innerHTML=json_queue[i].name;
    link_cell.appendChild(link_href);
    var button_cell = row.insertCell(2);
    button_cell.style["text-align"]="center";
    if (platform=="desktop"){
      button_cell.style["min-width"]="100px";
    }else{
      button_cell.style["min-width"]="200px";
    }
    button_cell.style.width="0%";
    var button_table = document.createElement('table');
    button_table["margin-left"]="1%";
    var button_row = button_table.insertRow(0);
    var remove_song_button = document.createElement('button');
    remove_song_button.innerHTML='X';
    remove_song_button.classList.add('song_button');
    remove_song_button.style["background-color"]="red";
    remove_song_button.id="remove_song_button-"+i;
    button_row.insertCell(0).appendChild(remove_song_button);
    var move_up_button = document.createElement('button');
    move_up_button.innerHTML='▲';
    move_up_button.classList.add('song_button');
    move_up_button.style["background-color"]="DarkGray";
    move_up_button.id="move_up_button-"+i;
    button_row.insertCell(1).appendChild(move_up_button);
    var move_down_button = document.createElement('button');
    move_down_button.innerHTML='▼';
    move_down_button.classList.add('song_button');
    move_down_button.style["background-color"]="DarkGray";
    move_down_button.id="move_down_button-"+i;
    button_row.insertCell(2).appendChild(move_down_button);
    button_cell.appendChild(button_table);
  }
  update_buttons();
}

var queryString = window.location.search;
var id_hash = new URLSearchParams(queryString).get("id_hash");

function poll_queue(){
  var xhttp = new XMLHttpRequest();
  window.setTimeout(poll_queue, 200);
  xhttp.open("GET", "/song_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        update_queue(this.response);
      }
    }
  }
}

poll_queue();
