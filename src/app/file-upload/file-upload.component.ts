import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
// @ts-ignore
import {EngineFrameService} from "@app/ui/engine-frame/engine-frame.service";
import {environment} from "@environments/environment";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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
  displayedRatio: number //ratio between pixels and size displayed : mm/pix
  scale: number //scale : real mm/image mm
  // @ts-ignore
  file: File = null; // Variable to store file
  fileUploaded=false; // indicates if an image had been loaded or not
  formCircle = new FormGroup({
    diam_mm: new FormControl() //variable to store the circle diameter in mm  
  }); 
  diam_pix: number //variable to store the circle diameter in real image pix
  formHip = new FormGroup({
    nbrHip: new FormControl(''),
    side: new FormControl('')
  }); //checkbox form
  

  // Inject service
  constructor(private fileUploadService: FileUploadService, private engineFrameService: EngineFrameService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  verif() {
    if (this.formHip.value['nbrHip'] == '' || this.formHip.value['side'] == '') {
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
        this.fileUploaded = true ;
        this.shortLink = `${environment.serverLink}/${event.filename}`;
        const size = event[0]['original_size']
        this.displayedRatio = 200 / size['width']; //set the displayed image width to 200mm
        this.response = event[0]['detection'];
        this.loading = false; // Flag variable
        this.engineFrameService.loadImage(event[1], size, this.displayedRatio);
        this.engineFrameService.displayCircle(event[0]['detection'], size, this.displayedRatio);
        this.diam_pix = event[0]['detection']['radius']*2
      }
    );
  }

  openScale(content) {
    this.modalService.open(content).result.then(() => {
      this.scale = this.formCircle.value['diam_mm'] / (this.diam_pix * this.displayedRatio)
  });
  }

  //OnClik of button Automatic detection
  onDetection() {
    this.loading = !this.loading;

    this.fileUploadService.detection(this.formHip, 'detection').subscribe( //this.path
      (event: any) => {
        this.shortLink = `${environment.serverLink}/${event.filename}`;
        const size = event[0]['original_size']
        this.response = event[0];
        this.loading = false; // Flag variable

        const arrayPoint = ['big_troch', 'little_troch', 'bot_ax', 'top_ax', 'center', 'corner'];
        arrayPoint.forEach(point => {
          this.engineFrameService.displayDetection(event[0]['detection'][point], size, this.displayedRatio); //big_troch
        })
        this.engineFrameService.onLandmarksDisplayCup(event[0]['detection']['center'], event[0]['detection']['corner'], size, this.displayedRatio, this.scale, event[0]['side'])
        this.engineFrameService.onLandmarksDisplayRod(event[0]['detection']['top_ax'], event[0]['detection']['bot_ax'], event[0]['detection']['center'], event[0]['detection']['big_troch'], size, this.displayedRatio, this.scale, event[0]['side'])
      }
    );
  }
}

