<template>
    <div class="d-flex flex-column justify-center align-center ma-auto" style="margin-top: 30vh">
      <div class="d-flex flex-row ma-auto" style="position: absolute; top: 12vh;">
        
        <img src="../assets/logo3.svg" width="70" height="70">
        <p class="text-h3 ma-0 pa-0 mt-4 ml-5" style="color:#1ed760;">SharedQ</p>
      </div>
      <p class="text-h5 font-weight-bold align-center ma-auto text-center mx-7">Somehow you fucked up and ended up here. <br /><br /> ¯\_(ツ)_/¯</p>
      <div class="d-flex justify-center align-center my-5 mb-10 mt-10">
          <v-btn elevation="0" style="background-color: transparent; color: white; border: 2px solid white;" class="ma-0 pa-6 text-button" nuxt to="/" rounded click="copyLink">Start a new Queue!</v-btn>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  
  }
  </script>
  
  <style>
  
  </style>