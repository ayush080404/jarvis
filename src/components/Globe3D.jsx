import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import {
  earthVertexShader,
  earthFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from '../three/earthShaders';
import { latLngToVector3 } from '../three/latLngToVector3';

const DESTINATIONS = [
  { name: 'Paris', lat: 48.86, lng: 2.35 },
  { name: 'New York', lat: 40.71, lng: -74.0 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69 },
  { name: 'Dubai', lat: 25.2, lng: 55.27 },
  { name: 'Sydney', lat: -33.87, lng: 151.21 },
  { name: 'Rio de Janeiro', lat: -22.91, lng: -43.17 },
];

function Pin({ lat, lng }) {
  const position = useMemo(() => latLngToVector3(lat, lng, 2.02), [lat, lng]);
  const haloRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.2) * 0.35;
    if (haloRef.current) haloRef.current.scale.setScalar(s);
  });

  return (
    <group position={position}>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Earth() {
  const [dayMap, nightMap, specularMap, normalMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth_day.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_clouds.jpg',
  ]);

  dayMap.colorSpace = THREE.SRGBColorSpace;
  nightMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;
  [dayMap, nightMap, specularMap, normalMap, cloudsMap].forEach((t) => {
    t.anisotropy = 4;
  });

  // Everything lives inside `introRef` so the whole globe (earth + clouds +
  // atmosphere) can pop in together with one smooth scale-in once textures
  // finish decoding, instead of just appearing abruptly.
  const introRef = useRef();
  const earthRotateRef = useRef();
  const cloudsRef = useRef();
  const mountTimeRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      dayTexture: { value: dayMap },
      nightTexture: { value: nightMap },
      specularTexture: { value: specularMap },
      normalTexture: { value: normalMap },
      sunDirection: { value: new THREE.Vector3(1, 0.35, 1).normalize() },
    }),
    [dayMap, nightMap, specularMap, normalMap]
  );

  useFrame(({ clock }, delta) => {
    if (mountTimeRef.current === null) mountTimeRef.current = clock.getElapsedTime();
    const elapsed = clock.getElapsedTime() - mountTimeRef.current;
    const introProgress = Math.min(elapsed / 0.9, 1);
    const eased = 1 - Math.pow(1 - introProgress, 3);
    const scale = 0.72 + 0.28 * eased;

    if (introRef.current) introRef.current.scale.setScalar(scale);
    if (earthRotateRef.current) earthRotateRef.current.rotation.y += delta * 0.06;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.075;
  });

  return (
    <group ref={introRef}>
      <group ref={earthRotateRef}>
        <mesh>
          <sphereGeometry args={[2, 96, 96]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={earthVertexShader}
            fragmentShader={earthFragmentShader}
          />
        </mesh>
        {DESTINATIONS.map((d) => (
          <Pin key={d.name} lat={d.lat} lng={d.lng} />
        ))}
      </group>

      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.06}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** HTML loading overlay, driven by drei's useProgress (tracks the shared
 *  THREE.DefaultLoadingManager, so it reflects real texture download/decode
 *  progress rather than a fake timer). Lives outside the Canvas so it's
 *  ordinary DOM — no WebGL placeholder mesh needed. */
function LoaderOverlay() {
  const { active, progress } = useProgress();

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 grid place-items-center transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-(--border-soft) border-t-sky-400" />
        <p className="text-xs text-(--text-secondary)">Loading globe&hellip; {Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default function Globe3D() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.12} />
        <directionalLight position={[3, 1.2, 3]} intensity={2.4} />
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.45}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
      <LoaderOverlay />
    </div>
  );
}
