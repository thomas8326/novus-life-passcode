import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LogoComponent } from 'src/app/components/logo/logo.component';
import { ClientComponent } from 'src/app/modules/client/client.component';
import { ClientRoutingModule } from './client-routing.module';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { CrystalsComponent } from './crystals/crystals.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    HomeComponent,
    ClientComponent,
    NavigatorComponent,
    CrystalsComponent,
  ],
  imports: [CommonModule, ClientRoutingModule, LogoComponent],
  exports: [ClientComponent],
})
export class ClientModule {}
