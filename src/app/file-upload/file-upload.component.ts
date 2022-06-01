import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';
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
  response = null;
  // @ts-ignore
  file: File = null; // Variable to store file

  // Inject service
  constructor(private fileUploadService: FileUploadService, private engineFrameService: EngineFrameService) {
  }

  ngOnInit(): void {
  }

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file, 'upload').subscribe( //this.path
      (event: any) => {
        this.shortLink = `${environment.serverLink}${event.filename}`;
        console.log('event', event[1]);

        const size = event[0]['original_size']
        let ratio = 200 / size['width']; //set the displayed image width to 200mm

        this.response = event[0]['detection'];
        this.loading = false; // Flag variable
        this.engineFrameService.loadImage(event[1], size, ratio);
        this.engineFrameService.displayCircle(event[0]['detection'], size, ratio);

      }
    );
  }

  //OnClik of button Automatic detectoon
  onDetection() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file, 'detection').subscribe( //this.path
      (event: any) => {
        this.shortLink = `${environment.serverLink}${event.filename}`;
        console.log('event', event[1]);

        const size = event[0]['original_size']
        let ratio = 200 / size['width']; //set the displayed image width to 200mm

        this.response = event[0]['detection'];
        this.loading = false; // Flag variable

        this.engineFrameService.displayDetection(event[0]['detection']['big_troch'], size, ratio); //big_troch
        this.engineFrameService.displayDetection(event[0]['detection']['little_troch'], size, ratio);
        this.engineFrameService.displayDetection(event[0]['detection']['bot_ax'], size, ratio);
        this.engineFrameService.displayDetection(event[0]['detection']['top_ax'], size, ratio);
        this.engineFrameService.displayDetection(event[0]['detection']['center'], size, ratio);
        this.engineFrameService.displayDetection(event[0]['detection']['corner'], size, ratio);

      }
    );
  }
}
