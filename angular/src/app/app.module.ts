import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import {AgmCoreModule} from '@agm/core';
import { AuthGuard } from './shared/auth.guard';
import { AuthService } from './services/authentication/auth.service';
import { LocalStorageService } from './common/services/local-storage.service';
import { DelegatorService } from './common/services/delegator.service';
import { Environment } from './config/config';
import { ChangePasswordService } from './services/change-password/change-password.service';
import { ForgotPasswordService } from './services/forgot-password/forgot-password.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
      AuthGuard,
      AuthService,
      LocalStorageService,
      DelegatorService,
      ChangePasswordService,
      ForgotPasswordService,
      Environment
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
