import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthService } from 'src/app/services/account/auth.service';

export const AdminLoginGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (accountService.isAdmin()) {
    return router.createUrlTree(['dashboard']);
  } else {
    authService.logout(false);
    return true;
  }
};

export const DashboardGuard: CanActivateFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['admin-login']);
};
