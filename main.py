import flask
import os
from server import Server

servers={}

def authenticate(signature,hash):
    from pubkey import e, n
    derived_hash=pow(int(signature),e,n)
    if derived_hash==int(hash):
        return 0
    return 1

'''
Heroku assigns this app a port to use
with the PORT environment variable
'''
heroku_port=int(os.environ.get('PORT', 12345))

app=flask.Flask(__name__)

@app.route("/")
def landing_page():
    if flask.request.args["id_hash"] not in servers.keys():
        servers[flask.request.args["id_hash"]]=Server()
    return flask.render_template('loading_page.html')

@app.route("/dashboard")
def dashboard():
    return flask.render_template('dashboard.html')

@app.route("/heartbeat")
def heartbeat():
    id_hash=flask.request.args["id_hash"]
    global servers
    server=servers[id_hash]
    queue_str=""
    for action in server.action_queue:
        queue_str.append(action+",\n")
    action_queue=[]
    return queue_str

@app.route("/currently_playing_information",methods = ['GET', 'POST'])
def currently_playing():
    id_hash=flask.request.args["id_hash"]
    global servers
    try:
        server=servers[id_hash]
        if flask.request.method=="GET":
            ret_json={
                "current_name":server.current_song,
                "seconds_elapsed:":server.seconds_elapsed,
                "total_length":server.length
            }
            return str(ret_json)
        else:
            if "signature" in flask.request.args.keys() and "hash" in flask.request.args.keys():
                auth_code=authenticate(flask.request.args["signature"],flask.request.args["hash"])
                if auth_code==0:
                    server.current_song=flask.request.json["current_name"]
                    server.seconds_elapsed=flask.request.json["seconds_elapsed"]
                    server.length=flask.request.json["total_length"]
                    return "Authentication Succeeded",200
            return "Authentication Failed",401
    except KeyError:
        return "Server dashboard not initialized",404

@app.route("/song_queue",methods = ['GET', 'POST'])
def song_queue():
    id_hash=flask.request.args["id_hash"]
    global servers
    try:
        server=servers[id_hash]
        if flask.request.method=="GET":
            queue_str=""
            for song in server.song_queue:
                queue_str.append(song+",\n")
            return queue_str
        else:
            if "signature" in flask.request.args.keys() and "hash" in flask.request.args.keys():
                auth_code=authenticate(flask.request.args["signature"],flask.request.args["hash"])
                if auth_code==0:
                    self.song_queue=str(flask.request.data).split(",\n")
                    return "Authentication Succeeded",200
            return "Authentication Failed",401
    except KeyError:
        return "Server dashboard not initialized",404

@app.route("/playlist_names",methods = ['GET', 'POST'])
def playlists():
    id_hash=flask.request.args["id_hash"]
    global servers
    try:
        server=servers[id_hash]
        if flask.request.method=="GET":
            playlist_str=""
            for playlist in server.playlists:
                playlist_str.append(playlist+",\n")
            return playlist_str
        else:
            if "signature" in flask.request.args.keys() and "hash" in flask.request.args.keys():
                auth_code=authenticate(flask.request.args["signature"],flask.request.args["hash"])
                if auth_code==0:
                    server.playlists=str(flask.request.data).split(",\n")
                    return "Authentication Succeeded",200
            return "Authentication Failed",401
    except KeyError:
        return "Server dashboard not initialized",404

app.run(host="0.0.0.0", threaded=True, port=heroku_port)
