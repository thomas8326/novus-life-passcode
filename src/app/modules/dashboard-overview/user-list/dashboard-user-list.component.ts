import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/services/member/member.service';

const INIT_FORM = {
  id: '',
  name: '',
  birthday: 0,
};

@Component({
  selector: 'app-dashboard-user-list',
  templateUrl: './dashboard-user-list.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatTableModule, DatePipe],
})
export class DashboardUserListComponent implements OnInit {
  users: Member[] = [];

  userDataSource = new MatTableDataSource<Member>();

  constructor(
    private readonly userService: MemberService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {}

  userForm = this.fb.group<Member>(INIT_FORM);

  readonly displayedColumns: string[] = ['name', 'birthday', 'actions'];

  onNavigateToDetail(id: string) {
    this.router.navigate(['dashboard', 'detail', id]);
  }

  ngOnInit(): void {
    console.log('in');
    this.userService.getMembers().subscribe((users) => {
      console.log(users);
      this.users = users;
      this.userDataSource.data = users;
    });
  }
}
