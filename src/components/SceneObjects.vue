<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import * as THREE from 'three';

const props = defineProps<{
  scene: THREE.Scene | null;
}>();

let cube: THREE.Mesh | null = null;
let torus: THREE.Mesh | null = null;

const createObjects = () => {
  if (!props.scene) return;

  // Cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    metalness: 0.3,
    roughness: 0.4,
  });
  cube = new THREE.Mesh(geometry, material);
  props.scene.add(cube);

  // Torus
  const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    metalness: 0.5,
    roughness: 0.3,
  });
  torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.x = -2;
  props.scene.add(torus);
};

const animate = () => {
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  if (torus) {
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.01;
  }

  requestAnimationFrame(animate);
};

watch(() => props.scene, (newScene) => {
  if (newScene) {
    createObjects();
    animate();
  }
}, { immediate: true });
</script>
