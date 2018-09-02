import { FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

/**
 * Custom validation
 */
export class CustomValidator<T extends FormControl> {
    static min8Length(control: FormControl) {
        let check = (val) => {
            if (val && val.length >= 8) {
                return true
            }
            return false
        }
        return (check(control.value)) ? null : { 'min8LengthError': true };
    }
    static checkUpperCase(control: FormControl) {
        let check = (val) => {
            if (val && upper.test(control.value)) {
                return true
            }
            return false
        }
        const upper = (/[A-Z]/);
        return (check(control.value)) ? null : { 'upperCase': true };
    }
    static checkLowerCase(control: FormControl) {
        let check = (val) => {
            if (val && lower.test(control.value)) {
                return true
            }
            return false
        }
        const lower = (/[a-z]/);
        return (check(control.value)) ? null : { 'lowerCase': true };
    }
    static checkNumber(control: FormControl) {
        let check = (val) => {
            if (val && number.test(control.value)) {
                return true
            }
            return false
        }
        const number = (/[0-9]/);
        return (check(control.value)) ? null : { 'number': true };
    }
    static checkSpecial(control: FormControl) {
        let check = (val) => {
            if (val && special.test(control.value)) {
                return true
            }
            return false
        }
        const special = (/[!@#$%^*+=]/);
        return (check(control.value)) ? null : { 'special': true };
    }
    static equalPasswordValidator(passwordKey: string, confirmPasswordKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            const password = group.controls[passwordKey];
            const confirmPassword = group.controls[confirmPasswordKey];

            /*if (password.value !== confirmPassword.value) {
              return {
                mismatchedPasswords: true
              };
            }*/
            return (password.value === confirmPassword.value) ? null : { 'mismatchedPasswords': true };
        };
    }
}
