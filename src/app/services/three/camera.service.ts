import {Injectable} from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {


  private _camera;

  constructor() {
  }

  create(canvas: HTMLCanvasElement): THREE.OrthographicCamera {
    this._camera = new THREE.OrthographicCamera(
      canvas.offsetWidth / -2,
      canvas.offsetWidth / 2,
      canvas.offsetHeight / 2,
      canvas.offsetHeight / -2,
      0.1,
      1000
    );
    this._camera.position.set(0, 0, 300);
    this._camera.up.set(0, 1, 0);
    return this._camera;
  }

  createOrthographic(canvas: HTMLCanvasElement): THREE.OrthographicCamera {
    const camera = new THREE.OrthographicCamera(
      canvas.offsetWidth / -4,
      canvas.offsetWidth / 4,
      canvas.offsetHeight / 4,
      canvas.offsetHeight / -4,
      0.1,
      10000
    );
    camera.position.set(0, 300, 0);
    camera.up.set(0, 0, 1);
    return camera;
  }

  set camera(value) {
    this._camera = value;
  }

  get camera() {
    return this._camera;
  }
}
