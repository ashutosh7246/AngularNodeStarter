import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TableListRoutingModule } from './table-list.routing';
import { TableListComponent } from './table-list.component';

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
        TableListRoutingModule
    ],
    declarations: [
        TableListComponent
    ]
})
export class TableListModule { }
