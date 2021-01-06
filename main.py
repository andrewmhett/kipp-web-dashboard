import flask
import os
from server import Server
import hashlib
import datetime

servers={}

ACTIONS=[
    "CLEAR_QUEUE",
    "SHUFFLE_QUEUE",
    "MOVE_SONG",
    "REMOVE_SONG"
]

def authenticate(signature,data):
    from pubkey import e, n
    from hashlib import sha512
    hour=datetime.datetime.strftime(datetime.datetime.utcnow(),"%H")
    minute=int(datetime.datetime.strftime(datetime.datetime.utcnow(),"%M"))
    derived_hash=pow(int(signature),e,n)
    for i in range(2):
        minute_str=str(minute-i)
        if len(minute_str)==1:
            minute_str="0"+minute_str
        data_str=(hour+":"+minute_str).encode('utf-8')+data
        hash=int.from_bytes(hashlib.sha512(data_str).digest(),byteorder='big')
        if derived_hash==hash:
            return 0
    return 1

'''
Heroku assigns this app a port to use
with the PORT environment variable
'''
heroku_port=int(os.environ.get('PORT', 12345))

app=flask.Flask(__name__)

def ensure_existence():
    try:
        if flask.request.args["id_hash"] not in servers.keys():
            if flask.request.args["id_hash"] != "null":
                servers[flask.request.args["id_hash"]]=Server()
    except KeyError:
        pass

@app.route("/")
def landing_page():
    ensure_existence()
    return flask.render_template('loading_page.html')

@app.route("/dashboard_desktop")
def dashboard_desktop():
    if flask.request.args["id_hash"] != "null":
        return flask.render_template('dashboard_desktop.html')
    return "No server hash specified",404

@app.route("/dashboard_mobile")
def dashboard_mobile():
    if flask.request.args["id_hash"] != "null":
        return flask.render_template('dashboard_mobile.html')
    return "No server hash specified",404

@app.route("/action_queue",methods=['GET','POST'])
def action_queue():
    id_hash=flask.request.args["id_hash"]
    global servers
    if flask.request.method=="GET":
        server=servers[id_hash]
        queue_str="<br>".join(server.action_queue)
        return queue_str
    else:
        if "signature" in flask.request.args.keys():
            auth_code=authenticate(flask.request.args["signature"],flask.request.data)
            if auth_code==0:
                ensure_existence()
                server=servers[id_hash]
                server.action_queue=[]
                return "Authentication Succeeded",200
            else:
                return "Authentication Failed",401
        else:
            server=servers[id_hash]
            try:
                for action in ACTIONS:
                    if flask.request.data.decode().startswith(action):
                        server.action_queue.append(flask.request.data.decode())
                        break
            except IndexError:
                return 500,"Invalid action index"
            return "Action posted",200

@app.route("/currently_playing_information",methods = ['GET', 'POST'])
def currently_playing():
    id_hash=flask.request.args["id_hash"]
    global servers
    if flask.request.method=="GET":
        server=servers[id_hash]
        ret_json={
            "current_name":server.current_song,
            "seconds_elapsed:":server.seconds_elapsed,
            "total_length":server.length
        }
        return str(ret_json)
    else:
        if "signature" in flask.request.args.keys():
            auth_code=authenticate(flask.request.args["signature"],flask.request.data)
            if auth_code==0:
                ensure_existence()
                server=servers[id_hash]
                server.current_song=flask.request.json["current_name"]
                server.seconds_elapsed=flask.request.json["seconds_elapsed"]
                server.length=flask.request.json["total_length"]
                return "Authentication Succeeded",200
        return "Authentication Failed",401

@app.route("/song_queue",methods = ['GET', 'POST'])
def song_queue():
    id_hash=flask.request.args["id_hash"]
    global servers
    if flask.request.method=="GET":
        server=servers[id_hash]
        queue_str="<br>".join(str(song_pair) for song_pair in server.song_queue)
        return queue_str
    else:
        if "signature" in flask.request.args.keys():
            auth_code=authenticate(flask.request.args["signature"],flask.request.data)
            if auth_code==0:
                ensure_existence()
                server=servers[id_hash]
                server.song_queue=[]
                for song_pair in flask.request.data.decode().split(",\n"):
                    if len(song_pair)>0:
                        song, link = song_pair.split(",->")
                        server.song_queue.append("{"+'"name":"{0}","link":"{1}"'.format(song,link)+"}")
                return "Authentication Succeeded",200
        return "Authentication Failed",401

@app.route("/playlist_names",methods = ['GET', 'POST'])
def playlists():
    id_hash=flask.request.args["id_hash"]
    global servers
    if flask.request.method=="GET":
        server=servers[id_hash]
        playlist_str=""
        for playlist in server.playlists:
            playlist_str.append(playlist+",\n")
        return playlist_str
    else:
        if "signature" in flask.request.args.keys():
            auth_code=authenticate(flask.request.args["signature"],flask.request.data)
            if auth_code==0:
                ensure_existence()
                server=servers[id_hash]
                server.playlists=str(flask.request.data).split(",\n")
                return "Authentication Succeeded",200
        return "Authentication Failed",401

app.run(host="0.0.0.0", threaded=True, port=heroku_port)
