import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../services/authentication/auth.service';
import { LocalStorageService } from '../common/services/local-storage.service';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.css']
})
export class OTPComponent implements OnInit, OnDestroy {

    public otpForm: FormGroup;
    public loading: any = false;
    public inputEle: any;
    public otpData: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
    }

    ngOnDestroy() {
        localStorage.removeItem('userData');
    }

    ngOnInit() {
        this.otpForm = this.formBuilder.group({
            otp1: ['', [Validators.required, Validators.minLength(1)]],
            otp2: ['', [Validators.required, Validators.minLength(1)]],
            otp3: ['', [Validators.required, Validators.minLength(1)]],
            otp4: ['', [Validators.required, Validators.minLength(1)]],
            otp5: ['', [Validators.required, Validators.minLength(1)]],
            otp6: ['', [Validators.required, Validators.minLength(1)]]
        });
        if (this.localStorageService.getValue('accessToken')) {
            this.router.navigate(['dashboard']);
        }
        this.otpData = JSON.parse(localStorage.getItem('userData'));
        if (!this.otpData ||
            !this.otpData.data ||
            !this.otpData.data.time ||
            !this.otpData.data.dummyOtp ||
            !this.otpData.data.userRefId) {
            this.clearAndGoToLogin();
            this.router.navigate(['/login']);
        }

        this.inputEle = (<HTMLElement><any>document.getElementById('otp-input'));
        this.inputEle.onkeyup = function (e) {
            let target = e.srcElement;
            let maxLength = parseInt(target.attributes["maxlength"].value, 10);
            let myLength = target.value.length;
            if (myLength >= maxLength) {
                let next = target;
                let id = next.id;
                if ('0123456789'.indexOf(next.value) >= 0) {
                    if (id === 'in-1') {
                        let other = (<HTMLElement><any>document.getElementById('in-2'));
                        other.focus();
                    } else if (id === 'in-2') {
                        let other = (<HTMLElement><any>document.getElementById('in-3'));
                        other.focus();
                    } else if (id === 'in-3') {
                        let other = (<HTMLElement><any>document.getElementById('in-4'));
                        other.focus();
                    } else if (id === 'in-4') {
                        let other = (<HTMLElement><any>document.getElementById('in-5'));
                        other.focus();
                    } else if (id === 'in-5') {
                        let other = (<HTMLElement><any>document.getElementById('in-6'));
                        other.focus();
                    }
                } else {
                    next.value = '';
                }
            }
        }
    }

    verifyOTP() {
        let verifySuccess = (data) => {
            if (data.success) {
                this.localStorageService.create();
                let userData = {
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    isPasswordChanged: data.user.isPasswordChanged,
                    userId: data.user.userId,
                    _id: data.user._id
                };
                let tokenData = {
                    accessToken: data.auth.accessToken,
                    refreshToken: data.auth.refreshToken
                };
                this.localStorageService.setValue('user', userData);
                this.localStorageService.setValue('auth', tokenData);
                this.router.navigate(['dashboard']);
            } else {
                this.otpForm.reset();
                if (data.isExpired) {
                    this.clearAndGoToLogin();
                }
                this.loading = false;
                console.log('Authentication Error: ', data);
                alert('Authentication Error : ' + data);
            }
        }

        let verifyFailure = (error) => {
            this.loading = false;
            this.clearAndGoToLogin();
            console.log('Authentication Error: ', error);
            alert('Authentication Error : ' + data);
        }

        let otp = this.otpForm.value.otp1 + this.otpForm.value.otp2 + this.otpForm.value.otp3 + this.otpForm.value.otp4 + this.otpForm.value.otp5 + this.otpForm.value.otp6;
        let data = {
            time: this.otpData.data.time,
            dummyOtp: this.otpData.data.dummyOtp,
            otp: otp,
            userRefId: this.otpData.data.userRefId
        }
        console.log('user', data);
        this.loading = true;
        this.authService.verifyOTP(data, verifySuccess, verifyFailure);
    }

    clearAndGoToLogin = () => {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    resendOTP = () => {
        let resendOtpSuccess = (data) => {
            this.loading = false;
            if (data.success) {
                this.otpData = data;
                localStorage.setItem('userData', JSON.stringify(data));
                alert('OTP Sent');
            } else {
                console.log('Authentication Error: ', data);
                alert('Authentication Error : ' + data);
                // this.clearAndGoToLogin();
            }
        }

        let resendOtpFailure = (error) => {
            this.loading = false;
            console.log('Authentication Error: ', error);
            alert('Authentication Error : ' + data);
            // this.clearAndGoToLogin();
        }

        let data = {
            time: this.otpData.data.time,
            dummyOtp: this.otpData.data.dummyOtp,
            userRefId: this.otpData.data.userRefId
        };
        this.loading = true;
        this.authService.resendOtp(data, resendOtpSuccess, resendOtpFailure);
    }

    switchUser = () => {
    }
}
