'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'

interface WarriorConfig {
  race: 'human' | 'goblin'
  helmet: string
  armor: string
  weapon: string
  facialHair: string
}

function WarriorModel({ config }: { config: WarriorConfig }) {
  const isGoblin = config.race === 'goblin'
  
  // Base body - different size for human vs goblin
  const bodyHeight = isGoblin ? 1.2 : 1.8
  const bodyWidth = isGoblin ? 0.5 : 0.6
  const headSize = isGoblin ? 0.35 : 0.3
  
  // Skin color
  const skinColor = isGoblin ? '#7a9c5f' : '#d4a574'
  
  return (
    <group position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, bodyHeight + headSize / 2, 0]}>
        <sphereGeometry args={[headSize, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Facial Hair */}
      {config.facialHair !== 'none' && (
        <mesh position={[0, bodyHeight + headSize / 4, headSize * 0.8]}>
          <boxGeometry args={[headSize * 0.6, headSize * 0.4, 0.1]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} />
        </mesh>
      )}
      
      {/* Helmet */}
      {config.helmet !== 'none' && (
        <mesh position={[0, bodyHeight + headSize / 2 + 0.1, 0]}>
          <cylinderGeometry args={[headSize * 1.1, headSize * 0.9, headSize * 0.8, 32]} />
          <meshStandardMaterial color="#8b8b8b" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      
      {/* Body/Torso */}
      <mesh position={[0, bodyHeight / 2, 0]}>
        <boxGeometry args={[bodyWidth, bodyHeight, bodyWidth * 0.6]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      
      {/* Armor overlay on torso */}
      {config.armor !== 'none' && (
        <mesh position={[0, bodyHeight / 2, bodyWidth * 0.35]}>
          <boxGeometry args={[bodyWidth * 1.1, bodyHeight * 0.9, 0.1]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
        </mesh>
      )}
      
      {/* Left Arm */}
      <mesh position={[-bodyWidth * 0.7, bodyHeight / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, bodyHeight * 0.8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Right Arm */}
      <mesh position={[bodyWidth * 0.7, bodyHeight / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, bodyHeight * 0.8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Weapon in right hand */}
      {config.weapon !== 'none' && (
        <group position={[bodyWidth * 0.7, bodyHeight / 2 - 0.3, 0.3]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 16]} />
            <meshStandardMaterial color="#6b5a3d" />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.05]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}
      
      {/* Left Leg */}
      <mesh position={[-bodyWidth * 0.25, -bodyHeight * 0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.12, bodyHeight * 0.6, 16]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[bodyWidth * 0.25, -bodyHeight * 0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.12, bodyHeight * 0.6, 16]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
    </group>
  )
}

function Scene({ config }: { config: WarriorConfig }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 2, 5]} />
      <OrbitControls 
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight position={[-10, 10, -5]} intensity={0.5} />
      
      <Suspense fallback={null}>
        <WarriorModel config={config} />
        <Environment preset="sunset" />
      </Suspense>
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </>
  )
}

export function WarriorScene({ config }: { config: WarriorConfig }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Scene config={config} />
      </Canvas>
    </div>
  )
}
