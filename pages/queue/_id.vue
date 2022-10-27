<template>
    <div class="" style="overflow: hidden;">
        <p v-if="$fetchState.pending">Loading...</p>
        <p v-else-if="$fetchState.error">An Error Occurred</p>
        <div v-else class="d-flex flex-column justify-center my-auto mt-7" >
            <div class="px-3 align-self-center" style="width: 100%; max-width: 50rem;">
                <div class="d-flex flex-row justify-stretch">
                    <v-btn icon class="align-self-start mt-3 px-2 mr-4" color="white"  elevation="0" @click="showShareOverlay">
                        <v-icon size="25">
                            mdi-share-variant
                        </v-icon>
                    </v-btn>
                    <v-text-field v-model="searchString" rounded color="white" background-color=""
                        filled single-line label="Search for a song" class="" style="color: white"
                        @submit="submitSearch" @keydown.enter="submitSearch" prepend-inner-icon="mdi-magnify" @click:append="submitSearch" clear-icon="mdi-close-circle" clearable @click:clear="clearInput" >
                    </v-text-field>
                    
                    <v-btn icon class="align-self-start mt-3 px-2 ml-4" color="white"  elevation="0">
                        <v-icon size="25">
                            mdi-cog
                        </v-icon>
                    </v-btn>
                </div>
                
                <v-card v-if="showNextSong" style="border-radius: 10px;" class="mt-n2">
                    <v-card-title class="pa-2 ml-2">Next Song:</v-card-title>
                    <v-divider></v-divider>
                    <div class="d-flex flex-row align-stretch py-2" style="max-width: 100vh; overflow: hidden;">
                        <v-img :lazy-src="next_song.img" max-height="4rem" max-width="4rem" :src="next_song.img" class="my-2 ml-4"></v-img>
                        <div class="d-flex flex-column align-start mr-4 mt-3">
                            <v-card-text class="text-h6 text-capitalize ma-0 py-0" style="overflow: hidden; max-width: 50vw; text-overflow: ellipsis; white-space: nowrap;">{{next_song.name}}</v-card-text>
                            <v-card-text class="text-body-2 text-capitalize py-0 font-weight-light ma-0">{{next_song.artist}}</v-card-text>
                        </div>
                        <p class=" ma-0 pa-0 mt-6 align-self-center text-body-1 ml-auto mr-4">{{millisToMinutesAndSeconds(next_song.duration_ms)}}</p>
                        <v-divider vertical></v-divider>
                        <p class="ma-0 pa-0 align-self-center mx-4">{{next_song.votes}}</p>
                    </div>
                </v-card>
            </div>
            
            <div class="align-self-center">
                <v-overlay :value="searchDrawerExtended" opacity="0.90" @click="hideOverlay">
                    <div style="overflow-y: scroll; max-height: 85vh; max-width: 100vw;" class="ma-auto">
                        <div v-for="item in searchResults" :key="item.uri">
                            <v-btn @click="addSongToQueue(item)" style="height: 6rem; width: 100%; max-width: 100vw;" class="pa-4" tile>
                                <div class="d-flex flex-row align-stretch" style="width: 100%; max-width: 100vw; overflow: hidden;">
                                    <v-img :lazy-src="item.album.images[0].url" max-height="4rem" max-width="4rem" :src="item.album.images[0].url" class="mr-8"></v-img>
                                    <div class="d-flex flex-column align-start mr-8" >
                                            <h4 class="text-h6 text-capitalize ma-0" style="overflow: hidden; max-width: 50vw; text-overflow: ellipsis; white-space: nowrap;">{{item.name}}</h4>
                                            <p class="text-body-2 text-capitalize font-weight-light ma-0">{{item.artists[0].name}}</p>
                                    </div>
                                    <p class="align-self-end float-right ml-auto">{{millisToMinutesAndSeconds(item.duration_ms)}}</p>
                                </div>
                            </v-btn>
                        </div>
                    </div>
                </v-overlay>
                <v-overlay :value="shareOverlay" opacity="0.90" @click="hideOverlay">
                    
                    <div class="d-flex flex-column justify-center align-center">
                        
                        <div class="align-center" style="background-color: #181818; border-radius: 10px;" >
                            <div class="d-flex justify-end" style="width: 100%;">
                                <v-btn icon small class="align-self-end justify-self-end mt-3 mr-3 mb-0 pa-0"><v-icon>mdi-close-circle</v-icon></v-btn>
                            </div>
                            
                        <p class="black--text text-center font-weight-normal white--text text-h6 pb-1 mx-5 px-4 pt-0 mt-0">Your Shared Queue</p>
                        
                        <v-img :src="qrcode" max-height="10rem" max-width="10rem" class="align-self-center mx-auto mb-5" style="border-radius: 10px;"></v-img>

                        <div class="ma-auto d-flex align-center px-5" style="max-width: 270px">
                            <v-otp-input dark length="6" type="number" color="#1ED760" class="pa-0 ma-0" disabled v-model="sessionId">

                            </v-otp-input>
                        </div>
                        <div class="d-flex justify-center align-center my-5 mb-10">
                            <v-btn elevation="0" style="background-color: transparent; color: white; border: 2px solid white;" class="ma-0 pa-6 text-button" rounded click="copyLink">Copy Link<v-icon small class="ml-3">mdi-content-copy</v-icon></v-btn>
                        </div>
                        </div>

                        
                    </div>
                </v-overlay>
            </div>
            <div class="align-self-center d-flex flex-column px-3" style="width: 100%; max-width: 50rem; overflow: hidden;">
                
                <v-sheet class="pt-5" style="border-radius: 10px; overflow-y: auto; max-height: calc(100vh - 21em); background-color: transparent;" v-if="getQueue().length > 0">
                    <div class="" v-for="(item, index) in getQueue()" :key="item.uri">
                        <div class="d-flex flex-row align-stretch ma-2" style="max-width: 100vh; overflow: hidden;">
                            <v-img :lazy-src="item.img" max-height="4rem" max-width="4rem" :src="item.img" class="mr-4 my-2 ml-2"></v-img>
                            <div class="d-flex flex-column align-start mr-4 mt-3">
                                <p class="text-h6 text-capitalize ma-0 py-0" style="overflow: hidden; max-width: 35vw; text-overflow: ellipsis; white-space: nowrap;">{{item.name}}</p>
                                <p class="text-body-2 text-capitalize py-0 font-weight-light ma-0">{{item.artist}}</p>
                            </div>
                            <p class="align-self-end text-body-1 ml-auto mr-3">{{millisToMinutesAndSeconds(item.duration_ms)}}</p>
                            <v-divider vertical></v-divider>
                            <div class="d-flex flex-column justify-space-between ml-2">
                                <v-btn icon small :plain="!item.upvoted[id.toString()]" :color="item.upvoted[id.toString()] ? '#1ED760' : 'white'" @click="upvoteSongUI({song: item, index})"> <v-icon>mdi-chevron-up</v-icon> </v-btn>
                                <p class="my-0 mx-auto pa-0">{{item.votes}}</p>
                                <v-btn icon small :plain="!item.downvoted[id.toString()]" :color="item.downvoted[id.toString()] ? 'red darken-3' : 'white'"  @click="downvoteSongUI({song: item, index})"><v-icon>mdi-chevron-down</v-icon> </v-btn>
                            </div>
                        </div>
                        <v-divider></v-divider>
                    </div>
                    
                
                </v-sheet>
                
            </div>
            <v-snackbar v-model="snackbarExistingSong" :timeout="timeout">Song is already in queue</v-snackbar>
            <v-snackbar v-model="snackbarSongAdded" :timeout="timeout">Song added to queue</v-snackbar>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations, mapState} from "vuex"
