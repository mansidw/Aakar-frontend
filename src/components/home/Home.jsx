import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ShieldCheckIcon,
  DatabaseIcon,
  ChartBarIcon,
  FileTextIcon,
} from "lucide-react";
import { Environment, Stars, Points } from "@react-three/drei";
import * as THREE from "three";
import PricingSection from "./PricingCard";
import { useNavigate } from "react-router-dom";

function ChartElementsAnother() {
  const chartRef1 = useRef();
  const chartRef2 = useRef();

  useFrame(() => {
    if (chartRef1.current) {
      chartRef1.current.rotation.y += 0.005;
      chartRef1.current.rotation.x += 0.002;
    }
    if (chartRef2.current) {
      chartRef2.current.rotation.y -= 0.003;
      chartRef2.current.rotation.z += 0.004;
    }
  });

  return (
    <>
      {/* Abstract Bar Chart Representation */}
      <group ref={chartRef1} position={[1, 2, 3]}>
        <mesh position={[-1, 0, 0]} scale={[0.3, 1.5, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#6366F1" opacity={0.7} transparent />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[0.3, 1, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#8B5CF6" opacity={0.7} transparent />
        </mesh>
        <mesh position={[1, 0, 0]} scale={[0.3, 0.7, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#4338CA" opacity={0.7} transparent />
        </mesh>
      </group>

      {/* Abstract Line Graph Representation */}
      <group ref={chartRef2} position={[2, -1, -2]}>
        <mesh>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 0.5, 0),
              ]),
              64,
              0.05,
              8,
              false,
            ]}
          />
          <meshStandardMaterial
            color="#A855F7"
            opacity={0.6}
            transparent
            wireframe
          />
        </mesh>
      </group>

      {/* Floating Data Points */}
      <Points
        positions={new Float32Array(1000).map(() => (Math.random() - 0.5) * 10)}
        stride={3}
        count={333}
      >
        <pointsMaterial
          color="#4F46E5"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.5}
        />
      </Points>
    </>
  );
}

function ChartElements() {
  const chartRef1 = useRef();
  const chartRef2 = useRef();

  useFrame(() => {
    if (chartRef1.current) {
      chartRef1.current.rotation.y += 0.005;
      chartRef1.current.rotation.x += 0.002;
    }
    if (chartRef2.current) {
      chartRef2.current.rotation.y -= 0.003;
      chartRef2.current.rotation.z += 0.004;
    }
  });

  return (
    <>
      {/* Abstract Bar Chart Representation */}
      <group ref={chartRef1} position={[-1, 0, 2]}>
        <mesh position={[-1, 0, 0]} scale={[0.3, 1.5, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#6366F1" opacity={0.7} transparent />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[0.3, 1, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#8B5CF6" opacity={0.7} transparent />
        </mesh>
        <mesh position={[1, 0, 0]} scale={[0.3, 0.7, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#4338CA" opacity={0.7} transparent />
        </mesh>
      </group>

      {/* Abstract Line Graph Representation */}
      <group ref={chartRef2} position={[2, -1, -2]}>
        <mesh>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 0.5, 0),
              ]),
              64,
              0.05,
              8,
              false,
            ]}
          />
          <meshStandardMaterial
            color="#A855F7"
            opacity={0.6}
            transparent
            wireframe
          />
        </mesh>
      </group>

      {/* Floating Data Points */}
      <Points
        positions={new Float32Array(1000).map(() => (Math.random() - 0.5) * 10)}
        stride={3}
        count={333}
      >
        <pointsMaterial
          color="#4F46E5"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.5}
        />
      </Points>
    </>
  );
}

function ChartElementsAgain() {
  const chartRef1 = useRef();
  const chartRef2 = useRef();

  useFrame(() => {
    if (chartRef1.current) {
      chartRef1.current.rotation.y += 0.005;
      chartRef1.current.rotation.x += 0.002;
    }
    if (chartRef2.current) {
      chartRef2.current.rotation.y -= 0.003;
      chartRef2.current.rotation.z += 0.004;
    }
  });

  return (
    <>
      {/* Abstract Bar Chart Representation */}
      <group ref={chartRef1} position={[-3, 3, 2]}>
        <mesh position={[-1, 0, 0]} scale={[0.3, 1.5, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#6366F1" opacity={0.7} transparent />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[0.3, 1, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#8B5CF6" opacity={0.7} transparent />
        </mesh>
        <mesh position={[1, 0, 0]} scale={[0.3, 0.7, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#4338CA" opacity={0.7} transparent />
        </mesh>
      </group>

      {/* Abstract Line Graph Representation */}
      <group ref={chartRef2} position={[2, -1, -2]}>
        <mesh>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 0.5, 0),
              ]),
              64,
              0.05,
              8,
              false,
            ]}
          />
          <meshStandardMaterial
            color="#A855F7"
            opacity={0.6}
            transparent
            wireframe
          />
        </mesh>
      </group>

      {/* Floating Data Points */}
      <Points
        positions={new Float32Array(1000).map(() => (Math.random() - 0.5) * 10)}
        stride={3}
        count={333}
      >
        <pointsMaterial
          color="#4F46E5"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.5}
        />
      </Points>
    </>
  );
}

function AnimatedBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      className="absolute inset-0 z-0"
      style={{ position: "absolute" }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        <ChartElements />
        <ChartElementsAnother />
        <ChartElementsAgain />

        <Stars
          radius={150}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
        />
      </Suspense>
    </Canvas>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

// Main Landing Page Component
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white overflow-hidden relative">
      {/* 3D Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1
            className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600"
            style={{ color: "white" }}
          >
            आकर AI
          </h1>
          <p className="text-xl text-gray-300 max-w-xl">
            Transform Raw Data into Intelligent, Actionable Insights with
            AI-Powered Reporting
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
            {/* <button className="border border-white/30 text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg transition duration-300">
              Learn More
            </button> */}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<DatabaseIcon size={48} />}
            title="Multi-Source Integration"
            description="Connect seamlessly with databases, APIs, and file formats"
          />
          <FeatureCard
            icon={<ChartBarIcon size={48} />}
            title="Smart Visualizations"
            description="Generate dynamic charts and interactive dashboards"
          />
          <FeatureCard
            icon={<FileTextIcon size={48} />}
            title="Custom Reporting"
            description="Natural language report generation with flexible formats"
          />
          <FeatureCard
            icon={<ShieldCheckIcon size={48} />}
            title="Enterprise Security"
            description="Advanced data protection and compliance features"
          />
        </div>
      </div>

      <PricingSection />

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-gray-300">
          <div>
            <h4 className="text-2xl font-bold text-white mb-4">आकर AI</h4>
            <p>
              Transforming data into strategic insights with cutting-edge AI
              technology.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Contact</h4>
            <p>Email: support@akar-ai.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          © 2024 आकर AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
