<template>
  <div ref="container" class="three-container">
    <Overlay @switch-camera="switchToCamera"/>

    <div id="testbox"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { createScene } from "../three/three-init.ts";
import { extractCamerasFromGLTF, transitionToCamera } from "../three/camera-manager.ts";
import { startAnimationLoop } from "../three/animate-loop.ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Overlay from "./Overlay.vue";
import * as THREE from "three";

const container = ref<HTMLElement | null>(null);
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let gltfCameras: THREE.Camera[] = [];
let stopAnimation: (() => void) | null = null;

onMounted(() => {
  if (!container.value) return;
  ({ scene, camera, renderer } = createScene(container.value));
  loadModel();
  stopAnimation = startAnimationLoop(camera, renderer, scene);
});

onBeforeUnmount(() => {
  stopAnimation?.();
  renderer.dispose();
});

function loadModel() {
  const loader = new GLTFLoader();
  loader.load("/assets/scene.gltf", (gltf) => {
    scene.add(gltf.scene);
    gltfCameras = extractCamerasFromGLTF(gltf.scene);
  });
}


const jsonData = {
  camera1: "green",
  camera2: "blue",
  camera3: "red",
}

const testArray = [
  {
   text: "Hier ist Text für Kamera 1.",
   bgColor: "green",
  },
  {
   text: "Hier ist Text für Kamera 2.",
   bgColor: "blue",
  },
  {
   text: "Hier ist Text für Kamera 3.",
   bgColor: "red",
  },
]


function switchToCamera(index: number) {
  const target = gltfCameras[index];
  if (!target) return;
  const testBox = document.querySelector("#testbox") as HTMLElement | null;
  if (testBox) {
    const bgColor = testArray[index]?.bgColor ? testArray[index].bgColor : "white"; // fallback color white
    const innerText = testArray[index]?.text ? testArray[index].text : "fallback text";
    testBox.style.backgroundColor = bgColor;
    testBox.innerText = innerText;
  }
  transitionToCamera(camera, target, renderer, scene);
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#testbox {
  width: 5rem;
  aspect-ratio: 1;
  background-color: white;
  position: absolute;
  top: 100px;
  left: 20px;
}
</style>
