<template>
  
    <div>     
        <div class="d-flex flex-row align-stretch ma-2" style="overflow: hidden;">
            <v-img :lazy-src="imageSrc" max-height="4rem" max-width="4rem" :src="imageSrc" class="mr-4 my-2 ml-2"></v-img>
            <div class="d-flex flex-column align-start mr-4 mt-3">
                <p class="text-h6 text-capitalize ma-0 py-0" style="overflow: hidden; max-width: 35vw; text-overflow: ellipsis; white-space: nowrap;">{{songName}}</p>
                <p class="text-body-2 text-capitalize py-0 font-weight-light ma-0">{{songArtist}}</p>
            </div>
            <p class="align-self-end text-body-1 ml-auto mr-3">{{millisToMinutesAndSeconds(songDuration)}}</p>
            <v-divider vertical></v-divider>
            <div class="d-flex flex-column justify-space-between ml-2">
                <v-btn icon small :plain="!upvoted" :color="upvoted ? '#1ED760' : 'white'" @click="upvote(song, index)"> <v-icon>mdi-chevron-up</v-icon> </v-btn>
                <p class="my-0 mx-auto pa-0">{{songVotes}}</p>
                <v-btn icon small :plain="!downvoted" :color="downvoted ? 'red darken-3' : 'white'"  @click="downvote(song, index)"><v-icon>mdi-chevron-down</v-icon> </v-btn>
            </div>
        </div>
        <v-divider></v-divider>
    </div>
</template>

<script>
import millisToMinutesAndSeconds from "../common/functions.js"
export default {
    name: "QueueItem",
    props: ["imageSrc", "songName", "songArtist", "songDuration", "songVotes", "upvoted", "downvoted", "index", "song"],
    methods: {
        millisToMinutesAndSeconds,
        upvote(song, index){
            this.$emit("upvote-song", {song, index})
        },
        downvote(song, index){
            this.$emit("downvote-song", {song, index})
        }
    }
}
</script>

<style>

</style>