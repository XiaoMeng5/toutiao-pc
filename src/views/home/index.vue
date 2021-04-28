<template>
  <div class="home-container">
    <video src="./images/" autoplay loop muted></video>
  </div>
</template>

<script>
export default {
  data () {
    return {
      created () {}
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  width: 100%;
  height: 100%;
  background: url('./images/welcome.jpg') no-repeat;
  background-position: center;
}
</style>
