import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { OTPRoutingModule } from './otp.routing';
import { OTPComponent } from './otp.component';

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
        OTPRoutingModule
    ],
    declarations: [
        OTPComponent
    ]
})
export class OTPModule { }
