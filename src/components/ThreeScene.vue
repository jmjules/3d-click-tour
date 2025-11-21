<template>
  <div ref="container" class="three-container">
    <Overlay 
      @switch-camera="switchToCamera" 
      @previous="handleOverlayEvent('previous')" 
      @next="handleOverlayEvent('next')"
      :current-step="currentStep"
    />

    <div id="testbox"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, computed } from "vue";
import { createScene } from "../three/three-init.ts";
import { extractCamerasFromGLTF, transitionToCamera } from "../three/camera-manager.ts";
import { startAnimationLoop } from "../three/animate-loop.ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Overlay from "./Overlay.vue";
import * as THREE from "three";

// data import
import steps from "@/assets/ui-steps/steps.json"


// -------------------------------------------
// general App State
// -------------------------------------------
// three.js state
const container = ref<HTMLElement | null>(null);
let camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let gltfCameras: THREE.Camera[] = [];
let stopAnimation: (() => void) | null = null;

// step logic state
const currentStepIndex = ref(0);

const currentStep = computed(() => steps[currentStepIndex.value]);




// -------------------------------------------
// lifecycle hooks
// -------------------------------------------
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




// -------------------------------------------
// example ui data
// -------------------------------------------
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

// json wird bei den anderen Imports importiert





// -------------------------------------------
// event callbacks // werden aufgerufen durch events von Overlay-Komponente
// -------------------------------------------

function handleOverlayEvent(action: "next" | "previous") {
  if (action === "next" && currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  } else if (action === "previous" && currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }

  // trigger camera change to match step
  switchToCamera(currentStep.value?.cameraIndex ?? 0);
}



function switchToCamera(index: number) {
  const target = gltfCameras[index];
  if (!target) return;
  const testBox = document.querySelector("#testbox") as HTMLElement | null;
  if (testBox) {
    const bgColor = steps[index]?.bgColor ? steps[index].bgColor : "white"; // fallback color white
    const innerText = steps[index]?.text ? steps[index].text : "fallback text";
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
  top: 500px;
  left: 200px;
}
</style>
