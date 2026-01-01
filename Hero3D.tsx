
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Hero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    if (!mountRef.current || webglError) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let torusKnot: THREE.Mesh | null = null;
    let animationId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
      
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        failIfMajorPerformanceCaveat: true // Fail on software rendering to avoid lag
      });
      
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
      const material = new THREE.MeshNormalMaterial({ wireframe: true });
      torusKnot = new THREE.Mesh(geometry, material);
      scene.add(torusKnot);

      camera.position.z = 30;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (torusKnot) {
          torusKnot.rotation.x += 0.005;
          torusKnot.rotation.y += 0.005;
        }
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();
    } catch (e) {
      console.warn("WebGL not supported or context lost. Using CSS fallback.", e);
      setWebglError(true);
      return;
    }

    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (renderer && mountRef.current) {
        try {
          mountRef.current.removeChild(renderer.domElement);
          renderer.dispose();
        } catch (e) {
          // Ignore removal errors during unmount
        }
      }
    };
  }, [webglError]);

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-400 to-rose-300 animate-gradient">
      {/* 3D Container or CSS Fallback */}
      <div ref={mountRef} className="absolute inset-0 opacity-30">
        {webglError && (
          <div className="w-full h-full flex items-center justify-center">
             <div className="w-[40rem] h-[40rem] border-[40px] border-white/10 rounded-full animate-[spin_20s_linear_infinite] opacity-20"></div>
             <div className="absolute w-[30rem] h-[30rem] border-[2px] border-white/20 rounded-full animate-[pulse_8s_ease-in-out_infinite] opacity-30"></div>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-rose-100 text-emerald-700 font-bold text-sm uppercase tracking-widest border border-rose-200">
          Intelligence-Era Career Infrastructure
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter leading-none">
          Evolve your <br/> career with <span className="text-emerald-900 drop-shadow-none">GigHub</span>
        </h1>
        <p className="text-xl md:text-3xl text-emerald-50 font-medium mb-12 drop-shadow-md max-w-2xl mx-auto leading-relaxed">
          The first neural matching platform built for a green, sustainable future of work.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => window.location.hash = '#jobs'}
            className="px-10 py-5 bg-emerald-700 text-white font-black rounded-2xl shadow-2xl hover:bg-emerald-800 transition transform hover:-translate-y-1 active:scale-95"
          >
            Access Job Grid
          </button>
          <button 
            onClick={() => window.location.hash = '#about'}
            className="px-10 py-5 bg-rose-50 border-2 border-rose-200 text-rose-600 font-black rounded-2xl shadow-xl hover:bg-rose-100 transition transform hover:-translate-y-1 active:scale-95"
          >
            Mission Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;
