"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 80;
const CONNECTION_THRESHOLD = 2.2;
const LIME = "#d4f53c";
const WHITE = "#ffffff";

function Nodes() {
  const meshRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { positions, nodePositions } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const nodePos: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 7;
      const z = (Math.random() - 0.5) * 5;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      nodePos.push(new THREE.Vector3(x, y, z));
    }
    return { positions: pos, nodePositions: nodePos };
  }, []);

  const linePositions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < CONNECTION_THRESHOLD) {
          pts.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    return new Float32Array(pts);
  }, [nodePositions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.04;
      meshRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;
    }
    if (lineRef.current) {
      lineRef.current.rotation.y = t * 0.04;
      lineRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;
    }
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={WHITE} size={0.035} sizeAttenuation transparent opacity={0.7} />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={LIME} transparent opacity={0.12} />
      </lineSegments>
    </>
  );
}

export function ParticleNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Nodes />
    </Canvas>
  );
}
