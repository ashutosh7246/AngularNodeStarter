import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TypographyRoutingModule } from './typograpgy.routing';
import { TypographyComponent } from './typography.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatRippleModule, MatInputModule, MatTooltipModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        TypographyRoutingModule
    ],
    declarations: [
        TypographyComponent
    ]
})
export class TypographyModule { }
