import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpgradeComponent } from './upgrade.component';

const routes: Routes = [
    { path: '', component: UpgradeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpgradeRoutingModule { }
