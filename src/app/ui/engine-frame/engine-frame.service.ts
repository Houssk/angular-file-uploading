import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {ControlsService} from '@app/services/three/controls.service';
import {CameraService} from '@app/services/three/camera.service';
import {RendererService} from '@app/services/three/renderer.service';
import {LightService} from '@app/services/three/light.service';
import {SceneService} from '@app/services/three/scene.service';
import {AxesHelper} from "three";


declare global {
  interface Window {
    scene: any;
  }
}


@Injectable({
  providedIn: 'root'
})
export class EngineFrameService implements OnDestroy {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  controls: any;
  lightParent: THREE.Object3D;
  cameraParent: THREE.Object3D;
  onComplete = true;
  clock: THREE.Clock;
  delta;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  constructor(
    private ngZone: NgZone, private controlsService: ControlsService,
    private cameraService: CameraService, private rendererService: RendererService,
    private lightService: LightService,
    private sceneService: SceneService,
  ) {
  }

  public ngOnDestroy(): void {
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.scene = this.sceneService.create();
    this.cameraParent = new THREE.Object3D();
    this.clock = new THREE.Clock();
    this.canvas = canvas.nativeElement;
    this.renderer = this.rendererService.create(this.canvas);
    this.camera = this.cameraService.create(this.canvas);
    this.controls = this.controlsService.createCameraControl(this.camera, this.renderer);
    this.controls.zoom(1.5);
    this.lightParent = this.lightService.create();
    this.camera.lookAt(this.controls.getTarget(new THREE.Vector3()));
    this.scene.add(this.lightParent);
    this.cameraParent.add(this.camera);
    this.scene.add(this.cameraParent);
    this.scene.add(new AxesHelper(100))
  }

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      // @ts-ignore
      window.THREE = THREE;
      window.scene = this.scene;
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.delta = this.clock.getDelta();
    this.controls.update(this.delta);
    requestAnimationFrame(() => {
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    if (this.renderer) {
      this.ngZone.runOutsideAngular(() => {
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        console.log('width ', 'Height ', width, height)
        this.camera.left = width / -2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = height / -2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      });
    }
  }

  public loadImage(fileName, size, ratio) {
    const pathLink = `./assets/files/${fileName}`
    const texture = new THREE.TextureLoader().load(pathLink);

    

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(size['width']*ratio, size['height']*ratio, 1),
      new THREE.MeshBasicMaterial({
        map: texture
      }));
    this.scene.add(box);
  }



  public displayCircle(points, size, ratio){
    
    let new_radius = points['radius']*ratio
  
    const circle = new THREE.Mesh( 
      new THREE.RingGeometry( new_radius, new_radius + 0.5, 20), 
      new THREE.MeshNormalMaterial()
    );
 
    let middle_x = size['width']/2
    let middle_y = size['height']/2

    let new_x = points['x']*ratio - middle_x*ratio
    let new_y = - points['y']*ratio + middle_y*ratio

    circle.position.set(new_x, new_y, 1)

    this.scene.add( circle );
  }



  public displayDetection(landmark, size, ratio){

    const point = new THREE.Mesh(
      new THREE.SphereGeometry( 1, 5, 5 ),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
    
    let middle_x = size['width']/2
    let middle_y = size['height']/2

    let new_x = landmark['x']*ratio - middle_x*ratio
    let new_y = - landmark['y']*ratio + middle_y*ratio
    
    point.position.set(new_x, new_y, 0)
    
    this.scene.add(point)

  }
}
