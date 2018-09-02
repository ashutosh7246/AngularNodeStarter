import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RegisterRoutingModule } from './register.routing';
import { RegisterComponent } from './register.component';

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
        RegisterRoutingModule
    ],
    declarations: [
        RegisterComponent
    ]
})
export class RegisterModule { }
