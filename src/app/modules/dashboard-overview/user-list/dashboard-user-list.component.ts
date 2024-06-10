import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';

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

  constructor(
    private readonly accountService: AccountService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {}

  userForm = this.fb.group<Account>(INIT_FORM);

  readonly displayedColumns: string[] = ['name', 'phone', 'actions'];

  onNavigateToDetail(id: string) {
    this.router.navigate(['dashboard', 'detail', id]);
  }

  ngOnInit(): void {
    this.accountService.loadAllUsersAccount().subscribe((users) => {
      this.users = users;
      this.userDataSource.data = users;
    });
  }
}
