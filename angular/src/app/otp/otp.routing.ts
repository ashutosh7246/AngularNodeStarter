import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OTPComponent } from './otp.component';

const routes: Routes = [
    { path: '', component: OTPComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OTPRoutingModule { }
