<template>
  <div id="app">
    <Weather />
  </div>
</template>

<script>
import Weather from './components/Weather.vue';

export default {
  name: 'app',
  components: {
    Weather,
  },
}
</script>

<style>
html {
  position: relative;
  min-height: 100%;
}
body{
  height: 100vh;
}
#app {
  position: relative;
  min-height: 100%;
  min-width: 490px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
