var old_queue = "";
var platform = document.getElementById("platform-tag").content;
var old_title = "";

function update_current_song(song_info) {
  var table = document.getElementById("currently_playing_table");
  var song_json = JSON.parse(song_info);
  var num_rows = table.rows.length;
  if (song_json.title.length > 0) {
    var num_rows = table.rows.length;
    var progress_percent = song_json.seconds_elapsed / song_json.total_length;
    progress_percent *= 100;
    if (old_title != song_json.title) {
      table.style["background-color"] = "#2f3136";
      if (platform==="desktop"){
        table.style["box-shadow"] = "0 0 10px #ccc";
      }else{
        table.style["box-shadow"] = "0 0 20px #ccc";
      }
      old_title = song_json.title;
      for (var i = 0; i < num_rows; i++) {
        table.deleteRow(0);
      }
      var row = table.insertRow(0);
      row.style["width"] = "100%";
      row.style["border-top"] = "0";
      var title = document.createElement("span");
      var title_a=document.createElement("a");
      title_a.style.display="inline-block";
      title_a.href=song_json.link;
      title_a.style.height="100%";
      title_a.style.width="100%";
      var title_cell = row.insertCell(0);
      title_cell.style["overflow"] = "hidden";
      title_cell.style["display"]="block";
      title.classList.add("song_link");
      title.innerHTML = song_json.title;
      if (platform==="desktop"){
        title_cell.style["width"] = "200px";
      }else{
        title_cell.style["width"] = "250px";
      }
      title_cell.style["float"] = "bottom-left";
      title_cell.style["vertical_align"] = "middle";
      title_cell.style["height"]="100%";
      if (platform === "desktop") {
        title.style["font-size"] = "20px";
      } else {
        title.style["font-size"] = "30px";
      }
      title.style["white-space"] = "nowrap";
      title.style["overflow-x"] = "hidden";
      title.style["overflow"]="visible";
      title.style["display"]="inline-block";
      title.style["text-overflow"]="ellipsis";
      title_cell.id="title_cell";
      title_a.appendChild(title);
      title_cell.appendChild(title_a);
      title_cell.children[0].animate({transform:["translateX(100%)","translateX(-"+(title_cell.scrollWidth+100).toString()+"px)"]}, {
        iterations:Infinity,
        duration: 11000
      });
      title.style["float"] = "right";
      var current_time_cell = row.insertCell(1);
      current_time_cell.style.width = "5%";
      var current_time_span = document.createElement("span");
      if (song_json.total_length >= 3600) {
        current_time_span.innerHTML = "0:00:00";
      } else {
        current_time_span.innerHTML = "0:00";
      }
      current_time_span.id = "current_time_span";
      if (platform === "desktop") {
        current_time_span.style["font-size"] = "15px";
      } else {
        current_time_span.style["font-size"] = "22.5px";
      }
      current_time_span.style["vertical-align"] = "sup";
      current_time_cell.style["text-align"] = "right";
      current_time_cell.appendChild(current_time_span);
      var progress_cell = row.insertCell(2);
      progress_cell.id = "progress_cell";
      progress_cell.style.width = "70%";
      var total_time_cell = row.insertCell(3);
      current_time_cell.style.width = "5%";
      var total_time_span = document.createElement("span");
      total_time_span.innerHTML = song_json.total_timestamp;
      total_time_cell.appendChild(total_time_span);
      total_time_cell.style.width = "5%";
      total_time_cell.style["text-align"] = "left";
      total_time_span.style["vertical-align"] = "sup";
      if (platform === "desktop") {
        total_time_span.style["font-size"] = "15px";
      } else {
        total_time_span.style["font-size"] = "22.5px";
      }
      var progress_bar = document.createElement("div");
      if (platform=="mobile"){
        progress_bar.style["padding-top"]="5px";
        progress_bar.style["padding-bottom"]="5px";
      }else{
        title_cell.style["padding-top"]="5px";
      }
      progress_bar.classList.add("progress_bar")
      progress_bar.style["text-align"] = "center";
      var progress_div = document.createElement("div");
      progress_div.style["text-align"] = "left";
      progress_div.style.width = progress_percent.toString() + "%";
      progress_div.style.height = "100%";
      progress_div.style["background-color"] = "#7388DA";
      progress_div.style["text-align"] = "center";
      progress_bar.appendChild(progress_div);
      var progress_text = document.createElement("span");
      progress_text.innerHTML = progress_percent.toFixed(0).toString() + "%";
      if (platform === "desktop") {
        progress_text.style["font-size"] = "12.5px";
      } else {
        progress_text.style["font-size"] = "20px";
      }
      progress_text.style["position"] = "absolute";
      progress_text.style["margin-left"] = "auto";
      progress_text.style["margin-right"] = "auto";
      progress_text.style.left = "0";
      progress_text.style.right = "0";
      progress_cell.appendChild(progress_text);
      progress_cell.appendChild(progress_bar);
      var button_cell = row.insertCell(4);
      button_cell.style["text-align"] = "center";
      if (platform==="desktop"){
        button_cell.style["width"]="200px";
      }else{
        button_cell.style["width"]="250px";
      }
      button_cell.style.display="inline-block";
      var button_table = document.createElement('table');
      button_table["margin-left"] = "1%";
      var button_row = button_table.insertRow(0);
      var pause_play_button = document.createElement('button');
      pause_play_button.style["float"]="top-right";
      var pause_play_img = document.createElement("img");
      pause_play_img.src = "static/800px-Play_Pause_icon_2283501.png";
      pause_play_img.style.height = "100%";
      pause_play_img.style.width = "auto";
      pause_play_img.style.pause_play_button.appendChild(pause_play_img);
      pause_play_button.classList.add('song_button');
      pause_play_button.style["background-color"] = "#b9bbbe";
      pause_play_button.id = "pause_play_button";
      button_row.insertCell(0).appendChild(pause_play_button);
      var skip_button = document.createElement('button');
      skip_button.style["float"]="top-right";
      skip_button.style["text-align"] = "center";
      var skip_img = document.createElement("img");
      skip_img.style["vertical-align"] = "middle";
      skip_img.src = "/static/800px-Fast_forward_font_awesome.png"
      skip_img.style.height = "100%";
      skip_img.style.width = "auto";
      skip_img.style.padding = "5px";
      skip_img.style["box-sizing"] = "border-box";
      skip_img.style.overflow = "hidden";
      skip_button.appendChild(skip_img);
      skip_button.classList.add('song_button');
      skip_button.style["background-color"] = "#b9bbbe";
      skip_button.style["text-align"] = "right";
      skip_button.id = "skip_button";
      button_row.insertCell(1).appendChild(skip_button);
      button_cell.appendChild(button_table);
      button_cell.style["text-align"] = "right";
    } else {
      var progress_cell = document.getElementById("progress_cell");
      while (progress_cell.firstChild) {
        progress_cell.removeChild(progress_cell.lastChild);
      }
      var progress_bar = document.createElement("div");
      progress_bar.classList.add("progress_bar")
      progress_bar.style["text-align"] = "center";
      progress_bar.id = "progress_bar";
      var progress_div = document.createElement("div");
      progress_div.style["text-align"] = "left";
      progress_div.style.width = progress_percent.toString() + "%";
      progress_div.style.height = "100%";
      progress_div.style["background-color"] = "#7388DA";
      progress_div.style["text-align"] = "center";
      progress_bar.appendChild(progress_div);
      var progress_text = document.createElement("span");
      progress_text.innerHTML = progress_percent.toFixed(0).toString() + "%";
      if (platform === "desktop") {
        progress_text.style["font-size"] = "12.5px";
      } else {
        progress_text.style["font-size"] = "20px";
      }
      progress_text.style["position"] = "absolute";
      progress_text.style["margin-left"] = "auto";
      progress_text.style["margin-right"] = "auto";
      progress_text.style.left = "0";
      progress_text.style.right = "0";
      progress_cell.appendChild(progress_text);
      progress_cell.appendChild(progress_bar);
      var current_time_span = document.getElementById("current_time_span");
      current_time_span.innerHTML = song_json.current_timestamp;
    }
  } else {
    for (var i = 0; i < num_rows; i++) {
      table.deleteRow(0);
    }
    table.style["background-color"] = "black";
    table.style["box-shadow"] = "0 0 0px #0000";
    old_title = "";
  }
}

