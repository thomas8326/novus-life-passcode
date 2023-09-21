import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent {
  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((map) => {
      console.log(map.get('id'));
      // this.user = this.userService.getUser(params['id']);
    });
  }
}
