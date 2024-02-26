import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

const INIT_FORM = {
  id: '',
  name: '',
  birthday: '',
};

@Component({
  selector: 'app-dashboard-user-list',
  templateUrl: './dashboard-user-list.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatTableModule],
})
export class DashboardUserListComponent {
  users: User[] = [];

  userDataSource = new MatTableDataSource<User>();

  constructor(
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.userDataSource.data = users;
    });
  }

  userForm = this.fb.group<User>(INIT_FORM);

  readonly displayedColumns: string[] = ['name', 'birthday', 'actions'];

  onNavigateToDetail(id: string) {
    this.router.navigate(['dashboard', 'detail', id]);
  }
}
