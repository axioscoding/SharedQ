<template>
    <v-overlay :value="value" opacity="0.90" @click="hide">
        <div style="overflow-y: scroll; max-height: 85vh; max-width: 100vw;" class="ma-auto">
            <div v-for="item in searchResults" :key="item.uri">
                <v-btn @click="addSongToQueue(item)" style="height: 6rem; width: 100%; max-width: 100vw;" class="pa-4" tile>
                    <div class="d-flex flex-row align-stretch" style="width: 100%; max-width: 100vw; overflow: hidden;">
                        <v-img :lazy-src="item.album.images[0].url" max-height="4rem" max-width="4rem" :src="item.album.images[0].url" class="mr-8"></v-img>
                        <div class="d-flex flex-column align-start mr-8" >
                                <h4 class="text-h6 text-capitalize ma-0" style="overflow: hidden; max-width: 50vw; text-overflow: ellipsis; white-space: nowrap;">{{item.name}}</h4>
                                <p class="text-body-2 text-capitalize font-weight-light ma-0">{{item.artists[0].name}}</p>
                        </div>
                        <p class="align-self-end float-right ml-auto">{{millisToMinutesAndSeconds(item.duration_ms)}}</p>
                    </div>
                </v-btn>
            </div>
        </div>
    </v-overlay>
</template>

<script>
import millisToMinutesAndSeconds from "../common/functions.js"
export default {
    name: "SearchOverlay",
    props: ["value", "searchResults"],
    methods: {
        millisToMinutesAndSeconds,
        hide(){
            this.$emit("hide-overlay")
        },
        addSongToQueue(song){
            this.$emit("add-song", song)
        }
    }
}
</script>

<style>

</style>