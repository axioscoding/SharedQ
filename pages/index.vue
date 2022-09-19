<template>
  <div class="d-flex flex-column justify-center align-center ma-auto">
    <v-btn elevation="2" tile outlined color="light-green" class="mx-1 align-self-stretch py-7" large nuxt to="/create">
        Create Session
    </v-btn>
    <b class="text-center my-8">or</b>
    <div class="ma-auto" style="max-width: 270px">
      <v-otp-input dark length="6" type="text" color="light-green" class="pa-0 ma-0" max-width="250">

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
  head(){
    return{
      title: "Home"
    }
  }
}
</script>

<style>
  html{
    overflow-y: auto
  }
</style>