import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      .get<User[]>('assets/mock/users.json')
      .pipe(tap((users) => (this.users = users)));
  }

  getUser(id: string | null) {
    if (!id) {
      return null;
    }

    return this.users.find((user) => user.id === id) || null;
  }
}
