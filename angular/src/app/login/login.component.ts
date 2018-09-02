import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { LocalStorageService } from '../common/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public loading: Boolean = false;
    public loginForm: FormGroup;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
        if (this.localStorageService.getValue('accessToken')) {
            this.router.navigate(['dashboard']);
        } else if (localStorage.getItem('userData')) {
            this.router.navigate(['otp']);
        }
    }

    authenticate() {
        let authenticationSuccess = (data) => {
            if (data && data.success) {
                console.log('data');
                this.loading = false;
                localStorage.setItem('userData', JSON.stringify(data));
                this.router.navigate(['/otp']);
            } else {
                alert('Unable to login: ' + data.message);
            }
        }

        let authenticationFailure = (error) => {
            this.loading = false;
            console.log('Authentication Error: ', error);
            try {
                error = (error && error._body) ? JSON.parse(error._body) : error;
            } catch (err) {
            }
            let message = (error && error.message) ? error.message : 'Something went wrong! Please contact Administrator.';
            window.alert(message);
        }
        let user = this.loginForm.value;
        user['grantType'] = 'password';
        this.loading = true;
        this.authService.authenticateUser(user, authenticationSuccess, authenticationFailure);
    }

    forgotPassword = () => {
        this.router.navigate(['forgot-password']);
    }

    signUp = () => {
      this.router.navigate(['sign-up']);
  }

}

