import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {first} from 'rxjs/operators';
import {ApiResponseBase} from '@/_models/api-response-base';

/**
 * @class StorageService
 * @description Used to store data like images
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private http: HttpClient
  ) {

  }

  /**
   * @function uploadFile
   * @param fileToUpload File type
   * @description Uploads a file to storage
   */
  uploadFile(fileUploadUrl: string, fileToUpload: File) {
    if (fileUploadUrl != null) {
      const formData: FormData = new FormData();
      formData.append('uploadFile', fileToUpload, fileToUpload.name);

      return this.http.post<ApiResponseBase>(fileUploadUrl, formData);
    }
  }

  /**
   * @function createUploadUrl
   * @description Create url to access data
   */
  createUploadUrl() {
    return this.http.get<ApiResponseBase>(environment.apiUrl + '/storage/create');
  }
}
