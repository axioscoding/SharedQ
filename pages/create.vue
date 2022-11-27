<template>
    <div class="d-flex flex-column justify-center align-center ma-auto px-3">
        <div class="d-flex flex-row" style="position: absolute; top: 12vh;">
            <img src="../assets/logov3.svg" width="270" height="73" class="mt-md-7 mt-lg-7 mb-15">
        </div>
        <v-card elevation="0" dark class="py-3" style="border-radius: 10px" color="#181818">
            <v-card-title class="justify-center font-weight-bold white--text text-h5 mb-3">New Queue</v-card-title>
            <v-card-text class="black--text text-left font-weight-normal grey--text text--lighten-1 text-body-1 mb"><p class="pa-0 ma-0 mb-2">1. Connect with spotify</p> <p class="pa-0 ma-0 mb-2">2. Name and Share your Queue</p> <p class="pa-0 ma-0 mb-2">3. Start your party!</p>  </v-card-text>
        </v-card>
        <v-btn elevation="0" tile color="white" class="mx-1 align-self-stretch py-7 mt-8" style="border-radius: 50px; color: black; font-weight: bold;" large @click="spotifyLogin">Connect to Spotify</v-btn>
    </div>
</template>

<script>
export default {
    name: 'CreatePage',
    head(){
        return{
            title: "Create a Queue"
        }
    },
    methods: {
        spotifyLogin(event){
            let resString = "response_type=code&client_id=69d25c690d5b4a00ab63d45e015b5567&scope=user-read-private+user-read-email+streaming+app-remote-control+user-read-playback-state+user-modify-playback-state+user-read-currently-playing+user-top-read";
            resString += "&redirect_uri=" + process.env.baseURL + process.env.redirect_uri
            resString += "&state=" + this.generateRandomString(16)
            console.log(resString)
            window.location.href = 'https://accounts.spotify.com/authorize?' + resString;
        }, generateRandomString(length) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
    }
}
</script>



<style>
    html{
      overflow-y: auto
    }
</style>