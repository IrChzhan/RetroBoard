<template>
  <div id="app">
    <SpaceScene />
    <div class="divider"></div>
    <Toolbar />
  </div>
</template>

<script setup>
import SpaceScene from '../components/SpaceScene.vue'
import Toolbar from '../components/ToolBar.vue'
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/space.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
  position: relative;
  user-select: none;
}

.divider {
  position: absolute;
  bottom: 100px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  box-shadow: 0 0 10px rgba(100, 149, 237, 0.7);
}
</style>
