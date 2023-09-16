import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DashboardRoutingModule } from 'src/app/modules/dashboard/dashboard-routing.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, DashboardRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
