import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';

export const AdminLoginGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.loadMyAccount().pipe(
    map((account) => {
      if (account) {
        if (account.isAdmin) {
          return router.createUrlTree(['dashboard']);
        } else {
          accountService.logout(false);
          return true;
        }
      }

      return true;
    }),
  );
};

export const DashboardGuard: CanActivateFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.loadMyAccount().pipe(
    map((account) => {
      if (account && account.isAdmin) {
        return true;
      }

      return router.createUrlTree(['admin-login']);
    }),
  );
};
