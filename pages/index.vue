<template>
  <div class="d-flex flex-column justify-center align-center mx-auto" style="margin-top: 15vh;">
    <div class="d-flex flex-row">
      
      <img src="../assets/logov3.svg" width="270" height="73" class="mt-md-7 mt-lg-7 mb-15">
    </div>
    <v-btn elevation="2" tile color="white" class="mx-1 align-self-stretch py-7" style="border-radius: 50px; color: black; font-weight: bold; font-size: 0.95rem;" :disabled="bannerVisible" large nuxt to="/create">
        Create Session
    </v-btn>
    <b class="text-center my-8">or</b>
    <div class="ma-auto" style="max-width: 270px">
      <v-otp-input dark :disabled="bannerVisible" length="6" type="number" color="#1ED760" class="pa-0 ma-0" @finish="finishOtp" v-model="otp">

      </v-otp-input>
      <p class="text-caption text-center grey--text">
        Enter Session ID
      </p>
    </div>


    <div class="cookie-banner" v-if="bannerVisible">
      <div class="cookie-consent-banner">
        <div class="cookie-consent-banner__inner mx-5">
          <div class="cookie-consent-banner__copy">
            <div class="cookie-consent-banner__header">THIS WEBSITE USES COOKIES</div>
            <div class="cookie-consent-banner__description">We use cookies to personalise content on this website. No tracking or ads :)
                You consent to our cookies if you continue to use our website.</div>
          </div>

          <div class="cookie-consent-banner__actions d-flex" >
            <v-btn elevation="2" tile color="#1ed760" class="mx-1 align-self-stretch px-10 white--text" style="border-radius: 50px; color: black; font-weight: bold; font-size: 0.95rem;" large @click="bannerVisible = false">
                Ok cool
            </v-btn>
            
            <v-btn elevation="2" tile color="white" class="mx-1 align-self-stretch px-10" style="border-radius: 50px; color: black; font-weight: bold; font-size: 0.95rem;" large @click="bannerVisible = false">
                Decline
            </v-btn>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  
  data(){
    return{
      otp: '',
      bannerVisible: true
    }
  },
  created(){
      if((this.$cookies.get('sharedq-id') !== undefined) || (this.$cookies.get('sharedq-host') !== undefined)){
        this.bannerVisible = false;
      }
  },
  methods: {
    finishOtp(rsp){
      this.$router.push("/queue/"+rsp)
    }
  },
  head(){
    return{
      title: "Home"
    }
  }
}
</script>

<style>
  html{
    overflow-y: auto;
    background-color: #121212;
  }

  .cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2147483645;
  box-sizing: border-box;
  width: 100%;

  background-color: #181818;
}

.cookie-consent-banner__inner {     
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 0;
}

.cookie-consent-banner__copy { 
  margin-bottom: 16px;
}

.cookie-consent-banner__actions {    
}

.cookie-consent-banner__header {
  margin-bottom: 8px;
  
  font-family: "CeraPRO-Bold", sans-serif, arial;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
}

.cookie-consent-banner__description {
  font-family: "CeraPRO-Regular", sans-serif, arial;
  font-weight: normal;
  color: #838F93;
  font-size: 16px;
  line-height: 24px;
}

.cookie-consent-banner__cta {
  box-sizing: border-box;
  display: inline-block;
  min-width: 164px;
  padding: 11px 13px;
    
  border-radius: 2px;
  
  background-color: #2CE080;
   
  color: #FFF;
  text-decoration: none;
  text-align: center;
  font-family: "CeraPRO-Regular", sans-serif, arial;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
}

.cookie-consent-banner__cta--secondary { 
  padding: 9px 13px;
  
  border: 2px solid #3A4649;
  
  background-color: transparent;
  
  color: #2CE080;
}

.cookie-consent-banner__cta:hover {
  background-color: #20BA68;
}

.cookie-consent-banner__cta--secondary:hover {
  border-color: #838F93;
    
  background-color: transparent;
  
  color: #22C870;
}

.cookie-consent-banner__cta:last-child {
  margin-left: 16px;
}
</style>