import * as THREE from "three";

export function startAnimationLoop(
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene
) {
  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  return () => cancelAnimationFrame(animationId);
}
