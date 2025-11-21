import * as THREE from "three";

export function createScene(container: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  const width = container.clientWidth;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(2, 2, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lights
  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(3, 5, 2);
  scene.add(dirLight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  return { scene, camera, renderer };
}
