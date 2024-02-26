import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/client/client.component').then(
        (m) => m.ClientComponent,
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./modules/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'crystals-showroom',
        loadComponent: () =>
          import(
            './modules/crystals-showroom/crystals-showroom.component'
          ).then((m) => m.CrystalsShowroomComponent),
        data: { title: '水晶展示' },
        title: 'Crystals Showroom',
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard-overview/dashboard-overview.component').then(
        (m) => m.DashboardOverviewComponent,
      ),
    children: [
      {
        path: 'user-list',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/user-list/dashboard-user-list.component'
          ).then((m) => m.DashboardUserListComponent),
      },
      {
        path: '',
        redirectTo: 'user-list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'dashboard/detail/:id',
    loadComponent: () =>
      import('./modules/dashboard-detail/dashboard-detail.component').then(
        (m) => m.DashboardDetailComponent,
      ),
    children: [
      {
        path: 'card',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/user-card/dashboard-detail-user-card.component'
          ).then((m) => m.DashboardDetailUserCardComponent),
      },
      {
        path: 'review',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/user-review/dashboard-detail-user-review.component'
          ).then((m) => m.DashboardDetailUserReviewComponent),
      },
      {
        path: '',
        redirectTo: 'card',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: 'novus', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
