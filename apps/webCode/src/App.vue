<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

export default {
    name: 'App',
}
</script>

<style lang="scss" scoped>
#app {
  /* font-family: 'Comic Sans MS', cursive, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  margin: 0;
}
</style>
