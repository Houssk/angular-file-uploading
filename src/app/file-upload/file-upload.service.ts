import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {Observable} from 'rxjs';
import {environment} from "@environments/environment";
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

// API url
  baseApiUrl = environment.serverLink;

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
  detection(form: FormGroup, path: string){
    // Make http post request over api
    return this.http.post(`${this.baseApiUrl}/${path}`, 'test');
    
  }
}
