<template>
    <div class="d-flex flex-column justify-center align-center ma-auto px-3">
        <v-card elevation="2" dark outlined tile class="light-green">
            <v-card-title class="justify-center font-weight-bold black--text text-h5">New Queue</v-card-title>
            <v-card-text class="black--text text-center font-weight-normal grey--text text--darken-3 text-body-1">Log into your spotify account to start a new shared queue.</v-card-text>
        </v-card>
        <v-btn elevation="10" tile outlined block color="light-green" class="ma-0 py-8 px-10 text-button" large @click="spotifyLogin" >Spotify Login</v-btn>
    </div>
</template>

<script>
export default {
    
    methods: {
        spotifyLogin(event){
            let resString = "response_type=code&client_id=69d25c690d5b4a00ab63d45e015b5567&scope=user-read-private+user-read-email+streaming+app-remote-control+user-read-playback-state+user-modify-playback-state+user-read-currently-playing+user-top-read";
            resString += "&redirect_uri=http://localhost:3000/queue";
            resString += "&state=" + this.generateRandomString(16)
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