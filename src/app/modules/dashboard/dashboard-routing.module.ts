import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUserListComponent } from 'src/app/modules/dashboard/dashboard-user-list/dashboard-user-list.component';

const routes: Routes = [
  {
    path: 'user-list',
    component: DashboardUserListComponent,
  },
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
