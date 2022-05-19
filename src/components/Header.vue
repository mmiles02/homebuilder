<template>
  <v-row class="header-background">
    <v-col class="title" style="vertical-align: middle">
      <img src="../assets/house.png" @click="goHome">
      HomeBuilder
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "HeaderPage",

  methods: {
    goHome() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');
.header-background {
  background-color: #8597C1;
  text-align: center;
  padding: 20px;
}
.title {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 38px;
}
img {
  width: 70px;
  vertical-align: middle;
  padding-bottom: 10px
}
img:hover {
  cursor: pointer;
}
</style>