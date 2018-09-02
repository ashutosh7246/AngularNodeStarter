import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ForgotPasswordRoutingModule } from './forgot-password.routing';
import { ForgotPasswordComponent } from './forgot-password.component';

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
        ForgotPasswordRoutingModule
    ],
    declarations: [
        ForgotPasswordComponent
    ]
})
export class ForgotPasswordModule { }
