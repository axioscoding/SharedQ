<template>
    <div class="" style="overflow: hidden;">
        <p v-if="$fetchState.pending">Loading...</p>
        <p v-else-if="$fetchState.error">An Error Occurred</p>
        <!-- Main Page Content -->
        <div v-else class="d-flex flex-column justify-center my-auto mt-7" >
            <div class="px-3 align-self-center" style="width: 100%; max-width: 50rem;">
                <!-- Controls -->
                <div class="d-flex flex-row justify-stretch">
                    <!-- Share Button -->
                    <v-btn icon class="align-self-start mt-3 px-2 mr-4" color="white"  elevation="0" @click="showShareOverlay">
                        <v-icon size="25">
                            mdi-share-variant
                        </v-icon>
                    </v-btn>
                    <!-- Search Bar -->
                    <v-text-field v-model="searchString" rounded color="white" background-color=""
                        filled single-line label="Search for a song" class="" style="color: white"
                        @submit="submitSearch" @keydown.enter="submitSearch" prepend-inner-icon="mdi-magnify" @click:append="submitSearch" 
                        clear-icon="mdi-close-circle" clearable @click:clear="clearInput" >
                    </v-text-field>
                    <!-- Settings Button -->
                    <v-btn icon class="align-self-start mt-3 px-2 ml-4" color="white"  elevation="0">
                        <v-icon size="25">
                            mdi-cog
                        </v-icon>
                    </v-btn>
                </div>

                <!-- Next Song -->
                <div v-if="showNextSong">
                    <NextSong :imageSrc="next_song.img" 
                        :songName="next_song.name" :songArtist="next_song.artist" :songDuration="next_song.duration_ms" :songVotes="next_song.votes"
                    />
                </div>
                <div class="d-flex" v-else>
                    <p class="text-h5 grey--text mx-auto mt-12 font-weight-bold">Add a song to get started!</p>
                </div>
            </div>

            <!-- Queue items -->
            <div class="align-self-center d-flex flex-column px-3" style="width: 100%; max-width: 50rem; overflow: hidden;">
                <div class="pt-5" style="overflow-y: auto; max-height: calc(100vh - 21em);" v-if="getQueue().length > 0">
                    <QueueItem v-for="(item, index) in getQueue()" :key="item.uri" @upvote-song="upvoteSongUI" @downvote-song="downvoteSongUI"
                        :imageSrc="item.img" :songName="item.name" :songArtist="item.artist" :songDuration="item.duration_ms" :songVotes="item.votes"
                        :upvoted="item.upvoted[id.toString()]" :downvoted="item.downvoted[id.toString()]" :index="index" :song="item"
                    />
                </div>
            </div>

            <!-- Snackbars -->
            <v-snackbar v-model="snackbarExistingSong" :timeout="timeout">Song is already in queue</v-snackbar>
            <v-snackbar v-model="snackbarSongAdded" :timeout="timeout">Song added to queue</v-snackbar>

            <!-- Overlays -->
            <div class="align-self-center">
                <!-- Search -->
                <SearchOverlay @hide-overlay="hideOverlay" @add-song="addSongToQueue"
                    :value="searchDrawerExtended" :searchResults="searchResults"
                />
                <!-- Share -->
                <ShareOverlay @hide-overlay="hideOverlay"
                    :value="shareOverlay" :sessionId="sessionId" :imgSrc="qrcode" :sessionName="sessionName"
                />
            </div>

        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations, mapState} from "vuex"
import {nanoid} from "nanoid"
export default {
    name: 'QueuePage',
    head(){
        return{
            title: this.sessionName
        }
    },
    watchQuery(query){
        if(typeof query.search === 'undefined'){
            if(this.searchDrawerExtended)
                this.hideOverlay()
        }
    },
    data(){
        return{
            host: false,
            currPlaying: "",
            isPlaying: false,
            device: "",
            searchString: "",
            searchResults: [{name: "", duration_ms: 0, uri: "", artists: [{name: ""}], album: {images: [{url: ""}]}}],
            sessionId: this.$route.params.id,
            sessionName: "Your Shared Queue",
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
        const sName = await this.getSessionName(this.sessionId)
        this.sessionName = sName
        this.setSessionName(sName)
        this.next_song = next_song
        this.qrcode = qrcode;
        if(next_song === null){
            this.showNextSong = false
        }else{
            this.showNextSong = true
        }

    },
    methods: {
        ...mapActions(["searchSpotify", "addQueueItem", "voteSong", "restoreSession", "getSessionName"]),
        ...mapGetters(["getSessionId", "getQueue", "getNextSong", "getLocalSessionName"]),
        ...mapMutations(["setSessionId", "addToQueue", "removeFromQueue", "setSessionName"]),
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
                document.documentElement.style.overflow = 'visible';
                document.body.scroll = "no";
                console.log(results.items)
                
            })
            this.$router.push({query: {search: this.searchString}})
        },
        hideOverlay(){
            this.searchDrawerExtended = false
            this.shareOverlay = false
            document.documentElement.style.overflow = 'hidenn';
            document.body.scroll = "no";
            this.$router.push({query: {}})
        },
        setupSocket(){
            this.socket = new WebSocket(process.env.websocketURL)
        
            this.socket.onmessage = async (event) => {
                console.log(event.data)
                if(JSON.parse(event.data).pong){
                    clearTimeout(this.tm)
                }else if(JSON.parse(event.data).update){
                    console.log("update")
                    const {next_song} = await this.restoreSession(this.sessionId)
                    
                    if(next_song === null){
                        this.showNextSong = false
                    }else{
                        this.showNextSong = true
                    }
                    this.next_song = next_song
                    
                }
                    
            }
            this.socket.onopen = async (event) => {
                console.log("OPEN")
                if(this.disconnected){
                    const {next_song} = await this.restoreSession(this.sessionId)
                    if(next_song === null){
                        this.showNextSong = false
                    }else{
                        this.showNextSong = true
                    }
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
                const {next_song} = await this.restoreSession(this.sessionId)
                if(next_song === null){
                    this.showNextSong = false
                }else{
                    this.showNextSong = true
                }
                this.next_song = next_song
            }
            this.lastTime = now
        },
        async addSongToQueue(song){
            this.addQueueItem({session_id: this.sessionId, song_id: song.id, id: this.id}).then(async res => {
                const {next_song} = await this.restoreSession(this.sessionId)
                if(next_song === null){
                    this.showNextSong = false
                }else{
                    this.showNextSong = true
                }
                this.next_song = next_song
                this.snackbarSongAdded = true
            }).catch(async err => {
                const {next_song} = await this.restoreSession(this.sessionId)
                if(next_song === null){
                    this.showNextSong = false
                }else{
                    this.showNextSong = true
                }
                this.next_song = next_song
                this.snackbarExistingSong = true
            })
            
        },
        clearInput(){
            this.searchString = ""
        },
        upvoteSongUI(value){
            let {song, index} = value
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
        downvoteSongUI(value){
            let {song, index} = value
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
        async showShareOverlay(){
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

