import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Environment } from '../../config/config';
import { DelegatorService } from '../../common/services/delegator.service';

@Injectable()
export class ForgotPasswordService {
    users: any;
    restUrl;
    server;

    constructor(
        private environment: Environment,
        private delegatorService: DelegatorService
    ) {
        this.server = this.environment.variables.profile.SERVER;
        this.restUrl = this.environment.variables.common.REST_URL;
    }

    forgotUserPassword(user, successCallback, errorCallback) {
        const url = this.server.host + this.restUrl.myprofile + 'forgotUserPassword';
        return this.delegatorService.post(user, url, null, successCallback, errorCallback);
    }
}
