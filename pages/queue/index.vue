<template>
  <div class="ma-auto px-3">
    
    <p v-if="$fetchState.pending">Loading...</p>
      <p v-else-if="$fetchState.error">An Error Occurred</p>
      
      <div class="d-flex flex-column justify-center align-center" v-else>
        <div class="d-flex flex-row" style="position: absolute; top: 5vh;">
          <img src="../../assets/logo3.svg" width="70" height="70">
          <p class="text-h3 ma-0 pa-0 mt-4 ml-5" style="color:#1ed760;">SharedQ</p>
        </div>
        <div class="align-center" style="background-color: #181818; border-radius: 10px;" >
          <p class="black--text text-center font-weight-normal white--text text-h6 pb-1 mx-5 px-4 pt-4 mt-5">Name & share your Queue</p>
          
          <v-text-field filled single-line rounded
          class="text-center centered-input mx-6 mt-10 my-0 py-0 pa-0 white--text custom-placeholer-color" color="white"
          dark ref="name_field" placeholder="Name your queue!"
          @submit="setName" @keydown.enter="setName" @click:append="setName"
          :disabled="disabledText" v-model="nameString" maxlength="30" counter
          >
          </v-text-field>


          <div class="ma-auto d-flex align-center" style="max-width: 270px">
            <v-otp-input dark length="6" type="number" color="#1ED760" class="pa-0 ma-0" disabled v-model="session_id">

            </v-otp-input>
          </div>
          <div class="d-flex justify-center align-center my-5 mb-10">
            <v-btn elevation="0" style="background-color: transparent; color: white; border: 2px solid white;" class="ma-0 pa-6 text-button" rounded @click="copyLink">Copy Link<v-icon class="ml-3">mdi-content-copy</v-icon></v-btn>
          </div>

          
        </div>
        <v-btn elevation="10" rounded block color="#1ED760" class="ma-0 mt-7 py-7 px-10 text-button" large @click="changeSite" >Let's party!</v-btn>
        <v-snackbar v-model="snackbar" :timeout="timeout">Copied to clipboard</v-snackbar>
        <v-snackbar v-model="snackbarChangedName" :timeout="timeout">Name set!</v-snackbar>
        
      </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"
export default {
  name: "SharedQueue",
  data(){
      return{
          redir: false,
          redir_link: "/create",
          title: "Loading",
          session_id: null,
          link_queue: process.env.baseURL + "/queue/",
          copy_icon: true,
          snackbar: false,
          snackbarChangedName: false,
          nameString: "",
          disabledText: false,
          timeout: 2000
      }
  },  
  async fetch(){
    
      if(this.getSessionId() === null){
          if(this.$route.query.code){
              const {auth_token, refresh_token} = await this.fetchToken(this.$route.query.code)
              this.session_id = await this.createSession({auth_token, refresh_token})
          }else{
              this.redir_link = "/queue/" + this.getSessionId()
              this.redir = true
          }
      }else{
          this.redir = true
      }
      
  },
  methods: {
      ...mapActions(["fetchToken", "createSession", "changeSessionName"]),
      ...mapGetters(["getSessionId"]),
      ...mapMutations(["setSessionId"]),
      copyLink(){
        console.log("COPY_LINK")
        this.copy_icon = !this.copy_icon
        navigator.clipboard.writeText(this.link_queue + this.session_id)
        this.snackbar = true
      },
      changeSite(){
        if(this.nameString.length > 0){
          this.changeSessionName({session_id: this.session_id, name: this.nameString}).then(res => {
            this.$router.push("/queue/" + this.session_id)
          }).catch(err => {
            this.$router.push("/queue/" + this.session_id)
          })
        }else{
          this.$router.push("/queue/" + this.session_id)
        }
        
      },
      setName(){
        this.changeSessionName({session_id: this.session_id, name: this.nameString})
        this.disabledText = true
        this.snackbarChangedName = true
      }
  },
  mounted(){
    
    if(this.redir) this.$router.push(this.redir_link)
    else {
        this.title = "Name & Share your Queue"   
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
    color: white;
}
.centered-input :deep(input::placeholder) {
    color: #7d7d7d;
}


</style>

<style>
html{
      overflow-y: hidden;
      background-color: #121212;
    }
</style>

