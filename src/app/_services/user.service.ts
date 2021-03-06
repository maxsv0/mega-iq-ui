import {Inject, Injectable, Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiResponseBase, ApiResponseTestResultList, ApiResponseUser, ApiResponseUsersList, ApiResponseUsersTop, User} from '@/_models';
import {environment} from '../../environments/environment';
import {ApiResponseGeoIp} from '@/_models/api-response-geoip';
import {APP_LOCALE_ID} from '../../environments/app-locale';
import {Rating} from '@/_models/rating';
import {TransferState} from '@angular/platform-browser';
import {DATA_USERS_LIST, DATA_USERS_TOP, STATE_KEY_USERS_LIST, STATE_KEY_USERS_TOP} from '@/_helpers/tokens';
import {of} from 'rxjs';

/**
 * @class UserService
 * @description Gets different type of users
 */
@Injectable({providedIn: 'root'})
export class UserService {
  private usersTop: ApiResponseUsersTop;
  private userList: ApiResponseUsersList;

  constructor(
    private http: HttpClient,
    private state: TransferState,
    @Optional() @Inject(DATA_USERS_TOP) private dataApiUsersTop: ApiResponseUsersTop,
    @Optional() @Inject(DATA_USERS_LIST) private dataApiUserList: ApiResponseUsersList
  ) {
    // Get variable from TransferState service if it exists.
    // This part is for browser-side
    this.usersTop = this.state.get(STATE_KEY_USERS_TOP, null);
    this.userList = this.state.get(STATE_KEY_USERS_LIST, null);

    // Look for injected value and if found sent it to TransferState
    // This part is only for server-side
    if (dataApiUsersTop) {
      this.usersTop = dataApiUsersTop;
      this.state.set(STATE_KEY_USERS_TOP, this.dataApiUsersTop);
    }
    if (dataApiUserList) {
      this.userList = dataApiUserList;
      this.state.set(STATE_KEY_USERS_LIST, this.dataApiUserList);
    }
  }

  /**
   * @function getTop
   * @description Gets users for top ranking
   */
  getTop() {
    if (this.usersTop) {
      return of(this.usersTop);
    } else {
      return this.http.get<ApiResponseUsersTop>(environment.apiUrl + '/user/top');
    }
  }

  /**
   * @function getAll
   * @description Gets all users
   */
  getAll() {
    if (this.userList) {
      return of(this.userList);
    } else {
      return this.http.get<ApiResponseUsersList>(environment.apiUrl + '/user/list');
    }
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
      'https://lh3.googleusercontent.com/0afftGjZogSfSZ08FwQ2Ijg-QSFCAkSqTDw_WWEIoE-hKKhjh9tqDfkKNExNBWbuiJuEWDse_C5qrqPCMpM',
      'https://lh3.googleusercontent.com/OJg9oNfg30aq8EZX3QU2DfooH0q4ST7yYO7qAPysNq09s0JXa85xuiQTHodYoK20gvVCN-NFllCC0IrrIc750f3VcqwEjuVE',
      'https://lh3.googleusercontent.com/IZ0udyX26v_Eav59B1msVGlNVAwvCJloHBHKgJ53EOdJPHdvUY77WHM_N_hqeXKaNjb3Ibcfi9sjucmyzLQZeruwHtUBmzOimQ',
      'https://lh3.googleusercontent.com/ooKKfmvmKVc1FbMT7zx0Qc-8ZpLlcdj_iICwxGHdEsdjyW6tEabz_OJWuHvF6ypfWF_RvH8ZQFOVa4Stz1XnQ4jJRX_xyo1S',
      'https://lh3.googleusercontent.com/NvC1xMVVGUBOGOtxtRDxpA_eLJ07zaFeYKXKJT2enTMqDwepaHECEFpa1Py9GAMA0tMQuwMqjlEgX3jTZgUbCrNC1BYWkVvzhw',
      'https://lh3.googleusercontent.com/hgrOZiZADqDPmfjthAkTv3Dx0xISgE8Bbul9KFv-jdNH24ihiCg-uGujxRoU07TkhoTc4Bv12hvaK21FPPaFyqBY4Sv-j-DhHw',
      'https://lh3.googleusercontent.com/cOxlOztqg7NUKWiLJBk680hXKMISIDe8RPSxUesHmkhLJOxtAOAlOt5fh3ZtDAteCDeer3mtoJg4isOMhnGkFnmwuNqb7blFc-E',
      'https://lh3.googleusercontent.com/Rx_8xgQ56gVvjAf59R4Q6pQ8V5uJBqJ-wbfUFyCLLdV2NN0IvxnrK7NBb3L3qtwZF2pEVxO4qhjoRIwXcv55zW3vSfyzOkAngtU',
      'https://lh3.googleusercontent.com/zq2bjj30S5sAWKSM7Cro8hqbqgjvYPD096cuit4le8li3AakaqhEIl7kXEe0A9hViA-oG5KSQPCzwIW0HddvjK1h_aiYlqqQWg',
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

  /**
   * @function loginToken
   * @param token Authentication token
   * @description Request user using token
   */
  loginToken(token: string) {
    return this.http.post<any>(environment.apiUrl + '/user/loginToken', {token});
  }
}
