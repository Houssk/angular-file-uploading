import {MathUtils, Mesh, Quaternion, Scene, Vector3, Euler} from 'three';
import {PositionUtil} from 'threejs-position-util';


export class Utils {

  static getPositionByObjectName(scene: Scene, name: string): Vector3 {
    return PositionUtil.getGeometryCenterInWorld(scene.getObjectByName(name) as Mesh)
  }

  static getDistanceByObjectName(a: string, b: string, scene: Scene): number {
    return Utils.getPositionByObjectName(scene, a).distanceTo(Utils.getPositionByObjectName(scene, b));
  }

  static toVector(object) {
    return new Vector3(object.x, object.y, object.z)
  }

  static toEuler(object) {
    return new Euler(MathUtils.degToRad(object.x), MathUtils.degToRad(object.y), MathUtils.degToRad(object.z));
  }

  static getMeshByName(scene: Scene, name: string): Mesh {
    return scene.getObjectByName(name) as Mesh;
  }

  /**
   *  alpha = atan a / b
   */
  static getAtan(a: number, b: number): number {
    return MathUtils.radToDeg(Math.atan(a / b));
  }

  /**
  *
  * @param mesh
  * @param point vecteur
  * @param axis vecteur (0,1,0)
  * @param angle radian 
  */
  static rotateAroundWorldAxis(mesh, point, axis, angle) {
    const q = new Quaternion();
    q.setFromAxisAngle(axis, angle);
    mesh.applyQuaternion(q);
    mesh.position.sub(point);
    mesh.position.applyQuaternion(q);
    mesh.position.add(point);
    return mesh;
  }

  /**
   * @param meshArray
   * @param chin
   * @param point rotation
   * @param measurePoint point pour mesurer la distance
   * @param mm
   */
  static rotateByMmAroundPointAxeX(meshArray: Array<any>, chin, point, measurePoint, mm) {
    const distance = Math.abs((PositionUtil.getGeometryCenterInWorld(point).clone()
      .sub(PositionUtil.getGeometryCenterInWorld(measurePoint))).y);
    const angle = Math.atan(mm / distance);
    meshArray.forEach(mesh => {
      this.rotateAroundWorldAxis(mesh, point, new Vector3(1, 0, 0), angle);
    })
    if (chin) {
      this.rotateAroundWorldAxis(chin, point, new Vector3(1, 0, 0), angle);
    }
  }

  /**
   * @param meshArray
   * @param meshArrayBranch
   * @param chin
   * @param point rotation
   * @param measurePoint point pour mesurer la distance
   * @param mm
   */
  static rotateByMmAroundPointAxeXForCondyle(meshArray: Array<any>, meshArrayBranch: Array<any>, chin, point, measurePoint, mm) {
    const distance = Math.abs((PositionUtil.getGeometryCenterInWorld(point).clone()
      .sub(PositionUtil.getGeometryCenterInWorld(measurePoint))).y);
    const angle = Math.atan(mm / distance);
    meshArray.forEach(mesh => {
      this.rotateAroundWorldAxis(mesh, point, new Vector3(1, 0, 0), angle);
    });
    meshArrayBranch.forEach(mesh => {
      this.rotateAroundWorldAxis(mesh, point, new Vector3(1, 0, 0), angle);
    });
    if (chin) {
      console.log('chin' , chin);
      this.rotateAroundWorldAxis(chin, point, new Vector3(1, 0, 0), angle);
      console.log('chin' , chin.rotation);
    }
  }

  /**
   * @param meshArray
   * @param chin
   * @param point rotation
   * @param measurePoint point pour mesurer la distance
   * @param mm
   */
  static rotateByMmAroundPointAxeY(meshArray: Array<any>, chin, point, measurePoint, mm) {
    const distance = Math.abs((PositionUtil.getGeometryCenterInWorld(point).clone()
      .sub(PositionUtil.getGeometryCenterInWorld(measurePoint))).x);
    const angle = Math.atan(mm / distance);
    meshArray.forEach(mesh => {
      this.rotateAroundWorldAxis(mesh, point, new Vector3(0, 1, 0), angle);
    })
    if (chin) {
      this.rotateAroundWorldAxis(chin, point, new Vector3(0, 1, 0), angle);
    }
  }

  /**
   * @param meshArray
   * @param chin
   * @param point rotation
   * @param measurePoint point pour mesurer la distance
   * @param mm
   */
  static rotateByMmAroundPointAxeZ(meshArray: Array<any>, chin, point, measurePoint, mm) {
    const distance = Math.abs((PositionUtil.getGeometryCenterInWorld(point).clone()
      .sub(PositionUtil.getGeometryCenterInWorld(measurePoint))).y);
    const angle = Math.atan(mm / distance);
    meshArray.forEach(mesh => {
      this.rotateAroundWorldAxis(mesh, point, new Vector3(0, 0, 1), angle);
    })
    if (chin) {
      this.rotateAroundWorldAxis(chin, point, new Vector3(0, 0, 1), angle);
    }
  }
}
