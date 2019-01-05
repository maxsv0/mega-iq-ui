import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {first} from 'rxjs/operators';
import {ApiResponseBase} from '@/_models/api-response-base';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  fileUploadUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.createUploadUrl();
  }

  uploadFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('uploadFile', fileToUpload, fileToUpload.name);

    return this.http.post<ApiResponseBase>(this.fileUploadUrl, formData);
  }

  createUploadUrl() {
    this.http.get<ApiResponseBase>(environment.apiUrl + '/storage/create')
      .pipe(first())
      .subscribe(data => {
        if (data.ok) {
          this.fileUploadUrl = data.msg;
        }
      });
  }
}
