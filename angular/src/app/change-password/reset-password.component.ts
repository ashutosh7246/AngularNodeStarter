import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { LocalStorageService } from '../common/services/local-storage.service';
import { ChangePasswordService } from '../services/change-password/change-password.service';
import { CustomValidator } from '../common/utility/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    user: any;
    userAvatarData: any;
    currentUserEmail: any = this.localStorageService.getValue('email');
    daysDiff = 0;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private changePasswordService: ChangePasswordService,
        private localStorageService: LocalStorageService
    ) {
        this.user = this.localStorageService.getValue('user');
        this.getLastPasswordChangeInDays(this.user.lastPasswordUpdatedAt);
    }

    ngOnInit() {
        this.user = this.localStorageService.getValue('user');
        this.buildChangePasswordForm();
    }

    changePasswordForm: FormGroup;
    loading = false;
    changePasswordNodal: any = {
        password: null,
        newPassword: null,
        confirmPassword: null
    }

    getLastPasswordChangeInDays = (lastPasswordUpdatedAt) => {
        try {
            let currentTime = new Date().getTime();
            let timeDiff = (currentTime - (lastPasswordUpdatedAt || 777600000000));
            this.daysDiff = timeDiff / (1000 * 60 * 60 * 24) || 0;
        } catch (e) {
            console.log(e);
        }
        this.daysDiff = Math.floor(this.daysDiff);
    }

    buildChangePasswordForm = () => {
        this.changePasswordForm = this.formBuilder.group({
            password: [this.changePasswordNodal.password, [Validators.required]],
            newPassword: [this.changePasswordNodal.newPassword, [Validators.required, CustomValidator.min8Length, CustomValidator.checkUpperCase, CustomValidator.checkLowerCase, CustomValidator.checkNumber, CustomValidator.checkSpecial]],
            confirmPassword: [this.changePasswordNodal.confirmPassword, [Validators.required]]
        }, { validator: CustomValidator.equalPasswordValidator('newPassword', 'confirmPassword') });
    }

    resetChangePasswordModal = () => {
        this.changePasswordForm.reset();
        this.changePasswordNodal = {
            password: null,
            newPassword: null,
            confirmPassword: null
        }
    }

    callChangePassword = () => {
        if (this.changePasswordForm.valid) {
            const data = {
                userId: this.localStorageService.getValue('_id'),
                currentPassword: this.changePasswordForm.value.password,
                password: this.changePasswordForm.value.confirmPassword
            }
            this.loading = true;
            this.changePasswordService.changePassword(data, this.changePasswordSuccess, this.changePasswordFailure);
        } else {
            this.validateAllFormFields(this.changePasswordForm);
        }
    }

    changePasswordSuccess = (data) => {
        this.loading = false;
        if (data.success) {
            this.resetChangePasswordModal();
            alert('Success! Password changed succesfully!');
        } else {
            alert('Error!' + data.message);
            this.resetChangePasswordModal();
        }
    }

    changePasswordFailure = (error) => {
        this.loading = false;
        alert('Error!' + error.message || 'Unable to change password!');
        this.resetChangePasswordModal();
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

}

