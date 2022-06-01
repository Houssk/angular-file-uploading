import {Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {EngineFrameService} from './engine-frame.service';


/**
 * Engine 3D
 */
@Component({
  selector: 'app-engine-frame',
  templateUrl: './engine-frame.component.html',
  styleUrls: ['./engine-frame.component.scss'],
})
export class EngineFrameComponent implements OnInit, OnChanges {

  @Output() toggleOutput = new EventEmitter<any>();
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;



  /**
   * Contructor
   * @param engService
   */
  constructor(private engService: EngineFrameService) {
  }

  ngOnChanges() {
    this.engService.resize();
  }

  ngOnInit(): void {
    this.engService.createScene(this.rendererCanvas);
    this.engService.animate();

  }
}
