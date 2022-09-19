<template>
  <div class="">
      <p v-if="$fetchState.pending">Loading...</p>
      <p v-else-if="$fetchState.error">An Error Occurred</p>
      <div class="" v-else>
          <p> {{access_token}}</p>
          <v-btn @click="doSearch"></v-btn>
          <p>{{message}}</p>
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
          message: ""
      }
  },  
  async fetch(){
      const cookie = this.$cookies.get("sharedq-spotify-auth-token")
      if(cookie === undefined){
        if(this.getToken() === null){
          if(this.$route.query.code){
            this.access_token = await this.fetchToken(this.$route.query.code)
            this.$cookies.set("sharedq-spotify-auth-token", this.access_token, {maxAge: 3600})
          } else this.redir = true
        }else{
          this.$cookies.set("sharedq-spotify-auth-token", this.getToken(), {maxAge: 3600})
        }
      }else{
        if(this.getToken() === null){
            this.setToken(cookie)
            this.access_token = cookie
        }
      }
        
        
  },
  methods: {
      ...mapActions(["fetchToken", "searchSpotify"]),
      ...mapGetters(["getToken"]),
      ...mapMutations(["setToken"]),
      doSearch(){
          const res = this.searchSpotify("yung lean")
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

<style>

</style>