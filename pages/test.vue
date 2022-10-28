<template>
  <div class="">
    <v-btn @click="clicker"></v-btn>
    <p>{{toDisplay}}</p>
    <div class="mx-10">

        <NextSong imageSrc="https://e7.pngegg.com/pngimages/363/657/png-clipart-computer-icons-chromatography-50x50-chromatogram-miscellaneous-text.png"
            songName="huen" songArtist="bastard" songDuration="320000" songVotes="2"
        />

        <QueueItem 
            @upvote-song="up" @downvote-song="down" imageSrc="https://e7.pngegg.com/pngimages/363/657/png-clipart-computer-icons-chromatography-50x50-chromatogram-miscellaneous-text.png"
            songName="iolh" songArtist="odighdopgh" songDuration="4075646" songVotes="10" :upvoted="false" :downvoted="true" :index="2" song="test"
        />

        props: ["imageSrc", "songName", "songArtist", "songDuration", "songVotes", "upvoted", "downvoted", "index", "song"],

    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            toDisplay: ""

        }
    },  
    name: 'Test',
    head(){
        return{
            title: "Test"
        }
    },
    methods: {
        clicker(){
            axios.get(process.env.serverURL + "/api/test").then(res => {
                console.log(res)
                console.log("BASE URL: " + process.env.baseURL)
                this.toDisplay = res
            }).catch(err => {
                console.log("BASE URL: " + process.env.baseURL)
                this.toDisplay = err.stack
                console.log(err.stack)
            })
        },
        down(value){
            console.log("down")
            console.log(value)
        },  
        up(value){
            console.log("up")
            console.log(value)
        }
    }
}
</script>

<style>

</style>