import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NotificationsRoutingModule } from './notifications.routing';
import { NotificationsComponent } from './notifications.component';

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
        NotificationsRoutingModule
    ],
    declarations: [
        NotificationsComponent
    ]
})
export class NotificationsModule { }
