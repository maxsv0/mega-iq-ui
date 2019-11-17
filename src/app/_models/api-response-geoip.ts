/**
 * @class ApiResponseGeoIp
 * @description Api response for geolocation used in user settings to identofy user location
 */
export class ApiResponseGeoIp {
  ok: boolean;
  msg: string;
  date: Date;
  location: string;
  country: string;
  cityLatLong: string;
  locale: string;
}

