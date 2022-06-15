import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// @ts-ignore
import {Observable} from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

// API url
  baseApiUrl = "http://localhost:3000"

  constructor(private http: HttpClient) {
  }

// Returns an observable
  upload(file: any, path: string): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "image" with file data
    formData.append("image", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(`${this.baseApiUrl}/${path}`, formData)
  }

// Returns the detection
  detection(form: FormGroup, path: string){

    let sideTrad = ['undefined', 'left', 'right']

    let infos = JSON.stringify([
          {
              "nbrHip": form.value['nbrHip'],
              "side": sideTrad[form.value['side']]
          },
      ]);

    const data2send = JSON.parse(infos)

    // Make http post request over api
    const headers = new HttpHeaders();
    headers.set("Accept", "application/json").set('Content-Type', 'application/json')

    return this.http.post(`${this.baseApiUrl}/${path}`, data2send, { headers });
    
  }

  size(deltaCut: number, xDiaph: number, yDiaph: number, xTroch: number, yTroch: number,angle: number, path : string){

    let infos = JSON.stringify([
        {
          "deltaCut": deltaCut,
          "xDiaph": xDiaph,
          "yDiaph": yDiaph,
          "xTroch": xTroch,
          "yTroch": yTroch,
          "angle": angle
        },
      ]);

    const data2send = JSON.parse(infos)

    // Make http post request over api
    const headers = new HttpHeaders();
    headers.set("Accept", "application/json").set('Content-Type', 'application/json')

    return this.http.post(`${this.baseApiUrl}/${path}`, data2send, { headers });
    
  }
}
