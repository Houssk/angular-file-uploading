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
import { FileUploadService } from '@app/file-upload/file-upload.service';

declare global {
  interface Window {
    scene: any;
  }
}


@Injectable({
  providedIn: 'root'
})
export class EngineFrameService implements OnDestroy {
  pathCup: string;
  pathRod: string;
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
    private fileUploadService: FileUploadService
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

  //Load the image and display it 
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

  //Display the circle detected 
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

  //Display the detected landmarks
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

  //Identify the size and position of the cup and display it 
  public onLandmarksDisplayCup(center, corner, size, ratio, scale, side: string){
    let new_w = 0
    let new_h = 0

    let a = center['x'] - corner['x'];
    let b = center['y'] - corner['y'];
    let radius = Math.sqrt( a*a + b*b )*ratio*scale;
    
    [new_w, new_h] = this.selectCupSize(side, radius, scale)
    
    const texture = new THREE.TextureLoader().load(this.pathCup)

    const cup = new THREE.Mesh(
      new THREE.BoxGeometry(new_w, new_h, 1),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      }));

    let middle_x = size['width']/2
    let middle_y = size['height']/2
  
    let new_x = center['x']*ratio - middle_x*ratio
    let new_y = - center['y']*ratio + middle_y*ratio
      
    cup.position.set(new_x, new_y, 0)

    this.scene.add(cup);
  }

  //Identify the size and position of the rod and display it 
  public onLandmarksDisplayRod(topAx, botAx, center, btroch, size, ratio, scale, side: string){
    let pos_y = 0
    let rot = 0
    let axDiaX = 0
    let new_w = 0 //54.6/scale
    let new_h = 0 //203.2/scale
    let h_cut = 0

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
    const angle = Math.atan(a) + rot;

    //Find the markers of the femoral width
    let markers = this.determineRodMarkers(h_cut, topAx, btroch, angle)
    console.log(markers)
    let marker_left =  markers[0].split(' ') //left = ['left','x','y']
    let marker_right = markers[1].split(' ') //right )= ['right','x','y']
    let x_marker_left = parseFloat(marker_left[1])
    let y_marker_left = parseFloat(marker_left[2])
    let x_marker_right = parseFloat(marker_right[1])
    let y_marker_right = parseFloat(marker_right[2])

    //Find the femoral width
    let c = x_marker_left - x_marker_right;
    let d = y_marker_left - y_marker_right;
    let femoral_w = Math.sqrt( c*c + d*d )*ratio*scale;

    [new_w, new_h, pos_y, axDiaX] = this.selectRodSize(side, femoral_w, scale);

    //Display the textre with the correct size
    const texture = new THREE.TextureLoader().load(this.pathRod)
    const rod = new THREE.Mesh(
      new THREE.BoxGeometry(new_w, new_h, 1),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      }));

    //define the middle of the image wich will be the point O of the application world
    let middle_x = size['width']/2
    let middle_y = size['height']/2

    //define the position of the topAx point in the application world
    let topAx_x = topAx['x']*ratio - middle_x*ratio
    let topAx_y = - topAx['y']*ratio + middle_y*ratio

    //define the position to the center of the rod layer before the rotation 
    let x_before_rotate = topAx_x - (axDiaX*0.254/scale)
    let y_before_rotate = topAx_y - (pos_y*0.254/scale)

    //define the point and the axis around which the image will rotate
    const point_rot = new THREE.Vector3( topAx_x, topAx_y, 0 );
    const axis_rot = new THREE.Vector3(0, 0, 1)

    //apply rotation
    Utils.rotateAroundWorldAxis(rod, point_rot, axis_rot, -angle)

    //reset position according to the rotation
    let dist = (center['y']-topAx['y'])*ratio
    let x_after_rotate = x_before_rotate + Math.tan(angle)*dist
    let y_after_rotate = y_before_rotate - dist
    rod.position.set(x_after_rotate, y_after_rotate, 0)

    this.scene.add(rod);
  }

  //Select the cup size from the femoral radius detected 
  public selectCupSize(side: string, radius: number, scale: number){
    let pathLink='undefined'
    let side_id=''
    let size=0
    let w_cup=0
    let h_cup=0

    if (side=='right'){
      side_id='_R'
    }

    if (radius<46){
      size=45      
      if (side=='right'){
        w_cup=64.52/scale 
        h_cup=67.3/scale
      }
      else if (side=='left'){
        w_cup=66/scale 
        h_cup=68.8/scale
      }
    }
    else if(radius<48){
      size=47      
      if (side=='right'){
        w_cup=59.9/scale 
        h_cup=62.7/scale
      }
      else if (side=='left'){
        w_cup=70.87/scale 
        h_cup=70.1/scale
      }
    }
    else if(radius<50){
      size=49
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius<52){
      size=51
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius<54){
      size=53
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius<56){
      size=55
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius<58){
      size=57
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius<60){
      size=59
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius<62){
      size=61
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }
    else if(radius>62){
      size=63
      w_cup=96.2/scale 
      h_cup=77.5/scale
    }

    pathLink = `./assets/images/Cup${size}${side_id}.png`
    this.pathCup = pathLink
    return [w_cup, h_cup]
  }

  //Select the cup size from the femoral width detected
  public selectRodSize(side: string, femoral_w: number, scale: number){
    let pathLink='undefined'
    let side_id=''
    let size=''
    let w_rod= 0
    let h_rod= 0 
    let pos_y = 0
    let axDiaX = 0

    if (side=='right'){
      side_id='_R'
    }

    if (femoral_w<0){
      size='T1'
      w_rod=51.3/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -77
      }
      else if (side=='left'){ 
        pos_y = 371
        axDiaX = 77
      }
    }
    else if (femoral_w<0){
      size='T2'
      w_rod=52.8/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -78
      }
      else if (side=='left'){ 
        pos_y = 371
        axDiaX = 78
      }
    }
    else if (femoral_w<0){
      size='T3'
      w_rod=54.6/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -77.5
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 77.5
      }
    }
    else if (femoral_w<0){
      size='T4'
      w_rod=56.1/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -78.5
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 78.5
      }
    }
    else if (femoral_w<0){
      size='T5'
      w_rod=57.9/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -79
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 79
      }
    }
    else if (femoral_w<0){
      size='T6'
      w_rod=59.7/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -79.5
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 79.5
      }
    }
    else if (femoral_w<0){
      size='T7'
      w_rod=61.5/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -80
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 80
      }
    }
    else if (femoral_w<0){
      size='T8'
      w_rod=63/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -81
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 81
      }
    }
    else if (femoral_w<0){
      size='T9'
      w_rod=64.8/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -82.5
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 82.5
      }
    }
    else if (femoral_w<0){
      size='T10'
      w_rod=66.3/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -83.5
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 83.5
      }
    }
    else if (femoral_w<0){
      size='T11'
      w_rod=67.3/scale
      h_rod=203.2/scale
      if (side=='right'){
        pos_y = 371
        axDiaX = -84.5
      }
      else if (side=='left'){
        pos_y = 371
        axDiaX = 84.5
      }
    }

    pathLink = `./assets/images/hype_scs_${size}${side_id}.png`
    this.pathRod = pathLink
    return [w_rod, h_rod, pos_y, axDiaX]
  }


  //Determine the size of the rod
  public async determineRodMarkers(yCut, diaph, troch, angle){
    let xDiaph=diaph['x']
    let yDiaph=diaph['y']
    let xTroch=troch['x']
    let yTroch=troch['y'] 

    return new Promise(resolve =>{
      this.fileUploadService.size(yCut, xDiaph, yDiaph, xTroch, yTroch, angle, 'rodSize').subscribe( //this.path
        (event: any) => { //event will be ['left x y', 'right x y']
          console.log(event)
          resolve(event)
        }); 
      })
    }  
}