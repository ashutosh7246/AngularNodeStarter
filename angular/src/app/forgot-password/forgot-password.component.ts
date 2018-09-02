import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { LocalStorageService } from '../common/services/local-storage.service';
import { ForgotPasswordService } from '../services/forgot-password/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    public forgotPasswordForm: FormGroup;
    public loading: boolean = false;

    constructor(
        public router: Router,
        private formBuilder: FormBuilder,
        private localStorageService: LocalStorageService,
        private forgotPasswordService: ForgotPasswordService
    ) {
    }

    ngOnInit() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
        if (this.localStorageService.getValue('accessToken')) {
            this.router.navigate(['/dashboard']);
        }
    }

    onResetPassword() {
        let resetUserPasswordSuccess = (data) => {
            this.loading = false;
            if (data.success) {
                alert('Success! ' + data.message);
                this.router.navigate(['login']);
            } else {
                alert('Error! ' + data.message);
            }
        }
        let resetUserPasswordFailure = (error) => {
            this.loading = false;
            alert('Error! ' + error.message);
        }
        this.loading = true;
        const user = this.forgotPasswordForm.value;
        console.log(user);
        this.forgotPasswordService.forgotUserPassword(user, resetUserPasswordSuccess, resetUserPasswordFailure);
    }

    backToLogin = () => {
        this.router.navigate(['login']);
    }

}

