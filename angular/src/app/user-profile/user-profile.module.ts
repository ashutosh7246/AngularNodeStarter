import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UserProfileRoutingModule } from './user-profile.routing';
import { UserProfileComponent } from './user-profile.component';
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
        UserProfileRoutingModule,
    ],
    declarations: [
        UserProfileComponent
    ]
})
export class UserProfileModule { }
