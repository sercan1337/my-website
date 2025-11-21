'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const { offsetWidth: width, offsetHeight: height } = container;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
    camera.position.z = 4;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false
    });

    // Enable the standard derivatives extension on the WebGL context
    const gl = renderer.getContext() as WebGLRenderingContext;
    const extension = gl.getExtension('OES_standard_derivatives');
    if (!extension) {
      console.warn('OES_standard_derivatives extension not available');
    }

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);
    
    // Store references for cleanup
    const containerElement = container;
    const rendererElement = renderer;

    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const { offsetWidth: width, offsetHeight: height } = containerRef.current;
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
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec2 mod289(vec2 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec3 permute(vec3 x) {
          return mod289(((x*34.0)+1.0)*x);
        }

        float snoise(vec2 v)
        {
          const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
              0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
              -0.577350269189626,  // -1.0 + 2.0 * C.x
              0.024390243902439); // 1.0 / 41.0
          // First corner
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);

          // Other corners
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;

          // Permutations
          i = mod289(i); // Avoid truncation effects in permutation
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));

          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;

          // Gradients: 41 points uniformly over a line, mapped onto a diamond.
          // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;

          // Normalise gradients implicitly by scaling m
          // Approximation of: m *= inversesqrt( a0*a0 + h*h );
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

          // Compute final noise value at P
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
        float map(float value, float inMin, float inMax, float outMin, float outMax) {
          return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }

        uniform float waveAmplitude;
        uniform float topoDefinition;
        uniform vec3 topoColor;

        varying vec3 vPosition;

        void main(void) {
          float coord = vPosition.z * topoDefinition;
          // Fallback approach that doesn't require derivatives extension
          // Use a smoothstep-based approach for line rendering
          float dist = abs(fract(coord - 0.1) - 0.5);
          float line = 1.0 - smoothstep(0.0, 0.02, dist);
          line = clamp(line, 0.0, 1.0);

          gl_FragColor = vec4(topoColor, line);
        }
      `
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y += 0.3;
    mesh.rotation.x = -Math.PI / 4;
    scene.add(mesh);
    meshRef.current = mesh;

    // Use GSAP instead of TweenMax
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

    // Cleanup function
    return () => {
      window.removeEventListener('resize', onResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (meshRef.current) {
        gsap.killTweensOf(meshRef.current.rotation);
      }

      if (rendererElement && containerElement && containerElement.contains(rendererElement.domElement)) {
        containerElement.removeChild(rendererElement.domElement);
        rendererElement.dispose();
      }

      if (materialRef.current) {
        materialRef.current.dispose();
      }

      if (geometry) {
        geometry.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="viewport"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}

