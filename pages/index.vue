<template>
  <div class="d-flex flex-column justify-center align-center ma-auto">
    <div class="d-flex flex-row" style="position: absolute; top: 12vh;">
      <img src="../assets/logo3.svg" width="70" height="70">
      <p class="text-h3 ma-0 pa-0 mt-4 ml-5" style="color:#1ed760;">SharedQ</p>
    </div>
    <v-btn elevation="2" tile color="white" class="mx-1 align-self-stretch py-7" style="border-radius: 50px; color: black; font-weight: bold; font-size: 0.95rem;" large nuxt to="/create">
        Create Session
    </v-btn>
    <b class="text-center my-8">or</b>
    <div class="ma-auto" style="max-width: 270px">
      <v-otp-input dark length="6" type="number" color="#1ED760" class="pa-0 ma-0" @finish="finishOtp" v-model="otp">

      </v-otp-input>
      <p class="text-caption text-center grey--text">
        Enter Session ID
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data(){
    return{
      otp: ''
    }
  },
  methods: {
    finishOtp(rsp){
      this.$router.push("/queue/"+rsp)
    }
  },
  head(){
    return{
      title: "Home"
    }
  }
}
</script>

<style>
  html{
    overflow-y: auto;
    background-color: #121212;
  }
</style>