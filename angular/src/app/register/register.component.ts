import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { LocalStorageService } from '../common/services/local-storage.service';
import { ForgotPasswordService } from '../services/forgot-password/forgot-password.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public signForm: FormGroup;
    public roles = [];
    public loading: Boolean = false;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        this.signForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        }, {validator: this.checkPasswords});
        if (this.localStorageService.getValue('accessToken')) {
            this.router.navigate(['dashboard']);
        }
    }

    checkPasswords(group: FormGroup) {
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;
        return pass === confirmPass ? null : { notSame: true }
    }

    onRegister = () => {
        let user = this.signForm.value;
        let registerUserSuccess = (data) => {
            this.loading = false;
            if (data && data.success) {
                this.signForm.reset();
            }
            alert(data.message);
        };
        let registerUserFailure = (error) => {
            this.loading = false;
            alert('Unable to register user!');
        }
        this.loading = true;
        this.authService.registerUser(user, registerUserSuccess, registerUserFailure);
    }

    backToLogin = () => {
        this.router.navigate(['login']);
    }

}

