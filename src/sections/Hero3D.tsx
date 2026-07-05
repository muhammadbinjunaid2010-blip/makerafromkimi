import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router";

export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.FogExp2(0x0a1628, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 40);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x3b82f6, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Ground Grid
    const gridSize = 100;
    const gridDivisions = 50;
    const gridHelper = new THREE.GridHelper(
      gridSize,
      gridDivisions,
      0x3b82f6,
      0x1e3a5f
    );
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.3;
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Scanning sweep line
    const sweepGeometry = new THREE.PlaneGeometry(gridSize, 0.5);
    const sweepMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const sweepLine = new THREE.Mesh(sweepGeometry, sweepMaterial);
    sweepLine.rotation.x = -Math.PI / 2;
    sweepLine.position.y = 0.1;
    sweepLine.position.z = -gridSize / 2;
    scene.add(sweepLine);

    // Wireframe Buildings
    const buildingCount = window.innerWidth < 768 ? 20 : 40;
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });

    const buildings: {
      mesh: THREE.Mesh;
      originalY: number;
      speed: number;
      offset: number;
    }[] = [];

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const shapeType = Math.floor(Math.random() * 3);
      let geometry: THREE.BufferGeometry;

      if (shapeType === 0) {
        geometry = new THREE.BoxGeometry(
          1 + Math.random() * 3,
          2 + Math.random() * 10,
          1 + Math.random() * 3
        );
      } else if (shapeType === 1) {
        geometry = new THREE.CylinderGeometry(
          0.5 + Math.random(),
          0.5 + Math.random(),
          2 + Math.random() * 10,
          6
        );
      } else {
        geometry = new THREE.ConeGeometry(
          0.5 + Math.random() * 2,
          2 + Math.random() * 8,
          4
        );
      }

      const building = new THREE.Mesh(geometry, wireframeMaterial.clone());
      const height =
        geometry instanceof THREE.BoxGeometry
          ? geometry.parameters.height
          : geometry instanceof THREE.CylinderGeometry
          ? geometry.parameters.height
          : geometry instanceof THREE.ConeGeometry
          ? geometry.parameters.height
          : 5;

      building.position.set(x, height / 2, z);
      scene.add(building);
      buildings.push({
        mesh: building,
        originalY: height / 2,
        speed: 0.5 + Math.random(),
        offset: Math.random() * Math.PI * 2,
      });
    }

    // Central Core Structure
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const icosahedronGeometry = new THREE.IcosahedronGeometry(2, 1);
    const icosahedronMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    coreGroup.add(coreMesh);

    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerMesh);

    // Orbiting Particles
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let sweepZ = -gridSize / 2;
    const sweepSpeed = 0.2;
    let animationId: number;

    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Sweep line
      sweepZ += sweepSpeed;
      if (sweepZ > gridSize / 2) {
        sweepZ = -gridSize / 2;
      }
      sweepLine.position.z = sweepZ;

      // Building pulse
      for (const b of buildings) {
        b.mesh.position.y =
          b.originalY + Math.sin(time * b.speed + b.offset) * 0.2;
      }

      // Core rotation
      coreMesh.rotation.y += 0.005;
      coreMesh.rotation.x += 0.002;
      innerMesh.rotation.y -= 0.01;
      innerMesh.rotation.x += 0.005;

      // Camera parallax
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (25 + mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "100vh" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center max-w-2xl mx-auto">
          <p
            className="text-xs sm:text-sm font-medium uppercase tracking-[0.15em] text-blue-400 mb-4"
            style={{
              animation: "fadeInUp 0.6s 0.2s both",
            }}
          >
            Makera Community
          </p>

          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-none"
            style={{
              textShadow: "0 2px 30px rgba(0,0,0,0.4)",
              animation: "fadeInUp 0.8s 0.4s both",
            }}
          >
            Built by Makers,
            <br />
            <span className="text-blue-400">for Makers</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed"
            style={{
              textShadow: "0 1px 10px rgba(0,0,0,0.3)",
              animation: "fadeInUp 0.7s 0.6s both",
            }}
          >
            A community where electronics, robotics, embedded systems, AI, 3D
            printing and makers come together to learn, build, share and
            discover.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              animation: "fadeInUp 0.6s 0.8s both",
            }}
          >
            <Link
              to="/community"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Join Community
            </Link>
            <Link
              to="/projects"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
