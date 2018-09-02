import { Development } from './config-dev';
import { Production } from './config-prod';
import { environment } from '../../environments/environment';

export class Environment {
    public variables = {
        common: {
            REST_URL: {
                comman: 'comman/',
                myprofile: 'myprofile/',
                otp: 'otp/',
                register: 'register',
                changePassword: 'changePassword',
                forgotUserPassword: 'forgotUserPassword',
                verifyOtp: 'verifyOtp',
                resendOtp: 'resendOtp',
                authenticate: 'authenticate',
                logout: 'logout',
            }
        },
        profile: environment.production ? Production : Development
    };
}
