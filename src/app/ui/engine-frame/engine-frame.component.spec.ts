import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { EngineFrameComponent } from './engine-frame.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule} from '@angular/material/snack-bar';

// @ts-ignore
describe('EngineFrameComponent', () => {
  let component: EngineFrameComponent;
  let fixture: ComponentFixture<EngineFrameComponent>;

  // @ts-ignore
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule , MatSnackBarModule],
      providers: [{
        provide: MAT_SNACK_BAR_DATA,
        useValue: {},
      }],
      declarations: [ EngineFrameComponent ]
    })
    .compileComponents();
  }));

  // @ts-ignore
  beforeEach(() => {
    fixture = TestBed.createComponent(EngineFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // @ts-ignore
  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
