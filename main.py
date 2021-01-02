import flask
import os

'''
Heroku assigns this app a port to use
with the PORT environment variable
'''
heroku_port=int(os.environ.get('PORT', 12345))

app=flask.Flask(__name__)

@app.route("/")
def landing_page():
    return flask.render_template('loading_page.html')

app.run(host="0.0.0.0", threaded=True, port=heroku_port)