import {nanoid} from "nanoid"
export default {
    data(){
        return{
            host: false,
            currPlaying: "",
            isPlaying: false,
            device: "",
            searchString: "",
            searchResults: [{name: "", duration_ms: 0, uri: "", artists: [{name: ""}], album: {images: [{url: ""}]}}],
            sessionId: this.$route.params.id,
            access_token: "",
            redir: false,
            redirLink: "",
            loadingTracks: false,
            searchDrawerExtended: false,
            snackbarExistingSong: false,
            snackbarSongAdded: false,
            showNextSong: false,
            timeout: 3000,
            intervalPoll: null,
            next_song: null,
            socket: null,
            id: "0",
            shareOverlay: false,
            qrcode: null,
            tm: null,
            tm2: null,
            disconnected: false,
            lastTime: 0

        }
    },  
    validate({params}){
        //validate session
        return true
    },
    mounted(){
        this.setupSocket()
        setInterval(this.checkResume, 1000)
    },
    created(){
        const cookie = this.$cookies.get('sharedq-id')
        if(cookie === undefined){
            const id = nanoid()
            this.$cookies.set('sharedq-id', id, {maxAge: 60*60*24*7*4})
            this.id = id
        }else{
            this.id = cookie
        }
    },
    async fetch(){

        this.sessionId = this.$route.params.id
        const {queue, next_song, qrcode} = await this.restoreSession(this.sessionId)
        this.next_song = next_song
        this.qrcode = qrcode;
        if(this.next_song !== null)
            this.showNextSong = true

    },
    methods: {
        ...mapActions(["searchSpotify", "addQueueItem", "nextSong", "voteSong", "restoreSession"]),
        ...mapGetters(["getSessionId", "getQueue", "getNextSong"]),
        ...mapMutations(["setSessionId", "addToQueue", "removeFromQueue"]),
        async submitSearch(){
            this.loadingTracks = true
            document.activeElement.blur()
            const payload = {
                searchString: this.searchString,
                session_id: this.sessionId
            }
            await this.searchSpotify(payload).then(results => {
                this.searchResults = results.items
                this.loadingTracks = false
                this.searchDrawerExtended = true
                //this.$router.push("/queue/"+this.sessionId+"#search")
                document.documentElement.style.overflow = 'visible';
                document.body.scroll = "no";
                console.log(results.items)
                
            })
        },
        millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        },
        hideOverlay(){
            this.searchDrawerExtended = false
            this.shareOverlay = false
            //this.$router.push("/queue/"+this.sessionId)
            document.documentElement.style.overflow = 'hidenn';
            document.body.scroll = "no";
        },
        setupSocket(){
            this.socket = new WebSocket("ws://192.168.178.34:3001")
        
            this.socket.onmessage = async (event) => {
                console.log(event.data)
                if(JSON.parse(event.data).pong){
                    clearTimeout(this.tm)
                }else if(JSON.parse(event.data).update){
                    console.log("update")
                    const {queue, next_song} = await this.restoreSession(this.sessionId)
                    this.next_song = next_song
                }
                    
            }
            this.socket.onopen = async (event) => {
                console.log("OPEN")
                if(this.disconnected){
                    const {queue, next_song} = await this.restoreSession(this.sessionId)
                    this.next_song = next_song
                }else{
                    this.tm2 = setInterval(this.ping, 20000)
                }
                

            },
            this.socket.onclose = (event) => {
                setTimeout(this.setupSocket(), 10000)
            }

            
        },
        ping(){
            this.socket.send("__ping__");
            this.tm = setTimeout(() => {
                this.disconnected = true
                this.setupSocket()
            }, 5000)
        },
        async checkResume(){
            let now = new Date().getTime();
            if(now - this.lastTime > 4000){
                const {queue, next_song} = await this.restoreSession(this.sessionId)
                this.next_song = next_song
            }
            this.lastTime = now
        },
        async addSongToQueue(song){
            this.addQueueItem({session_id: this.sessionId, song_uri: song.uri, song_id: song.id,name: song.name, artist: song.artists[0].name, id: this.id}).then(res => {
                if(this.getQueue().length === 0 && this.next_song === null){
                    const nSong = {
                        uri: song.uri,
                        name: song.name,
                        artist: song.artists[0].name,
                        img: song.album.images[0].url,
                        duration_ms: song.duration_ms,

                    }
                    const payload = {
                        session_id: this.sessionId,
                        song: nSong
                    }
                    this.nextSong(payload).then(res2 => {
                        this.next_song = this.getNextSong()
                        this.showNextSong = true
                    }).catch(err2 => {

                    })

                }else{
                    const upvoted = {}
                    upvoted[this.id] = false
                    const downvoted = {}
                    downvoted[this.id] = false
                    this.addToQueue({song_uri: song.uri, song_id: song.id, name: song.name, artist: song.artists[0].name,
                         img: song.album.images[0].url, duration_ms: song.duration_ms, votes: 0, upvoted, downvoted})
                }
                this.snackbarSongAdded = true
            }).catch(err => {
                this.snackbarExistingSong = true
            })
            
        },
        clearInput(){
            this.searchString = ""
        },
        upvoteSongUI({song, index}){
            console.log(song)
            console.log(index)
            if(song.downvoted){
                this.voteSong({song, action: 2, index, session_id: this.sessionId, id: this.id})
            }else{
                if(song.upvoted){
                    this.voteSong({song, action: 1, index, session_id: this.sessionId, id: this.id})
                }else{
                    this.voteSong({song, action: 0, index, session_id: this.sessionId, id: this.id})
                } 
            }
        },
        downvoteSongUI({song, index}){
            if(song.upvoted){
                this.voteSong({song, action: 5, index, session_id: this.sessionId, id: this.id})
            }else{
                if(song.downvoted){
                    this.voteSong({song, action: 4, index, session_id: this.sessionId, id: this.id})
                }else{
                    this.voteSong({song, action: 3, index, session_id: this.sessionId, id: this.id})
                }
            }
            
        },
        showShareOverlay(){
            this.shareOverlay = true
        }   

  },
}
</script>

<style scoped>

</style>


<style>
    html{
        overflow-y: hidden;
        background-color: #121212;
    }
</style>

