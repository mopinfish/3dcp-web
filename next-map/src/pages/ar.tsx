import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { THREEx } from '@ar-js-org/ar.js-threejs';
import { FeatureCollection } from 'geojson';

function convertToARCoordinates(lon: number, lat: number): [number, number, number] {
  // 簡単な変換例（実際のプロジェクトでは、より正確な変換が必要かもしれません）
  const x = (lon - 139) * 100000;
  const z = (lat - 35) * 100000;
  return [x, 0, -z]; // Y座標は0に設定
}

const ARScene: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sceneRef.current) {
      initAR();
    }
  }, []);

  const initAR = async () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current?.appendChild(renderer.domElement);

    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
      sourceWidth: window.innerWidth,
      sourceHeight: window.innerHeight,
    });

    arToolkitSource.init(() => {
      setTimeout(() => {
        onResize();
      }, 2000);
    }, (err: unknown) => {
      console.error('Error initializing ARToolkitSource:', err);
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: '/data/camera_para.dat',
      detectionMode: 'mono',
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    new THREEx.ArMarkerControls(arToolkitContext, camera, {
      type: 'pattern',
      patternUrl: '/data/patt.hiro',
      changeMatrixMode: 'cameraTransformMatrix',
    });

    const geojsonData: FeatureCollection = await fetch('tokyo_ks.geojson').then(res => res.json());

    geojsonData.features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const [x, y, z] = convertToARCoordinates(coordinates[0], coordinates[1]);
        mesh.position.set(x, y, z);
        mesh.scale.set(10000, 10000, 10000); // スケールを大きくする
        console.log('--------------------')
        console.log(mesh);
        console.log('--------------------')
        scene.add(mesh);
      }
      // Add more geometry types as needed
    });

    const onRenderFcts: ((delta: number) => void)[] = [];

    onRenderFcts.push(() => {
      if (arToolkitSource.ready === false) return;
      arToolkitContext.update(arToolkitSource.domElement);
      scene.visible = camera.visible;
    });

    onRenderFcts.push(() => {
      renderer.render(scene, camera);
    });

    let lastTimeMsec: number | null = null;
    requestAnimationFrame(function animate(nowMsec) {
      requestAnimationFrame(animate);
      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
      const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;
      onRenderFcts.forEach(onRenderFct => {
        onRenderFct(deltaMsec / 1000);
      });
    });

    window.addEventListener('resize', onResize);

    function onResize() {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    }
  };

  return <div ref={sceneRef} />;
};

export default ARScene;
