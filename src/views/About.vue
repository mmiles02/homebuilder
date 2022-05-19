<template>
  <v-row class="standard-text" v-if="!locked">
    <v-col>
      <v-row>
        <v-col>
          <Header/>
        </v-col>
      </v-row>

      <v-row>
        <v-col align="center">
          <h3 style="width: 700px; padding-top: 50px">
            Hello Hannah Flanders. Welcome to your own building experience.
            I know you love to plan, and sometimes that can be difficult especially when you have never been inside of our new apartment.
            I decided to give you the ability to get as close to customizing our place as you can get without actually being inside of it.
          </h3>
          <br>
          <h3 style="width: 700px;">
            In this builder, you will have the ability to add a bunch of different types of furniture to our new apartment to test for fitting,
            style, and other things that may float your boat.
            If you want me to add furniture, just find a birds eye view of it and send it to me and I can put it in.
            If you find any issues with the builder, let me know and I will fix it ASAP.
            I love you and happy building ♡.
          </h3>
          <br>
          <h3 style="width: 700px;">
            When you are ready, click <strong>BEGIN</strong> down below to start.
          </h3>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn x-large style="background-color: #8597C1; color: white" @click="enterBuilder">
            begin
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'AboutPage',

  mounted: async function() {
    if (this.locked) {
      this.$router.push({ name: 'home' })
    }
  },

  components: {
    Header
  },

  props: {
    locked: {
      type: Boolean,
      default: true,
      required: true
    }
  },

  methods: {
    enterBuilder() {
      this.$router.push({ name: 'builder', params: { locked: false } })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');
.standard-text {
  font-family: 'Quicksand', sans-serif;
}
</style>