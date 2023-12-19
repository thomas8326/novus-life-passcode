import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DashboardDetailUserCardsComponent } from './dashboard-detail-user-cards/dashboard-detail-user-cards.component';
import { DashboardDetailUserReviewComponent } from './dashboard-detail-user-review/dashboard-detail-user-review.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardUserListComponent } from './dashboard-user-list/dashboard-user-list.component';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatIconModule,
        MatTableModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        DashboardUserListComponent,
        DashboardDetailComponent,
        DashboardDetailUserCardsComponent,
        DashboardDetailUserReviewComponent,
    ],
})
export class DashboardModule {}
