import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MapsRoutingModule } from './maps.routing';
import { MapsComponent } from './maps.component';

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
        MapsRoutingModule
    ],
    declarations: [
        MapsComponent
    ]
})
export class MapsModule { }
