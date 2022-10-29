<template>
  <v-overlay :value="value" opacity="0.90" @click="hide">
    <p>Settings</p>
  </v-overlay>
</template>

<script>
export default {
    name: "SettingsOverlay",
    props: ["value"],
    methods: {
        hide(){
            this.$emit("hide-overlay")
        },
    }
}
</script>

<style>

</style>