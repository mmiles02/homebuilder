<template>
  <div style="position: absolute">
    <img src="../assets/logo.png" :style="'transform: rotate(' + rotate + 'deg)'" :height="height" :width="width" draggable="false">
  </div>
</template>

<script>
export default {
  name: 'CouchAsset',

  props: {
    height: Number,
    width: Number,
    rotate: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
</style>