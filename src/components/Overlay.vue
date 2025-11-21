<template>
  <div class="overlay">
    <button @click="onCamera(0)">Camera 1</button>
    <button @click="onCamera(1)">Camera 2</button>
    <button @click="onCamera(2)">Camera 3</button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["switch-camera"]);

function onCamera(i: number) {
  emit("switch-camera", i);
}
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 100;
}
</style>
