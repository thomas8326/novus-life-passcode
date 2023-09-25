import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { DashboardDetailUserCardsComponent } from './dashboard-detail-user-cards/dashboard-detail-user-cards.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardUserListComponent } from './dashboard-user-list/dashboard-user-list.component';
import { DashboardDetailUserReviewComponent } from './dashboard-detail-user-review/dashboard-detail-user-review.component';

@NgModule({
  declarations: [
    DashboardUserListComponent,
    DashboardDetailComponent,
    DashboardDetailUserCardsComponent,
    DashboardDetailUserReviewComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, MatIconModule],
})
export class DashboardModule {}
