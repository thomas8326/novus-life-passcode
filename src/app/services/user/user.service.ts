import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  fakeUsers: User[] = [
    {
      id: '1',
      name: '施宏儒',
      birthday: '1994/11/26',
    },
    {
      id: '2',
      name: '林欣汝',
      birthday: '2000/09/23',
    },
    {
      id: '3',
      name: '林宥嘉',
      birthday: '2000/05/13',
    },
    {
      id: '4',
      name: '張組豪',
      birthday: '1994/11/25',
    },
    {
      id: '5',
      name: '姜濟民',
      birthday: '1983/08/03',
    },
  ];

  constructor() {}

  getUser(id: string | null) {
    if (!id) {
      return null;
    }

    return this.fakeUsers.find((user) => user.id === id) || null;
  }
}
