import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, MathUtils } from "three";
import { Text } from "@react-three/drei";

interface DiceProps {
  value: number;
  isRolling: boolean;
}

const DiceMesh = ({ value, isRolling }: DiceProps) => {
  const meshRef = useRef<Mesh>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  // Define dice face rotations for each value
  const faceRotations = {
    1: { x: 0, y: 0, z: 0 },
    2: { x: 0, y: Math.PI / 2, z: 0 },
    3: { x: -Math.PI / 2, y: 0, z: 0 },
    4: { x: Math.PI / 2, y: 0, z: 0 },
    5: { x: 0, y: -Math.PI / 2, z: Math.PI },
    6: { x: Math.PI, y: 0, z: Math.PI },
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isRolling) {
      meshRef.current.rotation.x += delta * 5;
      meshRef.current.rotation.y += delta * 3;
      meshRef.current.rotation.z += delta * 4;
    } else {
      // Smoothly transition to the target rotation for the current value
      const targetRotation = faceRotations[value as keyof typeof faceRotations];
      meshRef.current.rotation.x = MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.x,
        0.1
      );
      meshRef.current.rotation.y = MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation.y,
        0.1
      );
      meshRef.current.rotation.z = MathUtils.lerp(
        meshRef.current.rotation.z,
        targetRotation.z,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
      {/* Dice Numbers */}
      {[1, 2, 3, 4, 5, 6].map((number) => (
        <Text
          key={number}
          position={[
            number === 2 ? 1.1 : number === 5 ? -1.1 : 0,
            number === 3 ? 1.1 : number === 4 ? -1.1 : 0,
            number === 1 ? 1.1 : number === 6 ? -1.1 : 0,
          ]}
          rotation={[
            number === 3 || number === 4 ? Math.PI / 2 : 0,
            number === 2 || number === 5 ? Math.PI / 2 : 0,
            number === 5 || number === 6 ? Math.PI : 0,
          ]}
          fontSize={0.8}
          color="black"
        >
          {number.toString()}
        </Text>
      ))}
    </mesh>
  );
};

export const Dice3D = ({ value, isRolling }: DiceProps) => {
  return (
    <div className="w-32 h-32">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DiceMesh value={value} isRolling={isRolling} />
      </Canvas>
    </div>
  );
};
