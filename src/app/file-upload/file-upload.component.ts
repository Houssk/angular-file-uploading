import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';
// @ts-ignore
import {EngineFrameService} from "@app/ui/engine-frame/engine-frame.service";

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
    this.fileUploadService.upload(this.file, this.path).subscribe(
      (event: any) => {
        this.shortLink = `http://localhost:3000/${event.filename}`;
        console.log('event', event[1]);
        this.response = event;
        this.loading = false; // Flag variable
        this.engineFrameService.loadImage(event[1]);
      }
    );
  }
}
