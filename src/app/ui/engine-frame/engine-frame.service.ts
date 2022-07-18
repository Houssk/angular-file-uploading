import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {ControlsService} from '@app/services/three/controls.service';
import {CameraService} from '@app/services/three/camera.service';
import {RendererService} from '@app/services/three/renderer.service';
import {LightService} from '@app/services/three/light.service';
import {SceneService} from '@app/services/three/scene.service';
import {AxesHelper} from "three";
import {Xliff2} from '@angular/compiler';
import {Utils} from '@app/shared/class/Utils';
import {FileUploadService} from '@app/file-upload/file-upload.service';
import {ImageProcessingService} from "@app/shared/service/image-processing.service";

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
    private fileUploadService: FileUploadService,
    private imageProcessing: ImageProcessingService
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
      new THREE.BoxGeometry(size['width'] * ratio, size['height'] * ratio, 1),
      new THREE.MeshBasicMaterial({
        map: texture
      }));
    this.scene.add(box);
  }

  //Display the circle detected
  public displayCircle(points, size, ratio) {

    let new_radius = points['radius'] * ratio

    const circle = new THREE.Mesh(
      new THREE.RingGeometry(new_radius, new_radius + 0.5, 20),
      new THREE.MeshNormalMaterial()
    );

    let middle_x = size['width'] / 2
    let middle_y = size['height'] / 2

    let new_x = points['x'] * ratio - middle_x * ratio
    let new_y = -points['y'] * ratio + middle_y * ratio

    circle.position.set(new_x, new_y, 1)

    this.scene.add(circle);
  }

  //Display the detected landmarks
  public displayDetection(landmark, size, ratio) {

    const point = new THREE.Mesh(
      new THREE.SphereGeometry(1, 5, 5),
      new THREE.MeshBasicMaterial({color: 0xff0000})
    );

    let middle_x = size['width'] / 2
    let middle_y = size['height'] / 2

    let new_x = landmark['x'] * ratio - middle_x * ratio
    let new_y = -landmark['y'] * ratio + middle_y * ratio

    point.position.set(new_x, new_y, 0)

    this.scene.add(point)

  }

  //Identify the size and position of the cup and display it
  public onLandmarksDisplayCup(center, corner, size, ratio, scale, side: string) {
    let new_w = 0
    let new_h = 0

    let a = center['x'] - corner['x'];
    let b = center['y'] - corner['y'];
    let radius = Math.sqrt(a * a + b * b) * ratio * scale;
    let radius_retake = radius - 2 ; //to select the size below
    [new_w, new_h] = this.selectCupSize(side, radius_retake, scale)
    const texture = new THREE.TextureLoader().load(this.pathCup)
    const cup = new THREE.Mesh(
      new THREE.BoxGeometry(new_w, new_h, 1),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      }));
    let middle_x = size['width'] / 2
    let middle_y = size['height'] / 2
    let new_x = center['x'] * ratio - middle_x * ratio
    let new_y = -center['y'] * ratio + middle_y * ratio
    cup.position.set(new_x, new_y, 0)
    this.scene.add(cup);
  }

  //Identify the size and position of the rod and display it
  public onLandmarksDisplayRod(topAx, botAx, center, btroch, size, ratio, scale, side: string) {
    let pos_x
    let pos_y = 0
    let rot = 0
    let axDiaX = 0
    let new_w = 0 //54.6/scale
    let new_h = 0 //203.2/scale
    let h_cut = 50/(scale*ratio) // 50mm :distance from bTroch at which the diaphyseal width is measured (in original pixels)

    //Find the directing coef to find the angle between the detected axe and the vertical line
    let a = this.imageProcessing.getSlope(topAx['x'], topAx['y'], botAx['x'], botAx['y'])
    //Find the final angle
    rot = this.imageProcessing.getFinalAngle(topAx['x'], botAx['x']);
    const angle = Math.atan(a) + rot;
    //Find the markers of the femoral width
    let markers = this.determineRodMarkers(h_cut, topAx, btroch, angle).then(value => {
      console.log(markers);
      console.log(value);
      let femoral_w = this.imageProcessing.getFemoralWidth(value, ratio, scale);
      let femoral_w_retake = femoral_w - 2.9 ; //to select the size below
      [new_w, new_h, pos_x, pos_y, axDiaX] = this.selectRodSize(side, femoral_w_retake, scale);
      //Display the texture with the correct size
      const texture = new THREE.TextureLoader().load(this.pathRod)
      const rod = new THREE.Mesh(
        new THREE.BoxGeometry(new_w, new_h, 1),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        }));

      //define the middle of the image wich will be the point O of the application world
      let middle_x = size['width'] / 2
      let middle_y = size['height'] / 2

      //define the position of the topAx point in the application world
      let world_topAx_x = topAx['x'] * ratio - middle_x * ratio
      let world_topAx_y = -topAx['y'] * ratio + middle_y * ratio

      //define the position to the center of the rod layer before the rotation
      let rodImageRatio = 0.254 // mm/pix 
      let world_pos_x = pos_x * rodImageRatio / scale
      let world_pos_y = pos_y * rodImageRatio / scale
      let world_axDiaX = axDiaX * rodImageRatio / scale
      let x_before_rotate = world_topAx_x - world_axDiaX 
      let y_before_rotate = world_topAx_y - world_pos_y
      let pos_x_before_rotate = x_before_rotate + world_pos_x

      //define the point and the axis around which the image will rotate
      const point_rot = new THREE.Vector3(world_topAx_x , world_topAx_y, 0); 
      const axis_rot = new THREE.Vector3(0, 0, 1)

      rod.position.set(x_before_rotate, y_before_rotate, 0)
      //apply rotation
      Utils.rotateAroundWorldAxis(rod, point_rot, axis_rot, -angle)
      
      let dist = (center['y'] - topAx['y']) * ratio //distance between the meca point and the center before rotation
      let deltaRot = (pos_x_before_rotate-world_topAx_x)*Math.sin(-angle) //the y offset generated after rotation

      //apply a translation along the y axis of the rod layer (axis is rotated with the object)
      rod.translateY(-dist-deltaRot)

      this.scene.add(rod);
    })
  }

  //Calculate and display the femoral offset
  public displayFemoralOffset(center, topAx, botAx, size, ratio, scale){
      const middle_x = size['width'] / 2
      const middle_y = size['height'] / 2
      
      const world_topAx_x = topAx['x'] * ratio - middle_x * ratio
      const world_topAx_y = -topAx['y'] * ratio + middle_y * ratio
      const world_botAx_x = botAx['x'] * ratio - middle_x * ratio
      const world_botAx_y = -botAx['y'] * ratio + middle_y * ratio
      const world_center_x = center['x'] * ratio - middle_x * ratio
      const world_center_y = -center['y'] * ratio + middle_y * ratio

      const centerVector = new THREE.Vector3(world_center_x, world_center_y, 0)
      const fPointVector = this.calculateFemoralOffset(world_center_x, world_center_y, world_topAx_x, world_topAx_y, world_botAx_x, world_botAx_y)

      const femoralPoint = new THREE.Mesh(
        new THREE.SphereGeometry(1, 5, 5),
        new THREE.MeshBasicMaterial({color: 0xffff00})
      );
      femoralPoint.position.set(fPointVector.x, fPointVector.y, fPointVector.z)
      this.scene.add(femoralPoint);

      const centerPoint = new THREE.Mesh(
        new THREE.SphereGeometry(1, 5, 5),
        new THREE.MeshBasicMaterial({color: 0xffff00})
      );
      centerPoint.position.set(centerVector.x, centerVector.y, centerVector.z)
      this.scene.add(centerPoint);

      const points = [centerVector, fPointVector];
      const line = new THREE.Line( 
        new THREE.BufferGeometry().setFromPoints( points ), 
        new THREE.LineBasicMaterial( { color: 0xffff00 } )
        );
      line.translateZ(1)
      this.scene.add( line );
      
      const dist = centerVector.distanceTo(fPointVector)

      const resultDist = (dist*scale).toPrecision(5).toString() + " mm";
      const val = this.makeTextSprite( resultDist, 
        { fontsize: 44, textColor: {r:255, g:255, b:0, a:1.0}} );
      val.position.set(centerVector.x, centerVector.y+5, 1)
      this.scene.add(val);
  }

  //calculate the femoral offset
  public calculateFemoralOffset(centerX: number, centerY: number, topAxX: number, topAxY: number, botAxX: number, botAxY: number) {

    const top = new THREE.Vector3(topAxX, topAxY, 0)
    const bot = new THREE.Vector3(botAxX, botAxY, 0)
    const center = new THREE.Vector3(centerX, centerY, 0);
    const diaphAxis = new THREE.Line3(top, bot)

    let target = new THREE.Vector3(0, 0, 0)

    diaphAxis.closestPointToPoint(center, false, target)
    console.log(target)
    return target
  }

  public displayHeightEstimation(firstLTroch, secondLTroch, size, ratio, scale) {
    const middle_x = size['width'] / 2
    const middle_y = size['height'] / 2
      
    const world_firstLTroch_x = firstLTroch['x'] * ratio - middle_x * ratio
    const world_firstLTroch_y = -firstLTroch['y'] * ratio + middle_y * ratio
    const firstLTVector = new THREE.Vector3(world_firstLTroch_x, world_firstLTroch_y , 0)

    const world_secondLTroch_x = secondLTroch['x'] * ratio - middle_x * ratio
    const world_secondLTroch_y = -secondLTroch['y'] * ratio + middle_y * ratio
    const secondLTVector = new THREE.Vector3(world_secondLTroch_x, world_secondLTroch_y, 0)

    const heightVector = new THREE.Vector3(world_firstLTroch_x, world_secondLTroch_y, 0)

    const firstLTlPoint = new THREE.Mesh(
      new THREE.SphereGeometry(1, 5, 5),
      new THREE.MeshBasicMaterial({color: 0xffff00})
    );
    firstLTlPoint.position.set(world_firstLTroch_x, world_firstLTroch_y, 0)
    this.scene.add(firstLTlPoint);

    const secondLTlPoint = new THREE.Mesh(
      new THREE.SphereGeometry(1, 5, 5),
      new THREE.MeshBasicMaterial({color: 0xffff00})
    );
    secondLTlPoint.position.set(world_secondLTroch_x , world_secondLTroch_y, 0)
    this.scene.add(secondLTlPoint);

    const height = firstLTVector.distanceTo(heightVector)

    const pointsH = [firstLTVector, heightVector];
      const lineH = new THREE.Line( 
        new THREE.BufferGeometry().setFromPoints( pointsH ), 
        new THREE.LineBasicMaterial( { color: 0xffff00 } )
        );
      lineH.translateZ(1)
      this.scene.add( lineH );

    const pointsW = [heightVector, secondLTVector];
      const lineW = new THREE.Line( 
        new THREE.BufferGeometry().setFromPoints( pointsW ), 
        new THREE.LineBasicMaterial( { color: 0xffff00 } )
        );
      lineW.translateZ(1)
      this.scene.add( lineW );

      const resultHeight = (height*scale).toPrecision(4).toString() + " mm";
      const val = this.makeTextSprite( resultHeight, 
        { fontsize: 44, textColor: {r:255, g:255, b:0, a:1.0}} );
      val.position.set(world_firstLTroch_x, world_firstLTroch_y+5, 1)
      this.scene.add(val);

  }


  //display a text
  public makeTextSprite( message, parameters )
    {
        if ( parameters === undefined ) parameters = {};
        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:0, g:0, b:255, a:1.0 };
        var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

        var canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context!.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context!.measureText( message );

        context!.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context!.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context!.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
        context!.fillText( message, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas) 
        texture.needsUpdate = true;
        var spriteMaterial = new THREE.SpriteMaterial( {map: texture} );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
        return sprite;  
    }

  //Select the cup size from the femoral radius detected
  public selectCupSize(side: string, radius: number, scale: number) {
    let pathLink = 'undefined'
    let side_id = ''
    let size = 0
    let w_cup = 0
    let h_cup = 0
    let dia = radius*2

    if (side == 'right') {
      side_id = '_R'
    }

    if (dia < 46) {
      size = 45
      if (side == 'right') {
        w_cup = 64.52 / scale
        h_cup = 67.3 / scale
      } else if (side == 'left') {
        w_cup = 66 / scale
        h_cup = 68.8 / scale
      }
    } else if (dia < 48) {
      size = 47
      if (side == 'right') {
        w_cup = 59.9 / scale
        h_cup = 62.7 / scale
      } else if (side == 'left') {
        w_cup = 70.87 / scale
        h_cup = 70.1 / scale
      }
    } else if (dia < 50) {
      size = 49
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia < 52) {
      size = 51
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia < 54) {
      size = 53
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia < 56) {
      size = 55
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia < 58) {
      size = 57
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia < 60) {
      size = 59
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia < 62) {
      size = 61
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    } else if (dia > 62) {
      size = 63
      w_cup = 96.2 / scale
      h_cup = 77.5 / scale
    }

    console.log('rayon mesuré ', radius)
    pathLink = `./assets/images/Cup${size}${side_id}.png`
    this.pathCup = pathLink
    console.log("Cupule : ", size)
    return [w_cup, h_cup]
  }

  //Select the cup size from the femoral width detected
  public selectRodSize(side: string, femoral_w: number, scale: number) {

    const {w_rod, h_rod, pos_x, pos_y, axDiaX, pathLink} = this.imageProcessing.computeSize(femoral_w, scale, side);
    console.log("Tige : ", pathLink)
    this.pathRod = pathLink
    return [w_rod, h_rod, pos_x, pos_y, axDiaX]
  }


  //Determine the size of the rod
  public async determineRodMarkers(yCut, diaph, troch, angle) {
    let xDiaph = diaph['x']
    let yDiaph = diaph['y']
    let xTroch = troch['x']
    let yTroch = troch['y']

    return new Promise(resolve => {
      this.fileUploadService.size(yCut, xDiaph, yDiaph, xTroch, yTroch, angle, 'rodSize').subscribe( //this.path
        (event: any) => { //event will be ['left x y', 'right x y'] or ['Error'] if no detection
          resolve(event)
        });
    })
  }
}
