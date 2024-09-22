import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthService } from 'src/app/services/account/auth.service';

export const AdminLoginGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(accountService.myAccount).pipe(
    filter((account) => account !== null && account !== undefined),
    take(1),
    map((account) => {
      if (account?.isAdmin) {
        return router.createUrlTree(['dashboard']);
      }

      authService.logout(false);
      return true;
    }),
  );
};

export const DashboardGuard: CanActivateFn = (_: ActivatedRouteSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return toObservable(accountService.myAccount).pipe(
    filter((account) => account !== null && account !== undefined),
    take(1),
    map((account) => {
      if (account.isAdmin) {
        return true;
      }

      return router.createUrlTree(['admin-login']);
    }),
  );
};
