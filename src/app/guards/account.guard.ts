import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';

export const AdminAccountGuard: CanActivateFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.myAccount$.pipe(
    map((account) => {
      if (account && account.isAdmin) {
        if (state.url.includes('admin-login')) {
          return router.createUrlTree(['dashboard']);
        }

        return true;
      }

      accountService.logout();
      return router.createUrlTree(['/admin-login']);
    }),
  );
};

export const AccountGuard: CanActivateFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const accountService = inject(AccountService);

  return accountService.myAccount$.pipe(
    map((account) => {
      if (account && account.isAdmin && !state.url.includes('dashboard')) {
        accountService.logout();
      }

      return true;
    }),
  );
};
