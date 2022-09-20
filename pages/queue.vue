<template>
  <div class="ma-auto px-3">
      <p v-if="$fetchState.pending">Loading...</p>
      <p v-else-if="$fetchState.error">An Error Occurred</p>
      <div class="d-flex flex-column justify-center align-center" v-else>
        <div class="light-green align-center">
          <p class="black--text text-center font-weight-normal grey--text text--darken-3 text-h6 pb-1 mx-7 px-4 pt-4">You created a new shared Queue! <br /> Invite your friends:</p>
          <v-text-field @click="$event.target.select()" readonly filled single-line outlined tile 
          class="text-center centered-input mx-7 my-0 py-0 pa-0 black--text" color="grey" :value="link_queue + session_id"
          :append-icon="copy_icon ? 'mdi-content-copy' : 'mdi-check'" @click:append="copyLink" dark ref="link_field"></v-text-field>

          
        </div>
        <v-btn elevation="10" tile outlined block color="light-green" class="ma-0 py-8 px-10 text-button" large nuxt :to="'/queue/' + session_id" >Let's go!</v-btn>
        <v-snackbar v-model="snackbar" :timeout="timeout">Copied to clipboard</v-snackbar>
      </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"
export default {
  name: "SharedQueue",
  data(){
      return{
          access_token: "",
          redir: false,
          title: "Loading",
          socket: null,
          session_id: null,
          show_overlay: this.session_id !== null,
          link_queue: "http://localhost:3000/queue/",
          copy_icon: true,
          snackbar: false,
          timeout: 2000
      }
  },  
  async fetch(){
      const cookie = this.$cookies.get("sharedq-spotify-auth-token")
      if(cookie === undefined){
        if(this.getToken() === null){
          if(this.$route.query.code){
            this.access_token = await this.fetchToken(this.$route.query.code)
            this.$cookies.set("sharedq-spotify-auth-token", this.access_token, {maxAge: 3600})
            this.session_id = await this.createSession()
            this.$cookies.set("shareedq-session-id", this.session_id, {maxAge: 3600})
          } else this.redir = true
        }else{
          this.$cookies.set("sharedq-spotify-auth-token", this.getToken(), {maxAge: 3600})
        }
      }else{
        if(this.getToken() === null){
            this.setToken(cookie)
            this.access_token = cookie
        }
        if(this.$cookies.get("shareedq-session-id") === undefined){
           this.session_id = await this.createSession()
            this.$cookies.set("shareedq-session-id", this.session_id, {maxAge: 3600})
        }else{
            if(this.getSessionId() === null){
                this.setSessionId(this.$cookies.get("shareedq-session-id"))
                this.session_id = this.$cookies.get("shareedq-session-id")
            }
        }
      }
        
        
  },
  methods: {
      ...mapActions(["fetchToken", "searchSpotify", "createSession"]),
      ...mapGetters(["getToken", "getSessionId"]),
      ...mapMutations(["setToken", "setSessionId"]),
      doSearch(){
          const res = this.searchSpotify("yung lean")
      },
      copyLink(){
        this.copy_icon = !this.copy_icon
        navigator.clipboard.writeText(this.link_queue + this.session_id)
        this.snackbar = true
      }
  },
  mounted(){
    if(this.redir) this.$router.push("/create")
    else {
        this.title = "Your shared Queue"   
    }
  },
  head(){
    return{
      title: this.title
    }
  }
}
</script>

<style scoped>
.centered-input :deep(input) {
    text-align: center;
    color: black;
}

</style>