import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard-user-list',
  templateUrl: './dashboard-user-list.component.html',
  styleUrls: ['./dashboard-user-list.component.scss'],
})
export class DashboardUserListComponent {
  users: User[] = [];

  constructor(private readonly userService: UserService) {
    this.users = this.userService.fakeUsers;
  }
}
