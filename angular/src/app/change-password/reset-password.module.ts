import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ResetPasswordRoutingModule } from './reset-password.routing';
import { ResetPasswordComponent } from './reset-password.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatRippleModule, MatInputModule, MatTooltipModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        ResetPasswordRoutingModule
    ],
    declarations: [
        ResetPasswordComponent
    ]
})
export class ResetPasswordModule { }
