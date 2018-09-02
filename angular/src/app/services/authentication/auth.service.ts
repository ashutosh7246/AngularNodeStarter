import { Injectable } from '@angular/core';

import { Environment } from '../../config/config';
import { DelegatorService } from '../../common/services/delegator.service';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;
  restUrl;
  server;

  constructor(
    private environment: Environment,
    private delegatorService: DelegatorService
  ) {
    this.server = this.environment.variables.profile.SERVER;
    this.restUrl = this.environment.variables.common.REST_URL;
  }

  registerUser(user, successCallback, errorCallback) {
    const url = this.server.host + this.restUrl.myprofile + this.restUrl.register;
    return this.delegatorService.post(user, url, null, successCallback, errorCallback);
  }

  authenticateUser(user, successCallback, errorCallback) {
    const url = this.server.host + this.restUrl.myprofile + this.restUrl.authenticate;
    return this.delegatorService.post(user, url, null, successCallback, errorCallback);
  }

  logoutUser(user, successCallback, errorCallback) {
    const url = this.server.host + this.restUrl.myprofile + this.restUrl.logout;
    return this.delegatorService.post(user, url, null, successCallback, errorCallback);
  }

  verifyOTP(user, successCallback, errorCallback) {
    const url = this.server.host + this.restUrl.otp + this.restUrl.verifyOtp;
    return this.delegatorService.post(user, url, null, successCallback, errorCallback);
  }

  resendOtp(data, successCallback, errorCallback) {
    const url = this.server.host + this.restUrl.otp + this.restUrl.resendOtp;
    return this.delegatorService.post(data, url, null, successCallback, errorCallback);
  }
}