function update_queue(queue) {
  if (queue == old_queue) {
    return;
  } else {
    old_queue = queue;
  }
  var song_queue = queue.split("<br>");
  var json_queue = [];
  for (var i = 0; i < song_queue.length; i++) {
    if (song_queue[i].length > 0) {
      json_queue.push(JSON.parse(song_queue[i]));
    }
  }
  var table = document.getElementById("queue_table");
  var num_rows = table.rows.length;
  for (var i = 0; i < num_rows; i++) {
    table.deleteRow(0);
  }
  if (song_queue[0].length == 0) {
    table.style["background-color"] = "black";
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.classList.add('embed');
    var empty_queue_text = document.createElement('span');
    empty_queue_text.innerHTML = "No Songs in Queue";
    empty_queue_text.classList.add("dark_embed");
    cell.appendChild(empty_queue_text);
    return;
  } else {
    table.style["background-color"] = "";
  }
  for (var i = 0; i < json_queue.length; i++) {
    var row = table.insertRow(i);
    row.style.overflow = "hidden";
    row.style.whitespace = "nowrap";
    var position_cell = row.insertCell(0);
    position_cell.style.width = "2%";
    var position_embed = document.createElement('span');
    position_embed.classList.add('dark_embed')
    position_embed.style["margin-right"] = "5px";
    position_embed.innerHTML = "#" + (i + 1).toString();
    position_embed.style["text-align"] = "left";
    position_cell.appendChild(position_embed);
    var link_cell = row.insertCell(1);
    link_cell.style["text-align"] = "left";
    link_cell.style["border-left"] = "1px solid white";
    link_cell.style["border-right"] = "1px solid white";
    link_cell.style.width = "80%";
    link_cell.style.overflow = "hidden";
    link_cell.style["max-width"] = "200px";
    var link_href = document.createElement('a');
    link_href.classList.add("song_link");
    link_href.href = json_queue[i].link;
    link_href.innerHTML = json_queue[i].name;
    link_cell.appendChild(link_href);
    var button_cell = row.insertCell(2);
    button_cell.style["text-align"] = "center";
    if (platform == "desktop") {
      button_cell.style["min-width"] = "100px";
    } else {
      button_cell.style["min-width"] = "200px";
    }
    button_cell.style.width = "0%";
    var button_table = document.createElement('table');
    button_table["margin-left"] = "1%";
    var button_row = button_table.insertRow(0);
    var remove_song_button = document.createElement('button');
    remove_song_button.innerHTML = 'X';
    remove_song_button.classList.add('song_button');
    remove_song_button.style["background-color"] = "red";
    remove_song_button.id = "remove_song_button-" + i;
    button_row.insertCell(0).appendChild(remove_song_button);
    var move_up_button = document.createElement('button');
    move_up_button.innerHTML = '▲';
    move_up_button.classList.add('song_button');
    move_up_button.style["background-color"] = "#b9bbbe";
    move_up_button.id = "move_up_button-" + i;
    button_row.insertCell(1).appendChild(move_up_button);
    var move_down_button = document.createElement('button');
    move_down_button.innerHTML = '▼';
    move_down_button.classList.add('song_button');
    move_down_button.style["background-color"] = "#b9bbbe";
    move_down_button.id = "move_down_button-" + i;
    button_row.insertCell(2).appendChild(move_down_button);
    button_cell.appendChild(button_table);
    button_cell.style["text-align"] = "right";
  }
  update_buttons();
}

var queryString = window.location.search;
var id_hash = new URLSearchParams(queryString).get("id_hash");

function poll_queue() {
  var xhttp = new XMLHttpRequest();
  window.setTimeout(poll_queue, 333);
  xhttp.open("GET", "/song_queue?id_hash=" + id_hash, true);
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

function poll_current_song() {
  var xhttp = new XMLHttpRequest();
  window.setTimeout(poll_current_song, 1000);
  xhttp.open("GET", "/current_song?id_hash=" + id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        update_current_song(this.response);
      }
    }
  }
}

poll_current_song();
poll_queue();
