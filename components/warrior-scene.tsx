"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Suspense } from "react";

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

// ----- Base Model ----------------------------------------------------------------------------

function BaseModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} prosition={[0, 0, 0]} />;
}

// ------ Equipment slot loaders ---------------------------------------------------------------

function HelmetModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={[0, 0, 0]} />;
}

function ArmorModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={[0, 0, 0]} />;
}

function WeaponModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={[0, 0, 0]} />;
}

function ShieldModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={[0, 0, 0]} />;
}

function FacialHairModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={[0, 0, 0]} />;
}

function MountModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={[0, 0, 0]} />;
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
  return (
    <group>
      <BaseModel url={baseUrl} />

      {config.helmet !== "none" && modelUrls.helmet && (
        <HelmetModel url={modelUrls.helmet} />
      )}
      {config.chestplate !== "none" && modelUrls.chestplate && (
        <ArmorModel url={modelUrls.chestplate} />
      )}
      {config.pants !== "none" && modelUrls.pants && (
        <ArmorModel url={modelUrls.pants} />
      )}
      {config.shoes !== "none" && modelUrls.shoes && (
        <ArmorModel url={modelUrls.shoes} />
      )}
      {config.weapon !== "none" && modelUrls.weapon && (
        <WeaponModel url={modelUrls.weapon} />
      )}
      {config.shield !== "none" && modelUrls.shield && (
        <ShieldModel url={modelUrls.shield} />
      )}
      {config.facialHair !== "none" && modelUrls.facialHair && (
        <FacialHairModel url={modelUrls.facialHair} />
      )}
      {config.mount !== "none" && modelUrls.mount && (
        <MountModel url={modelUrls.mount} />
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
