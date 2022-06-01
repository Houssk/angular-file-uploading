import {TestBed} from '@angular/core/testing';
import {CameraService} from './camera.service';
import * as THREE from 'three';


describe('CameraService', () => {
  let service: CameraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be return perspective camera', () => {
    const canvas = document.createElement('canvas');
    expect(service.create(canvas)).toEqual(jasmine.any(THREE.OrthographicCamera));
  });
});
