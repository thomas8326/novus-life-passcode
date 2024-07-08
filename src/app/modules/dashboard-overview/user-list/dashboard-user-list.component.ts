import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { isNotNil } from 'ramda';
import { combineLatest } from 'rxjs';
import { Account } from 'src/app/models/account';
import { TotalNotify } from 'src/app/models/notify';
import { AccountService } from 'src/app/services/account/account.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

const INIT_FORM: Account = {
  uid: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  zipCode: '',
  enabled: false,
  isAdmin: false,
};

@Component({
  selector: 'app-dashboard-user-list',
  templateUrl: './dashboard-user-list.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatTableModule, DatePipe],
})
export class DashboardUserListComponent implements OnInit {
  users: Account[] = [];
  userDataSource = new MatTableDataSource<Account>();
  allNotify: Record<string, TotalNotify> = {};

  constructor(
    private readonly accountService: AccountService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly notifyService: NotifyService,
  ) {
    this.notifyService.allNotify$
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.allNotify = data;
      });
  }

  userForm = this.fb.group<Account>(INIT_FORM);

  readonly displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'cartNotify',
    'requestNotify',
    'actions',
  ];

  onNavigateToDetail(id: string) {
    this.router.navigate(['dashboard', 'detail', id]);
  }

  ngOnInit(): void {
    combineLatest([
      this.accountService.loadAllUsersAccount(),
      this.notifyService.allNotify$,
    ]).subscribe(([users, notify]) => {
      this.users = users;
      const userData = users.map((user) => {
        if (user.uid && notify && notify[user.uid]) {
          const notifyData = notify[user.uid];
          return {
            ...user,
            cartNotify:
              isNotNil(notifyData.cartNotify) &&
              !notifyData.cartNotify.customer.read
                ? `${notifyData.cartNotify.customer.count}則異動`
                : '未異動',
            requestNotify:
              isNotNil(notifyData.requestNotify) &&
              !notifyData.requestNotify.customer.read
                ? `${notifyData.requestNotify.customer.count}則異動`
                : '未異動',
          };
        }
        return { ...user, cartNotify: '未異動', requestNotify: '未異動' };
      });
      this.userDataSource.data = userData;
    });
  }
}
