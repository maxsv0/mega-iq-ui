/**
 * @class User
 * @description Model containing info of user to be used i.e. user home or user settings
 */
export class User {
  id: number;
  email: string;
  isPublic: boolean;
  isEmailVerified: boolean;
  isUnsubscribed: boolean;
  name: string;
  pic: string;
  certificate: string;
  homepage: string;
  url: string;
  age: string;
  iq: number;
  locale: string;
  location: string;
  country: string;
  cityLatLong: string;
  token: string;
  uid: string;
  password: string;
  totalScore: number;
  background: string;
  certificateProgress: number;
}
