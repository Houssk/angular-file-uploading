import {Injectable} from '@angular/core';
import CameraControls from 'camera-controls';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  constructor() {
  }

  private _controls;

  createCameraControl(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, renderer) {
    CameraControls.install({THREE});
    this._controls = new CameraControls(camera, renderer.domElement);
    return this._controls;
  }

  get controls() {
    return this._controls;
  }

  set controls(value) {
    this._controls = value;
  }

  leftView() {
    this.controls.rotateTo(Math.PI / 2, Math.PI / 2, true);
  }

  rightView() {
    this.controls.rotateTo(3 * Math.PI / 2, Math.PI / 2, true);

  }

  topView() {
    this.controls.rotateTo(0,0, true);
  }

  backView() {
    this.controls.rotateTo(Math.PI, Math.PI / 2,true);
  }

  bottomView() {
    this.controls.rotateTo(0, Math.PI , true);
  }

  frontView() {
    this.controls.rotateTo(0, Math.PI / 2, true);
  }
}
