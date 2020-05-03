import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiResponseBase, ApiResponseTestResultList, ApiResponseUser, ApiResponseUsersList, ApiResponseUsersTop, User} from '@/_models';
import {environment} from '../../environments/environment';
import {ApiResponseGeoIp} from '@/_models/api-response-geoip';
import {APP_LOCALE_ID} from '../../environments/app-locale';
import { Rating } from '@/_models/rating';

/**
 * @class UserService
 * @description Gets different type of users
 */
@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {
  }

  /**
   * @function getTop
   * @description Gets users for top ranking
   */
  getTop() {
    return this.http.get<ApiResponseUsersTop>(environment.apiUrl + '/user/top');
  }

  /**
   * @function getAll
   * @description Gets all users
   */
  getAll() {
    return this.http.get<ApiResponseUsersList>(environment.apiUrl + '/user/list');
  }

  /**
   * @function getById
   * @param id User id
   * @param page Pagination page nr.
   * @description Gets a user by user Id
   */
  getById(id: number, page: number) {
    return this.http.get<ApiResponseTestResultList>(environment.apiUrl + `/user/${id}?page=${page}`);
  }

  /**
   * @function getMyInfo
   * @description Gets a user's info
   */
  getMyInfo() {
    return this.http.get<ApiResponseUser>(environment.apiUrl + `/user`);
  }

  /**
   * @function register
   * @param user User model
   * @description Registers a new user
   */
  register(user: User) {
    return this.http.post<ApiResponseUser>(environment.apiUrl + '/user/new', user);
  }

  /**
   * @function forget
   * @param user User model
   * @description
   */
  forget(user: User) {
    return this.http.post<ApiResponseBase>(environment.apiUrl + '/user/forget', user);
  }

  /**
   * @function update
   * @param user User model
   * @description Updates user after i.e. saving to settings
   */
  update(user: User) {
    return this.http.post<ApiResponseUser>(environment.apiUrl + `/user/${user.id}`, user);
  }

  /**
   * @function verifyEmail
   * @description Verifies user email in user settings
   */
  verifyEmail() {
    return this.http.get<ApiResponseBase>(environment.apiUrl + '/user/verify');
  }

  /**
   * @function verifyEmailCheck
   * @param code
   */
  verifyEmailCheck(code: string) {
    return this.http.post<ApiResponseBase>(environment.apiUrl + '/user/verify', code);
  }

  /**
   * @function detectLocation
   * @description Detects location of user in user settings
   */
  detectLocation() {
    return this.http.get<ApiResponseGeoIp>(environment.apiGeoIpUrl + '/ip?locale=' + APP_LOCALE_ID.toUpperCase());
  }

  /**
   * @function deleteCertificate
   * @description deletes user certificate
   */
  deleteCertificate() {
    return this.http.get<ApiResponseBase>(environment.apiUrl + '/user/deleteCertificate');
  }

  /**
   * @function getAvatarsDefault
   * @description Shows default avatars that user can use in user settings
   */
  getAvatarsDefault() {
    return [
      'https://lh3.googleusercontent.com/INTuvwHpiXTigV8UQWi5MpSaRt-0mimAQL_eyfGMOynRK_USId0_Z45KFIrKI3tp21J_q6panwRUfrDOBAqHbA',
      'https://lh3.googleusercontent.com/Pjnej65ZS1_DqA-akORx7OHfMtahUiwgtUDOszL2LcbpP3RbROVz5U48N5gcwd0RSBGhdvlaBUtmXQ7VfnM',
      'https://lh3.googleusercontent.com/UYZHF0NvpK-D7LFvXjHfWx3qf_FHEUz0LxCpSNoacI-BwTSUwvk1NFzKhL8L2Qn_uQ_vKJT1TC6m4WlRa5ntNQ',
      'https://lh3.googleusercontent.com/aMC2L9FNILZSHYIQX2BKcr1967r2JBXI__ihJf8P_ux0dyAhtKGTIemHhVdZtKKeX9CXrRxagsLRZ3Yi6Og',
      'https://lh3.googleusercontent.com/q5Yql4cOJt3zhloY6VPwq-jTh1Fev1WkdsIUWomCpgbnwjKXUjlfmVUeQwUbM3txG4dNOL4u6iYk1aSs1Qsg',
      'https://lh3.googleusercontent.com/U1XNjnXDG5l3YOFguuC4gxFeVZvTrs09dzGMDPA7yHh0J-5XtoXQgOcFjFipgieJqJeA88YHvdmKhlItCBc',
      'https://lh3.googleusercontent.com/lBNWn4fHC0NwZgDHXzNHqaEEEY58G233jLGsg0MIyG2fMT6xslJ-uMjx0yKHC2dYlz_uN82eEH7OCgu76dI',
      'https://lh3.googleusercontent.com/8m39DcXMIs7E8OCn8R0lirvIBK4sh1DK3QvapKqbfsrDAw9Q96TnRP1qYuHccYP7PDrAAaCB2bm6kQRjW3Qo',
      'https://lh3.googleusercontent.com/tuw6slWlwIeL3PewrRnDPVTfpuR5OPrDsMTNmDQnb3KQDBFqsuJl8MFfNAkCVXkPcmz0BoM6rvw2XxE10eGX',
      'https://lh3.googleusercontent.com/0afftGjZogSfSZ08FwQ2Ijg-QSFCAkSqTDw_WWEIoE-hKKhjh9tqDfkKNExNBWbuiJuEWDse_C5qrqPCMpM'
    ];
  }

  /**
   * @function sendFeedback
   * @param feedback Rating
   * @description Sends user feedback per question.
   */
  sendFeedback(feedback: Rating) {
    return this.http.post<ApiResponseBase>(environment.apiUrl + '/user/feedback', feedback);
  }
}
