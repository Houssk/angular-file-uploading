import {Injectable} from '@angular/core';
import {Scene} from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  constructor() {
  }

  private _scene;

  create() {
    this._scene = new Scene();
    return this._scene
  }

  remove(name: string): void {
    this._scene.remove(this.scene.getObjectByName(name));
  }
  getObjectByName(name: string) {
    return this._scene.getObjectByName(name);
  }
  add(object){
    this.scene.add(...object);
  }
  get scene() {
    return this._scene;
  }

  set scene(value) {
    this._scene = value;
  }
}
