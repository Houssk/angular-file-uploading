import {Injectable} from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class LightService {

  constructor() {
  }

  create(): THREE.Object3D {
    const lightHolder = new THREE.Object3D();
    const light = new THREE.AmbientLight(0x404040);
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.name = 'pointlight';
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
    pointLight2.name = 'pointlight2';
    const pointLight3 = new THREE.PointLight(0xffffff, 0.3);
    pointLight3.name = 'pointLight3';
    light.position.z = 10;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    pointLight3.name = 'pointLight3';
    directionalLight.position.y = -200;
    pointLight.position.z = -1000;
    pointLight3.position.z = 1000;
    lightHolder.add(directionalLight);
    lightHolder.add(light);
    const hemi = new THREE.HemisphereLight(0xc2c5cc, 0x000000);
    hemi.position.set(0, 20, 0);
    lightHolder.add(hemi);
    hemi.intensity = 0.45;
    const ambientLight = new THREE.AmbientLight(0x3e3d3d, 0.82);
    lightHolder.add(ambientLight);
    return lightHolder;
  }
}
