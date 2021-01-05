class Server:
    def __init__(self):
        self.song_queue=[]
        self.playlists=[]
        self.current_song=""
        self.seconds_elapsed=0
        self.length=0
        self.action_queue=[]
