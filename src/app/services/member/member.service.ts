import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, tap } from 'rxjs';
import { Member } from 'src/app/models/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private members$: ReplaySubject<Member[]> = new ReplaySubject<Member[]>(1);
  private members: Member[] = [];

  constructor(private http: HttpClient) {
    this.http
      .get<Member[]>('assets/mock/users.json')
      .pipe(tap((data) => this.setUsers(data)))
      .subscribe();
  }

  getMembers() {
    return this.members$.asObservable();
  }

  postMember(users: Member[]) {
    this.setUsers(users);
  }

  getMember(id: string | null) {
    if (!id) {
      return null;
    }

    return this.members.find((user) => user.id === id) || null;
  }

  private setUsers(users: Member[]) {
    this.members = this.members.concat(users);
    this.members$.next(this.members);
  }
}
