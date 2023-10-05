import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [
    CommonModule,
    ClientRoutingModule,
    LogoComponent,
    MatIconModule,
    FormsModule,
  ],
  exports: [ClientComponent],
})
export class ClientModule {}
