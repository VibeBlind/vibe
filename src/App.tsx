import './App.css'
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useCallback, useMemo, useRef } from 'react';
import circleImg from "./assets/circle.png"

function Points() {
  const imgTex = useLoader(THREE.TextureLoader, circleImg) as THREE.Texture;
  //const bufferRef = useRef();

  let t = 0;
  let f = 0.002;
  let a = 3;
  const graph = useCallback((x: number, z:number) => {
    return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
  }, [t, f, a])

  const count = 100
  const sep = 3
  let positions = useMemo(() => {
    let positions = []

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = graph(x, z);
        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions);
  }, [count, sep, graph])
  /**
  useFrame(() => {
    t += 15
    
    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);

        positions[i + 1] = graph(x, z);
        i += 3;
      }
    }

    bufferRef.current.needsUpdate = true;
  })
  */

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          //ref={bufferRef}
          attach ="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach="material"
        map={imgTex}
        color={0x00AAFF}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

function AnimationCanvas() {
  return (
    <Canvas camera={{position:[100, 10, 0], fov: 75}} >
      <Suspense fallback={null}>
        <Points/>
      </Suspense>
    <OrbitControls autoRotate autoRotateSpeed={0.2}/>
    </Canvas>
  )
}

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="anim">
        <AnimationCanvas/>
      </div>
    </Suspense>
  );
};

export default App;