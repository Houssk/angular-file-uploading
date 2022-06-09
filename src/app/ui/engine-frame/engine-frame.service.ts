import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {ControlsService} from '@app/services/three/controls.service';
import {CameraService} from '@app/services/three/camera.service';
import {RendererService} from '@app/services/three/renderer.service';
import {LightService} from '@app/services/three/light.service';
import {SceneService} from '@app/services/three/scene.service';
import {AxesHelper} from "three";
import { Xliff2 } from '@angular/compiler';
import { Utils } from '@app/shared/class/Utils';


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

  
  public onLandmarksDisplayCup(landmark, size, ratio, scale, side: string){
    let pathLink: string
    pathLink='undefined'

    // wPix=1136	hPix=915	wCm=9.62	hCm=7.75
    if (side=='right'){
      pathLink = `./assets/images/Cup49_R.png`
    }
    else if (side=='left'){
      pathLink = `./assets/images/Cup49.png`
    }
    
    const texture = new THREE.TextureLoader().load(pathLink)

    let new_w = 96.2/scale
    let new_h = 77.5/scale

    const cup = new THREE.Mesh(
      new THREE.BoxGeometry(new_w, new_h, 1),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      }));

    let middle_x = size['width']/2
    let middle_y = size['height']/2
  
    let new_x = landmark['x']*ratio - middle_x*ratio
    let new_y = - landmark['y']*ratio + middle_y*ratio
      
    cup.position.set(new_x, new_y, 0)

    this.scene.add(cup);
  }


  public onLandmarksDisplayRod(topAx, botAx, center, size, ratio, scale, side: string){
    let pathLink: string
    pathLink='undefined'
    let pos_x = 0
    let pos_y = 0
    let rot = 0
    let axDiaX = 0

    // wPix=215	wCm=5.46	hPix=800	hCm=20.32 rapportmm/px=O.254
    if (side=='right'){
      pathLink = `./assets/images/hype_scs_T3_R.png` //ptmecahaut x=81.5 y=371 //axDiaph x=-80
      pos_x = 81.5 //can be commented
      pos_y = 371
      axDiaX = -80
    }
    else if (side=='left'){
      pathLink = `./assets/images/hype_scs_T3.png` //ptmecahaut x=-79.5 y=371 //axDiaph x=78
      pos_x = -79.5
      pos_y = 371
      axDiaX = 78
    }

    const texture = new THREE.TextureLoader().load(pathLink)

    let new_w = 54.6/scale
    let new_h = 203.2/scale

    const rod = new THREE.Mesh(
      new THREE.BoxGeometry(new_w, new_h, 1),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      }));

    //define the middle of the image wich will be the point O of the application world
    let middle_x = size['width']/2
    let middle_y = size['height']/2

    //Find the directing coef to find the angle between the detected axe and the vertical line
    const x1 = topAx['x']
    const y1 = topAx['y']
    const x2 = botAx['x']
    const y2 = botAx['y']
    let a = 0
    if ((x1-x2) != 0) {
      a = (y2-y1)/(x2-x1) }
    else {
      a = (y2-y1/0.001) }

    //Find the final angle 
    if (topAx['x']>botAx['x']){
      rot= Math.PI/2
    }
    else {
      rot= - Math.PI/2
    }
    const angle = Math.atan(a) + rot

    //define the position of the topAx point in the application world
    let topAx_x = topAx['x']*ratio - middle_x*ratio
    let topAx_y = - topAx['y']*ratio + middle_y*ratio

    //define the position to the center of the rod layer before the rotation 
    let x_before_rotate = topAx_x - (axDiaX*0.254/scale)
    let y_before_rotate = topAx_y - (pos_y*0.254/scale)

    //define the point and the axis around which the image will rotate
    const point_rot = new THREE.Vector3( topAx_x, topAx_y, 0 );
    const axis_rot = new THREE.Vector3(0, 0, 1)

    // TO DELETE
    const point = new THREE.Mesh(
      new THREE.SphereGeometry( 1, 5, 5 ),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
      );
    point.position.set(x_before_rotate, y_before_rotate, 0)
    this.scene.add(point);
    //

    //apply rotation
    Utils.rotateAroundWorldAxis(rod, point_rot, axis_rot, -angle)

    //reset position according to the rotation
    let dist = (center['y']-topAx['y'])*ratio
    let x_after_rotate = x_before_rotate + Math.tan(angle)*dist
    let y_after_rotate = y_before_rotate - dist
    rod.position.set(x_after_rotate, y_after_rotate, 0)

    this.scene.add(rod);
  }


}
