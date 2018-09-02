import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UpgradeRoutingModule } from './upgrade.routing';
import { UpgradeComponent } from './upgrade.component';

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
        UpgradeRoutingModule
    ],
    declarations: [
        UpgradeComponent
    ]
})
export class UpgradeModule { }
