import { Component } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
})
export class DashboardDetailComponent {
  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((map) => {
      // this.user = this.userService.getUser(params['id']);
    });
  }
}
