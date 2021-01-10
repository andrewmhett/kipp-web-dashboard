var queryString = window.location.search;
var platform = document.getElementById("platform-tag").content;
var invalid=false;

function revoke_authentication(user_id){
  var xhttp = new XMLHttpRequest();
  var id_hash = new URLSearchParams(queryString).get("id_hash");
  xhttp.open("POST", "/action_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send("REVOKE_VERIFICATION,->"+user_id);
}

function poll_verified_users(user_id, retries){
  if (retries<5){
    retries++;
    var xhttp = new XMLHttpRequest();
    var id_hash = new URLSearchParams(queryString).get("id_hash");
    xhttp.open("GET", "/verified_users?id_hash="+id_hash, true);
    xhttp.timeout = 1000;
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status==200){
          for (var i=0;i<this.response.split("<br>").length;i++){
            if (this.response.split("<br>")[i]==user_id){
              revoke_authentication(user_id);
              document.cookie="verified=true";
              draw_dashboard();
              return;
            }
          }
          window.setTimeout(function(){
            poll_verified_users(user_id,retries);
          },200)
        }
      }
    }
  }else{
    if (!invalid){
      invalid=true;
      var invalid_text = document.createElement("span");
      var body=document.getElementById("body");
      body.appendChild(document.createElement("br"));
      invalid_text.id="invalid_text";
      if (platform==="desktop"){
        invalid_text.style["font-size"]="20px";
      }else{
        invalid_text.style["font-size"]="35px";
      }
      invalid_text.style["color"]="red";
      invalid_text.innerHTML="Invalid code."
      invalid_text.style["margin-top"]="20px";
      body.appendChild(invalid_text);
    }
  }
}

function verify_user(user_id){
  var xhttp = new XMLHttpRequest();
  var id_hash = new URLSearchParams(queryString).get("id_hash");
  xhttp.open("POST", "/action_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send("VERIFY_USER,->"+user_id);
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status!==200){
        window.setTimeout(function(){
          verify_user(user_id)
        },500);
      }
    }
  }
}

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function draw_dashboard(){
  xhttp = new XMLHttpRequest();
  var url = new URL(window.location.href);
  var id_hash = url.searchParams.get("id_hash");
  var platform="desktop";
  if (window.mobileCheck()){
    platform="mobile";
  }
  xhttp.open("GET", "/dashboard_"+platform+"?id_hash="+id_hash, true);
  xhttp.timeout=1000;
  xhttp.send();
  xhttp.onreadystatechange = function (){
    if (this.readyState == 4){
      if (this.status == 200){
        document.open();
        document.write(this.response);
        document.close();
      }
    }
  }
}

function submit_code(user_id,code){
  var xhttp = new XMLHttpRequest();
  var id_hash = new URLSearchParams(queryString).get("id_hash");
  xhttp.open("POST", "/action_queue?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send("CHECK_2FA,->"+user_id+",->"+code);
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status===200){
        poll_verified_users(user_id,0);
      }
    }
  }
}

function draw_code_entry_screen(user_id){
  var body=document.getElementById("body");
  for (var i=2;i<body.children.length;i++){
    body.removeChild(body.children[i]);
  }
  if (document.getElementById("invalid_text") != undefined){
    body.removeChild(document.getElementById("invalid_text"));
  }
  var info_span = document.createElement("span");
  info_span.innerHTML="Enter your 2FA code:"
  if (platform=="desktop"){
    info_span.style["font-size"]="30px";
  }else{
    info_span.style["font-size"]="45px";
  }
  body.appendChild(info_span);
  body.appendChild(document.createElement("br"));
  var code_entry = document.createElement("input");
  code_entry.id="code_entry";
  code_entry.type="text";
  code_entry.style["width"]="200px";
  if (platform=="desktop"){
    code_entry.style["font-size"]="30px";
  }else{
    code_entry.style["font-size"]="45px";
  }
  code_entry.style["background-color"]="#202225";
  code_entry.style["border"]="0";
  if (platform=="desktop"){
    code_entry.style["margin-top"]="10px";
  }else{
    code_entry.style["margin-top"]="20px";
  }
  code_entry.style["border-radius"]="5px";
  code_entry.style["color"]="white";
  code_entry.style["text-align"]="center";
  body.appendChild(code_entry);
  body.appendChild(document.createElement("br"));
  var submit_button = document.createElement("button");
  submit_button.id="submit_code_button";
  submit_button.style["width"]="auto";
  if (platform=="desktop"){
    submit_button.style["margin-top"]="10px";
    submit_button.style["font-size"]="20px";
  }else{
    submit_button.style["margin-top"]="20px";
    submit_button.style["font-size"]="40px";
  }
  submit_button.style["background-color"]="#7388DA";
  submit_button.style["border"]="0";
  submit_button.style["border-radius"]="5px";
  submit_button.style["padding"]="5px";
  submit_button.innerHTML="Enter";
  submit_button.onclick=function(){
    submit_code(user_id,code_entry.value);
  }
  body.appendChild(submit_button);
}

function submit_username(username){
  var xhttp = new XMLHttpRequest();
  var id_hash = new URLSearchParams(queryString).get("id_hash");
  xhttp.open("GET", "/members?id_hash="+id_hash, true);
  xhttp.timeout = 1000;
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status===200){
        var members=this.response.split("<br>")
        var user_id=0;
        for (var i=0;i<members.length;i++){
          if (members[i].split(",->")[0].split("#")[0] === username.toUpperCase()){
            user_id=members[i].split(",->")[1];
          }
          verify_user(user_id);
        }
        if (user_id !== 0){
          invalid=false;
          document.cookie = "user_id="+user_id;
          draw_code_entry_screen(user_id);
        }else{
          if (!invalid){
            invalid=true;
            var invalid_text = document.createElement("span");
            var body=document.getElementById("body");
            body.appendChild(document.createElement("br"));
            invalid_text.id="invalid_text";
            if (platform==="desktop"){
              invalid_text.style["font-size"]="20px";
            }else{
              invalid_text.style["font-size"]="35px";
            }
            invalid_text.style["color"]="red";
            invalid_text.innerHTML="Invalid username."
            invalid_text.style["margin-top"]="20px";
            body.appendChild(invalid_text);
          }
        }
      }
    }
  }
}

function get_cookie_value(key){
  var cookies=document.cookie.split("; ");
  for (var i=0;i<cookies.length;i++){
    if (cookies[i].startsWith(key)){
      return cookies[i].split("=")[1];
    }
  }
  return "";
}

if (get_cookie_value("user_id")==""){
  var submit_button = document.getElementById("submit_username_button");
  submit_button.onclick = function(){
    submit_username(username_input.value);
  }
}else{
 draw_code_entry_screen(get_cookie_value("user_id")=="");
}
