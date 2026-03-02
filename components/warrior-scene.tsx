"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import {
  Suspense,
  useMemo,
  Component,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { SkeletonUtils } from "three-stdlib";
import { Loader2 } from "lucide-react";
import * as THREE from "three";

interface WarriorConfig {
  race: "human" | "goblin";
  helmet: string;
  chestplate: string;
  pants: string;
  shoes: string;
  weapon: string;
  shield: string;
  facialHair: string;
  mount: string;
}

interface ModelUrls {
  helmet: string | null;
  chestplate: string | null;
  pants: string | null;
  shoes: string | null;
  weapon: string | null;
  shield: string | null;
  facialHair: string | null;
  mount: string | null;
}

// ----- Error Boundary --------------------------------------------------------------------------

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[WarriorScene] Model failed to load: ", error.message);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ----- Generic Model Loader --------------------------------------------------------------------

function GltfModel({
  url,
  animationName,
  timeOffset = 1,
}: {
  url: string;
  animationName?: string;
  timeOffset?: number;
}) {
  const { scene, animations } = useGLTF(url);
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useEffect(() => {
    if (!animations || animations.length === 0) return;

    const clip = animationName
      ? THREE.AnimationClip.findByName(animations, animationName)
      : animations[0];

    if (!clip) return;

    const mixer = new THREE.AnimationMixer(cloned);
    const action = mixer.clipAction(clip);

    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();

    mixer.update(timeOffset);
    action.paused = true;

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(cloned);
    };
  }, [cloned, animations, animationName, timeOffset]);

  return <primitive object={cloned} />;
}

// ----- Full warrior assembly ------------------------------------------------------------------

function WarriorModel({
  baseUrl,
  config,
  modelUrls,
}: {
  baseUrl: string;
  config: WarriorConfig;
  modelUrls: ModelUrls;
}) {
  const slots: { key: keyof ModelUrls; value: string }[] = [
    { key: "helmet", value: config.helmet },
    { key: "chestplate", value: config.chestplate },
    { key: "pants", value: config.pants },
    { key: "shoes", value: config.shoes },
    { key: "weapon", value: config.weapon },
    { key: "shield", value: config.shield },
    { key: "facialHair", value: config.facialHair },
    { key: "mount", value: config.mount },
  ];

  return (
    <group>
      <ModelErrorBoundary>
        <GltfModel url={baseUrl} />
      </ModelErrorBoundary>

      {slots.map(({ key, value }) =>
        value !== "none" && modelUrls[key] ? (
          <ModelErrorBoundary key={key}>
            <GltfModel url={modelUrls[key]!} timeOffset={1} />
          </ModelErrorBoundary>
        ) : null,
      )}
    </group>
  );
}

function Scene({
  baseUrl,
  config,
  modelUrls,
}: {
  baseUrl: string;
  config: WarriorConfig;
  modelUrls: ModelUrls;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 2, 5]} />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight position={[-10, 10, -5]} intensity={0.5} />

      <Suspense fallback={null}>
        <WarriorModel baseUrl={baseUrl} config={config} modelUrls={modelUrls} />
        <Environment preset="sunset" />
      </Suspense>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10 rounded-lg">
      <div className="flex flex-col items-center gap-3 text-slate-300">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="text-sm font-medium tracking-wide">
          Loading warrior
        </span>
      </div>
    </div>
  );
}

export function WarriorScene({
  config,
  modelUrls,
  baseModelUrl,
}: {
  config: WarriorConfig;
  modelUrls: ModelUrls;
  baseModelUrl: string | null;
}) {
  return (
    <div className="relative w-full h-full">
      {!baseModelUrl && <LoadingOverlay />}

      <Canvas shadows>
        {baseModelUrl && (
          <Scene baseUrl={baseModelUrl} config={config} modelUrls={modelUrls} />
        )}
      </Canvas>
    </div>
  );
}
