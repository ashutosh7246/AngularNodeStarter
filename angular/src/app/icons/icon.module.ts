import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IconRoutingModule } from './icon.routing';
import { IconsComponent } from './icons.component';

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
        IconRoutingModule
    ],
    declarations: [
        IconsComponent
    ]
})
export class IconsModule { }
