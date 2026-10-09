"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * 一片会呼吸的粒子云，鼠标移动时整片跟着转。
 * 只用 three 的 Points + 自定义着色器，不引 drei，体积和心智负担都小。
 */

const vertexShader = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  uniform float uDrift;
  varying float vGlow;

  void main() {
    vec3 p = position;

    // 每个点自己的相位，让整片云"呼吸"起来而不是整体平移
    p.x += sin(uTime * 0.6 + aPhase) * uDrift;
    p.y += cos(uTime * 0.5 + aPhase * 1.3) * uDrift * 0.8;
    p.z += sin(uTime * 0.4 + aPhase * 0.7) * uDrift;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vGlow = 0.45 + 0.55 * sin(uTime * 0.8 + aPhase);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vGlow;

  void main() {
    // 把方形的点裁成柔光圆点
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * (0.25 + vGlow * 0.6);
    vec3 color = mix(uColorA, uColorB, vGlow);
    gl_FragColor = vec4(color, alpha);
  }
`;

function Cloud({
  count,
  speed,
  accentA,
  accentB,
}: {
  count: number;
  speed: number;
  accentA: string;
  accentB: string;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // 球壳随机分布，稍微压扁成"星云盘"的样子
      const radius = 2.1 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.62;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 },
      uDrift: { value: 0.22 },
      uColorA: { value: new THREE.Color(accentA) },
      uColorB: { value: new THREE.Color(accentB) },
    }),
    // 颜色变了要重建 uniform，所以把颜色放进依赖
    [accentA, accentB],
  );

  // 组件卸载时释放显存，不然来回切页面会越吃越多
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.current?.dispose(), []);

  useFrame((_state, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value += delta * speed;
    }
    if (points.current) {
      // 指针位置决定旋转目标，缓动跟上
      const targetY = pointer.x * 0.55;
      const targetX = -pointer.y * 0.35;
      points.current.rotation.y += (targetY - points.current.rotation.y) * 0.045;
      points.current.rotation.x += (targetX - points.current.rotation.x) * 0.045;
      points.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleScene({
  count,
  speed,
  accentA,
  accentB,
}: {
  count: number;
  speed: number;
  accentA: string;
  accentB: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.4], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Cloud count={count} speed={speed} accentA={accentA} accentB={accentB} />
    </Canvas>
  );
}
