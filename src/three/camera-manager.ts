import * as THREE from "three";

const _startPos = new THREE.Vector3();
const _endPos = new THREE.Vector3();
const _startQuat = new THREE.Quaternion();
const _endQuat = new THREE.Quaternion();

let isTransitioning = false;

export function extractCamerasFromGLTF(scene: THREE.Object3D): THREE.Camera[] {
  const cameras: THREE.Camera[] = [];
  scene.traverse(obj => {
    if ((obj as any).isCamera) cameras.push(obj as THREE.Camera);
  });
  return cameras;
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function transitionToCamera(
  camera: THREE.Camera,
  target: THREE.Object3D,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  duration = 1.2,
  onComplete?: () => void
) {
  if (!camera) return;

  _startPos.copy(camera.position);
  _startQuat.copy(camera.quaternion);

  target.getWorldPosition(_endPos);
  target.getWorldQuaternion(_endQuat);

  let startTime: number | null = null;

  function step(ts: number) {
    if (startTime === null) startTime = ts;

    const elapsed = (ts - startTime) / 1000;
    const t = Math.min(elapsed / duration, 1);
    const e = easeInOut(t);

    camera.position.lerpVectors(_startPos, _endPos, e);
    camera.quaternion.slerpQuaternions(_startQuat, _endQuat, e);

    renderer.render(scene, camera);

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // finalize
      camera.position.copy(_endPos);
      camera.quaternion.copy(_endQuat);

      if (onComplete) onComplete(); // unlock buttons in parent
    }
  }

  requestAnimationFrame(step);
}


