import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {Observable} from 'rxjs';

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

    // Store form name as "file" with file data
    formData.append("image", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(`${this.baseApiUrl}/${path}`, formData)
  }

// Returns the detection
  detection(filename: string, path: string){

    // Make http post request over api
    return this.http.post(`${this.baseApiUrl}/${path}`, 'received');
  }
}
