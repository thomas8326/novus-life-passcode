import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardDetailUserCardsComponent } from 'src/app/modules/dashboard/dashboard-detail-user-cards/dashboard-detail-user-cards.component';
import { DashboardDetailUserReviewComponent } from 'src/app/modules/dashboard/dashboard-detail-user-review/dashboard-detail-user-review.component';
import { DashboardDetailComponent } from 'src/app/modules/dashboard/dashboard-detail/dashboard-detail.component';
import { DashboardUserListComponent } from 'src/app/modules/dashboard/dashboard-user-list/dashboard-user-list.component';

const routes: Routes = [
  {
    path: 'user-list',
    component: DashboardUserListComponent,
  },
  {
    path: 'dashboard-detail/:id',
    component: DashboardDetailComponent,
    children: [
      { path: 'cards', component: DashboardDetailUserCardsComponent },
      { path: 'review', component: DashboardDetailUserReviewComponent },
    ],
  },
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
