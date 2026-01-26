'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom'; // Portal için gerekli
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function TopographyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    return () => {
       setMounted(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
    camera.position.z = 4;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    // WebGL Context kontrolü
    const gl = renderer.getContext() as WebGLRenderingContext;
    const extension = gl.getExtension('OES_standard_derivatives');
    if (!extension) {
      console.warn('OES_standard_derivatives extension not available');
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);
    
    const containerElement = container;
    const rendererElement = renderer;

    const onResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    const geometry = new THREE.PlaneGeometry(3, 3, 100, 100);
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        time: { value: 0.2 },
        speed: { value: 0.0017 },
        waveDefinition: { value: 1.5 },
        waveAmplitude: { value: 0.17 },
        topoDefinition: { value: 30 },
        topoColor: { value: new THREE.Color(52/255, 57/255, 124/255) }
      },
      vertexShader: `
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        uniform float time;
        uniform float waveDefinition;
        uniform float waveAmplitude;
        varying vec3 vPosition;

        void main(void) {
          float newZ = snoise(uv) + snoise((uv * waveDefinition) + time);
          newZ *= waveAmplitude;
          vec3 newPosition = vec3(position.xy, position.z + newZ);
          vPosition = newPosition;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topoColor;
        uniform float topoDefinition;
        varying vec3 vPosition;

        void main(void) {
          float coord = vPosition.z * topoDefinition;
          float dist = abs(fract(coord - 0.1) - 0.5);
          float line = 1.0 - smoothstep(0.0, 0.02, dist);
          line = clamp(line, 0.0, 1.0);
          gl_FragColor = vec4(topoColor, line);
        }
      `
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 4;
    scene.add(mesh);
    meshRef.current = mesh;

    gsap.to(mesh.rotation, {
      z: 2 * Math.PI,
      duration: 10,
      ease: 'none',
      repeat: -1
    });

    const draw = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) return;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(draw);

      materialRef.current.uniforms.time.value += materialRef.current.uniforms.speed.value;
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (meshRef.current) gsap.killTweensOf(meshRef.current.rotation);
      
      // Cleanup DOM
      if (rendererElement && containerElement && containerElement.contains(rendererElement.domElement)) {
        containerElement.removeChild(rendererElement.domElement);
      }
      rendererElement.dispose();
      
      if (materialRef.current) materialRef.current.dispose();
      if (geometry) geometry.dispose();
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div 
      ref={containerRef}
      className="fixed-topography-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1, // En arkada kalması için
        overflow: 'hidden'
      }}
    />,
    document.body
  );
}