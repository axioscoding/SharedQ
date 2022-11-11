<template>
  <v-overlay :value="value" opacity="0.90">
      <div class="align-center" style="background-color: #181818; border-radius: 10px;" >
          <div class="d-flex justify-end" style="width: 100%;">
              <v-btn icon small class="align-self-end justify-self-end mt-3 mr-3 mb-0 pa-0" @click="hide"><v-icon>mdi-close-circle</v-icon></v-btn>
          </div>
              
          <p class="text-center font-weight-bold white--text text-h5 pb-1 mx-5 px-4 pt-0 mt-0 mb-9">Settings</p>
          

          <p class="text-center font-weight-normal white--text ma-0 pa-0 text-body-1 font-weight-bold" style="font-size: 18px !important;">Downvotes to kick a song</p>

          <v-slider
            class="mx-5"
            style="font-size: 14px; font-weight: bold;"
            v-model="kickSongValue"
            :tick-labels="ticksLabels"
            :max="4"
            step="1"
            color="#1ed760"
          ></v-slider>

          <div class="d-flex justify-center align-center my-5 mb-10 mx-9 mt-10">
              <v-btn id="button1" elevation="0" style="background-color: transparent; color: white; border: 2px solid white;" class="ma-0 pa-6 text-button mb-10" rounded @click="buttonEvent">{{this.buttonState === 1 ? 'Delete Queue?' : 'Are you sure?'}}<v-icon class="ml-3">mdi-delete-forever-outline</v-icon></v-btn>
          </div>
      </div>
  </v-overlay>
</template>

<script>
import {mapActions} from "vuex"
export default {
    name: "SettingsOverlay",
    props: ["value", "sessionId"],
    data(){
      return{
        buttonState: 1,
        kickSongValue: 0,
        ticksLabels: [
          "Off",
          "2",
          "3",
          "5",
          "10"
        ]
      }
    },
    methods: {
      ...mapActions(["deleteQueue"]),
        hide(){
          this.buttonState = 1;
            this.$emit("hide-overlay");
        },
        buttonEvent(){
          switch(this.buttonState){
            case 1:
              this.buttonState = 2
              break;
            case 2:
              this.deleteQueue(this.$props.sessionId);
              break;
            default:
          }
        }
    }
}
</script>

<style>

.v-slider--horizontal .v-slider__track-container{
  height: 5px !important;
}

.v-slider__tick-label{
  margin-top: 0.3em;
}



</style>