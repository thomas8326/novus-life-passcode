import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardUserListComponent } from './dashboard-user-list/dashboard-user-list.component';

@NgModule({
  declarations: [DashboardUserListComponent],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
