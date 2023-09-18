import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-user-list',
  templateUrl: './dashboard-user-list.component.html',
  styleUrls: ['./dashboard-user-list.component.scss'],
})
export class DashboardUserListComponent {
  fakeUsers = [
    {
      id: 1,
      name: '施宏儒',
      birthday: '1994/11/26',
    },
    {
      id: 2,
      name: '林欣汝',
      birthday: '2000/09/23',
    },
    {
      id: 3,
      name: '林宥嘉',
      birthday: '2000/05/13',
    },
    {
      id: 4,
      name: '張組豪',
      birthday: '1994/11/25',
    },

    {
      id: 5,
      name: '姜濟民',
      birthday: '1983/08/03',
    },
  ];

  constructor() {}
}
