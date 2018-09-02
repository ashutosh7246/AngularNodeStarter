import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LoginRoutingModule } from './login.routing';
import { LoginComponent } from './login.component';

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
        LoginRoutingModule
    ],
    declarations: [
        LoginComponent
    ]
})
export class LoginModule { }
