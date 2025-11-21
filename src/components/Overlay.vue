<template>
  <div class="overlay">
    <div class="title">Title text</div>
    <div class="body-text">Here is some body text</div>
    <div>
      <button @click="emit('previous')">Back</button>
      <button @click="emit('next')">Next</button>
    </div>
    <br>
    <br>
    <br>
    <hr>
    <div>
      <button @click="onCamera(0)">Camera 1</button>
      <button @click="onCamera(1)">Camera 2</button>
      <button @click="onCamera(2)">Camera 3</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["switch-camera", "previous", "next"]);

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
  flex-direction: column;
  gap: 10px;
  z-index: 100;
  padding: 1rem;

  background-color: blanchedalmond;
}

.title {
  font-size: larger;
  font-weight: bold;
}
</style>
