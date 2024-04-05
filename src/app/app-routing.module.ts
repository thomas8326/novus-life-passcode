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
        path: 'select-life-type',
        loadComponent: () =>
          import(
            './modules/crystals-showroom/select-life-type/select-life-type.component'
          ).then((m) => m.SelectLifeTypeComponent),
      },
      {
        path: 'crystals-showroom',
        loadComponent: () =>
          import(
            './modules/crystals-showroom/crystals-showroom.component'
          ).then((m) => m.CrystalsShowroomComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./modules/account/account.component').then(
            (m) => m.AccountComponent,
          ),
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
        path: 'update/:type',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-crystals/update-crystals.component'
          ).then((m) => m.UpdateCrystalsComponent),
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
        path: 'life-passcode',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/life-passcode/dashboard-detail-life-passcode.component'
          ).then((m) => m.DashboardDetailLifePasscodeComponent),
      },
      {
        path: 'id-calculation',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/id-calculation/dashboard-detail-id-calculation.component'
          ).then((m) => m.DashboardDetailIdCalculationComponent),
      },
      {
        path: '',
        redirectTo: 'life-passcode',
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
