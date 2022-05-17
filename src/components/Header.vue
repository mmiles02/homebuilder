<template>
  <v-row class="header-background">
    <v-col class="title" style="vertical-align: middle">
      <img src="../assets/house.png">
      HomeBuilder
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "HeaderPage"
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
</style>