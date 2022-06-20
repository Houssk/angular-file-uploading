import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
// @ts-ignore
import {EngineFrameService} from "@app/ui/engine-frame/engine-frame.service";

import {environment} from "@environments/environment";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

  @Input() path = ''
  // Variable to store shortLink from api response
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  response: any //= null;
  ratio: number //ratio between pixels and size displayed : mm/pix
  scale: number //scale : real mm/image mm
  // @ts-ignore
  file: File = null; // Variable to store file
  form = new FormGroup({
    nbrHip: new FormControl(''),
    side: new FormControl('')
  }); //checkbox form

  // Inject service
  constructor(private fileUploadService: FileUploadService, private engineFrameService: EngineFrameService) {
  }

  ngOnInit(): void {
  }

  verif() {
    if (this.form.value['nbrHip'] == '' || this.form.value['side'] == '') {
      return true
    } else {
      return false
    }
  }

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    this.fileUploadService.upload(this.file, 'upload').subscribe( //this.path
      (event: any) => {
        this.shortLink = `${environment.serverLink}/${event.filename}`;
        const size = event[0]['original_size']
        this.ratio = 200 / size['width']; //set the displayed image width to 200mm
        this.response = event[0]['detection'];
        this.loading = false; // Flag variable
        this.engineFrameService.loadImage(event[1], size, this.ratio);
        this.engineFrameService.displayCircle(event[0]['detection'], size, this.ratio);
        let circleRadius = 12 //12mm
        this.scale = circleRadius / (event[0]['detection']['radius'] * this.ratio)
      }
    );
  }

  //OnClik of button Automatic detection
  onDetection() {
    this.loading = !this.loading;

    this.fileUploadService.detection(this.form, 'detection').subscribe( //this.path
      (event: any) => {
        this.shortLink = `${environment.serverLink}/${event.filename}`;
        const size = event[0]['original_size']
        this.response = event[0];
        this.loading = false; // Flag variable

        const arrayPoint = ['big_troch', 'little_troch', 'bot_ax', 'top_ax', 'center', 'corner'];
        arrayPoint.forEach(point => {
          this.engineFrameService.displayDetection(event[0]['detection'][point], size, this.ratio); //big_troch
        })
        this.engineFrameService.onLandmarksDisplayCup(event[0]['detection']['center'], event[0]['detection']['corner'], size, this.ratio, this.scale, event[0]['side'])
        this.engineFrameService.onLandmarksDisplayRod(event[0]['detection']['top_ax'], event[0]['detection']['bot_ax'], event[0]['detection']['center'], event[0]['detection']['big_troch'], size, this.ratio, this.scale, event[0]['side'])
      }
    );
  }
}

