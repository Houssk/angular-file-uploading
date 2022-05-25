import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {Color, Side} from 'three';

export interface MaterialData {
  side: Side;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private settings = {
    roughness: 0.4,
    ambientIntensity: 0.2,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    displacementScale: 2.436143, // from original model
    normalScale: 1.0
  };

  constructor() {
  }

  createStandardMaterial(color , transparent = true): THREE.MeshPhongMaterial {
    return new THREE.MeshPhongMaterial({
      color,
      transparent,
      emissive: 0x000000
    });
  }
  blue() {
    return new THREE.MeshLambertMaterial({color: 0x0000ff, combine: THREE.MixOperation, reflectivity: 0.3});
  }

  red() {
    return new THREE.MeshLambertMaterial({color: 0x660000, combine: THREE.MixOperation, reflectivity: 0.25});
  }

  black() {
    return new THREE.MeshLambertMaterial({color: 0x000000, combine: THREE.MixOperation, reflectivity: 0.15});
  }


  white() {
    return new THREE.MeshPhongMaterial({
      color: 0xffffff,
      combine: THREE.MixOperation,
      reflectivity: 0.25,
      flatShading: false,
      transparent: true
    });
  }

  white2() {
    return new THREE.MeshLambertMaterial({
      color: 0xffffff,
      combine: THREE.MixOperation,
      reflectivity: 0.25,
    })
  }

  carmine() {
    return new THREE.MeshPhongMaterial({color: 0x770000, specular: 0xffaaaa, shininess: 5, transparent: true});
  }

  gold() {
    return new THREE.MeshPhongMaterial({
      color: 0xaa9944,
      specular: 0xbbaa99,
      shininess: 10,
      combine: THREE.MultiplyOperation
    })
  }

  bronze() {
    return new THREE.MeshPhongMaterial({
      color: 0x482400,
      specular: 0xFFA500,
      shininess: 5,
      combine: THREE.MixOperation,
      reflectivity: 0.25,
      transparent: true
    });
  }

  green() {
    return new THREE.MeshPhongMaterial({
      color: 0x004800,
      specular: 0x00FF00,
      shininess: 3,
      combine: THREE.MixOperation,
      reflectivity: 0.25
    });
  }

  chrome() {
    return new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      combine: THREE.MultiplyOperation,
      transparent: true
    });
  }

  orangeMetal() {
    return new THREE.MeshLambertMaterial({color: 0xe87121, combine: THREE.MultiplyOperation});
  }

  blueMetal() {
    return new THREE.MeshLambertMaterial({color: 0x001133, combine: THREE.MultiplyOperation, transparent: true});
  }

  redMetal() {
    return new THREE.MeshLambertMaterial({color: 0x770000, combine: THREE.MultiplyOperation});
  }

  greenMetal() {
    return new THREE.MeshLambertMaterial({color: 0x007711, combine: THREE.MultiplyOperation});
  }

  unVisible() {
    return new THREE.MeshNormalMaterial({color: 0x00000, visible: false});
  }

  blackMetal() {
    return new THREE.MeshLambertMaterial({color: 0x222222, combine: THREE.MultiplyOperation});
  }

  greenGoutt() {
    return new THREE.MeshPhongMaterial({color: 0x4a7942, shininess: 5, transparent: true});
  }

  pink() {
    return new THREE.MeshPhongMaterial({
      color: 0x480024,
      specular: 0xFF69B4,
      shininess: 3,
      combine: THREE.MixOperation,
      reflectivity: 0.25
    })
  }

  normal() {
    return new THREE.MeshNormalMaterial();
  }
}
