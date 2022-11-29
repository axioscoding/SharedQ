<template>
    <v-overlay :value="value" opacity="0.90">
        <div class="d-flex flex-column justify-center align-center">
                
            <div class="align-center" style="background-color: #181818; border-radius: 10px;" >
                <div class="d-flex justify-end" style="width: 100%;">
                    <v-btn icon small class="align-self-end justify-self-end mt-3 mr-3 mb-0 pa-0" @click="hide"><v-icon>mdi-close-circle</v-icon></v-btn>
                </div>
                
            <p class="black--text text-center font-weight-bold white--text text-h5 pb-1 mx-5 px-4 pt-0 mt-0">{{sessionName}}</p>
            
            
            <div id="qrcode" ref="qrcode" max-height="10rem" max-width="10rem" class="align-self-center mx-auto my-10 d-flex justify-center"></div>

            <div class="ma-auto d-flex align-center px-5" style="max-width: 270px">
                <v-otp-input dark length="6" type="number" color="#1ED760" class="pa-0 ma-0" disabled v-model="sessionId">

                </v-otp-input>
            </div>
            <div class="d-flex justify-center align-center my-5 mb-10">
                <v-btn elevation="0" style="background-color: transparent; color: white; border: 2px solid white;" class="ma-0 pa-6 text-button" rounded @click="copyLink">Copy Link<v-icon small class="ml-3">mdi-content-copy</v-icon></v-btn>
            </div>
            </div>
            <v-snackbar v-model="snackbar" :timeout="timeout">Copied to clipboard</v-snackbar>
            
        </div>
    </v-overlay>
</template>

<script>

const baseURL = process.env.baseURL;

let QRCodeStyling, qrCode;

export default {
    name: "ShareOverlay",
    props: ["value", "sessionId", "imgSrc", "sessionName"],
    methods: {
        hide(){
            this.$emit("hide-overlay")
        },
        copyLink(){
            console.log("COPY_LINK")
            this.copy_icon = !this.copy_icon
            navigator.clipboard.writeText(process.env.baseURL + this.$route.path)
            this.snackbar = true
        },
    },
    data(){
        return{
            name: "",
            snackbar: false,
            copy_icon: true,
            timeout: 2000
        }
    },
    async mounted(){
            QRCodeStyling = await import('qr-code-styling')
            console.log(baseURL + this.$route.path)
            qrCode = new QRCodeStyling.default({
                width: 200,
                height: 200,
                type: "svg",
                data: baseURL + this.$route.path,
                image: "/logov3.png",
                dotsOptions: {
                    color: "#1ed760",
                    type: "dots"
                },
                cornersSquareOptions: {
                    type: "extra-rounded"
                },
                cornersDotOptions: {
                    type: "dot"
                },
                backgroundOptions: {
                    color: "#181818"
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 7
                }
            })
            qrCode.append(this.$refs.qrcode)
    },
    updated(){
        qrCode.append(this.$refs.qrcode)
    }
}
</script>

<style>

</style>