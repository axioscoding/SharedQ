<template>
    <v-card style="border-radius: 10px;" class="mt-n2">
        <v-card-title class="pa-2 ml-2">Next Song:</v-card-title>
        <v-divider></v-divider>
        <div class="d-flex flex-row align-stretch py-2">
            <v-img :lazy-src="imageSrc" max-height="4rem" max-width="4rem" :src="imageSrc" class="my-2 ml-4"></v-img>
            <div class="d-flex flex-column align-start mr-4 mt-3">
                <v-card-text class="text-h6 text-capitalize ma-0 py-0" style="overflow: hidden; max-width: 50vw; text-overflow: ellipsis; white-space: nowrap;">{{songName}}</v-card-text>
                <v-card-text class="text-body-2 text-capitalize py-0 font-weight-light ma-0">{{songArtist}}</v-card-text>
            </div>
            <p class=" ma-0 pa-0 mt-6 align-self-center text-body-1 ml-auto mr-4">{{millisToMinutesAndSeconds(songDuration)}}</p>
            <v-divider vertical></v-divider>
            <p class="ma-0 pa-0 align-self-center mx-4">{{songVotes}}</p>
        </div>
    </v-card>
</template>

<script>
import millisToMinutesAndSeconds from "../common/functions.js"
export default {
    name: "NextSong",
    props: ["imageSrc", "songName", "songArtist", "songDuration", "songVotes"],
    methods: {
        millisToMinutesAndSeconds
    }
}
</script>

<style>

</style>