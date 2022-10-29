<template>
        <v-overlay :value="value" opacity="0.90" @click="hide">
            
            <div class="d-flex flex-column justify-center align-center">
                    
                <div class="align-center" style="background-color: #181818; border-radius: 10px;" >
                    <div class="d-flex justify-end" style="width: 100%;">
                        <v-btn icon small class="align-self-end justify-self-end mt-3 mr-3 mb-0 pa-0"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </div>
                    
                <p class="black--text text-center font-weight-normal white--text text-h6 pb-1 mx-5 px-4 pt-0 mt-0">{{sessionName}}</p>
                
                <v-img :src="imgSrc" max-height="10rem" max-width="10rem" class="align-self-center mx-auto mb-5" style="border-radius: 10px;"></v-img>

                <div class="ma-auto d-flex align-center px-5" style="max-width: 270px">
                    <v-otp-input dark length="6" type="number" color="#1ED760" class="pa-0 ma-0" disabled v-model="sessionId">

                    </v-otp-input>
                </div>
                <div class="d-flex justify-center align-center my-5 mb-10">
                    <v-btn elevation="0" style="background-color: transparent; color: white; border: 2px solid white;" class="ma-0 pa-6 text-button" rounded click="copyLink">Copy Link<v-icon small class="ml-3">mdi-content-copy</v-icon></v-btn>
                </div>
                </div>

                
            </div>
        </v-overlay>
</template>

<script>

export default {
    name: "ShareOverlay",
    props: ["value", "sessionId", "imgSrc", "sessionName"],
    methods: {
        hide(){
            this.$emit("hide-overlay")
        }
    },
    data(){
        return{
            name: ""
        }
    }
}
</script>

<style>

</style>