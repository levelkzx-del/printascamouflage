import { Environment, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { Book } from "./Book";
import { brightnessAtom } from "./UI";

const CameraKeyboardPan = ({ controlsRef }) => {
  const { camera } = useThree();
  const pressedKeys = useRef(new Set());
  const initialCameraPosition = useRef(null);
  const initialTarget = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    initialCameraPosition.current = camera.position.clone();
    if (controlsRef.current) {
      initialTarget.current = controlsRef.current.target.clone();
    }

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.add(key);
      }
    };
    const handleKeyUp = (event) => {
      pressedKeys.current.delete(event.key.toLowerCase());
    };
    const handleResetCamera = () => {
      if (!initialCameraPosition.current || !controlsRef.current) {
        return;
      }
      camera.position.copy(initialCameraPosition.current);
      controlsRef.current.target.copy(initialTarget.current);
      controlsRef.current.update();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("reset-book-camera", handleResetCamera);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("reset-book-camera", handleResetCamera);
    };
  }, [camera, controlsRef]);

  useFrame((_, delta) => {
    if (!controlsRef.current || pressedKeys.current.size === 0) {
      return;
    }

    const move = new Vector3();
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const speed = 1.75;

    if (pressedKeys.current.has("a")) move.sub(right);
    if (pressedKeys.current.has("d")) move.add(right);
    if (pressedKeys.current.has("w")) move.add(up);
    if (pressedKeys.current.has("s")) move.sub(up);

    if (move.lengthSq() === 0) {
      return;
    }

    move.normalize().multiplyScalar(speed * delta);
    camera.position.add(move);
    controlsRef.current.target.add(move);
    controlsRef.current.update();
  });

  return null;
};

export const Experience = () => {
  const controlsRef = useRef();
  const [brightness] = useAtom(brightnessAtom);

  return (
    <>
      <group>
        <Book />
      </group>
      <OrbitControls ref={controlsRef} />
      <CameraKeyboardPan controlsRef={controlsRef} />
      <Environment preset="studio" environmentIntensity={brightness}></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
