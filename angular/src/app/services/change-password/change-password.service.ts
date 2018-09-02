import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DelegatorService } from '../../common/services/delegator.service';
import { Environment } from '../../config/config';

@Injectable()
export class ChangePasswordService {
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

    changePassword(data, successCallback, errorCallback) {
        const url = this.server.host + this.restUrl.myprofile + 'changePassword';
        return this.delegatorService.put(data, url, successCallback, errorCallback);
    }
}
