import { Routes } from '@angular/router';
import { AdminLoginGuard, DashboardGuard } from 'src/app/guards/account.guard';

export interface RouteDataProps {
  hasFooter?: boolean;
  noScrollbar?: boolean;
}

export const routes: Routes = [
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
        path: 'crystal/:category/:id',
        loadComponent: () =>
          import(
            './modules/crystals-showroom/crystal-detail/crystal-detail.component'
          ).then((m) => m.CrystalDetailComponent),
      },
      {
        path: 'user-info-form',
        data: {
          noScrollbar: true,
        } as RouteDataProps,
        loadComponent: () =>
          import('./modules/user-info-form/user-info-form.component').then(
            (m) => m.UserInfoFormComponent,
          ),
      },
      {
        path: 'request-history',
        loadComponent: () =>
          import(
            './modules/user-info-form/request-record-history/request-record-history.component'
          ).then((m) => m.RequestRecordHistoryComponent),
      },
      {
        path: 'shopping-cart',
        loadComponent: () =>
          import('./modules/shopping-cart/shopping-cart.component').then(
            (m) => m.ShoppingCartComponent,
          ),
      },
      {
        path: 'purchase-record',
        loadComponent: () =>
          import(
            './modules/shopping-cart/purchase-record/purchase-record.component'
          ).then((m) => m.PurchaseRecordComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./modules/faq/faq.component').then((m) => m.FaqComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./modules/account/account.component').then(
            (m) => m.AccountComponent,
          ),
      },
      {
        path: 'term-of-service',
        loadComponent: () =>
          import('./modules/account/term-of-service.component').then(
            (m) => m.TermsOfServiceComponent,
          ),
      },
      {
        path: 'delete-account',
        loadComponent: () =>
          import('./modules/account/delete-account.component').then(
            (m) => m.DeleteAccountComponent,
          ),
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./modules/account/privacy-policy.component').then(
            (m) => m.PrivacyPolicyComponent,
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin-login',
    canActivate: [AdminLoginGuard],
    loadComponent: () =>
      import('./components/login/admin-login.component').then(
        (m) => m.AdminLoginComponent,
      ),
  },
  {
    path: 'dashboard',
    canActivateChild: [DashboardGuard],
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
        path: 'admin-account',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/admin-account/admin-account.component'
          ).then((m) => m.AdminAccountComponent),
      },
      {
        path: 'update/life-passcode',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-passport-description/update-passport-description.component'
          ).then((m) => m.UpdatePassportDescriptionComponent),
      },
      {
        path: 'update/id-calculation',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-id-calculation/update-id-calculation.component'
          ).then((m) => m.UpdateIdCalculationComponent),
      },
      {
        path: 'update/accessories/:type',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-accessories/update-accessories.component'
          ).then((m) => m.UpdateAccessoriesComponent),
      },
      {
        path: 'update/form/faq',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-faq/update-faq.component'
          ).then((m) => m.UpdateFaqComponent),
      },
      {
        path: 'update/form/clean-flow',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-clean-flow/update-clean-flow.component'
          ).then((m) => m.UpdateCleanFlowComponent),
      },
      {
        path: 'update/form/introduction',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-introduction/update-introduction.component'
          ).then((m) => m.UpdateIntroductionComponent),
      },
      {
        path: 'update/form/box-introduction',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-box-introduction/update-box-introduction.component'
          ).then((m) => m.UpdateBoxIntroductionComponent),
      },
      {
        path: 'update/form/wrist-size-tutorial',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-wrist-size/update-wrist-size.component'
          ).then((m) => m.UpdateWristSizeComponent),
      },
      {
        path: 'update/remittance',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-recipient/update-recipient.component'
          ).then((m) => m.UpdateRecipientComponent),
      },
      {
        path: 'update/prices',
        loadComponent: () =>
          import(
            './modules/dashboard-overview/updates/update-prices/update-prices.component'
          ).then((m) => m.UpdatePricesComponent),
      },
      {
        path: 'update/crystals/:type',
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
    canActivate: [DashboardGuard],
    loadComponent: () =>
      import('./modules/dashboard-detail/dashboard-detail.component').then(
        (m) => m.DashboardDetailComponent,
      ),
    children: [
      {
        path: 'life-passcode/:ticketId',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/life-passcode/dashboard-detail-life-passcode.component'
          ).then((m) => m.DashboardDetailLifePasscodeComponent),
      },
      {
        path: 'id-calculation/:ticketId',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/id-calculation/dashboard-detail-id-calculation.component'
          ).then((m) => m.DashboardDetailIdCalculationComponent),
      },
      {
        path: 'requests',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/calculation-requests/calculation-requests.component'
          ).then((m) => m.CalculationRequestsComponent),
      },
      {
        path: 'crystals',
        loadComponent: () =>
          import(
            './modules/dashboard-detail/crystal-requests/crystal-requests.component'
          ).then((m) => m.CrystalRequestsComponent),
      },
      {
        path: '',
        redirectTo: 'crystals',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: 'novus', pathMatch: 'full' },
];
