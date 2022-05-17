<template>
  <div style="position: absolute">
    <img src="../assets/logo.png" :height="height" :width="width" draggable="false">
  </div>
</template>

<script>
export default {
  name: 'CouchAsset',

  props: {
    height: Number,
    width: Number
  }
}
</script>

<style scoped>

</style>