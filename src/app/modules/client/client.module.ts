import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LogoComponent } from 'src/app/components/logo/logo.component';
import { ClientComponent } from 'src/app/modules/client/client.component';
import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { NavigatorComponent } from './navigator/navigator.component';

@NgModule({
  declarations: [HomeComponent, ClientComponent, NavigatorComponent],
  imports: [CommonModule, ClientRoutingModule, LogoComponent],
  exports: [ClientComponent],
})
export class ClientModule {}
