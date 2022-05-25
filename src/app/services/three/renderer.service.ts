import {Injectable} from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class RendererService {

  constructor() {
  }

  private _renderer;

  create(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    this._renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this._renderer.localClippingEnabled = true;
    this._renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    return this._renderer;
  }

  get renderer() {
    return this._renderer;
  }

  set renderer(value) {
    this._renderer = value;
  }
}
