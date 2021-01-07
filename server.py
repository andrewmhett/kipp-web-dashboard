class Server:
    def __init__(self):
        self.song_queue=[]
        self.playlists=[]
        self.current_song=""
        self.current_song_link=""
        self.seconds_elapsed=0
        self.length=0
        self.action_queue=["INITIALIZE"]
