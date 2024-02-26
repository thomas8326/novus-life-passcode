import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
})
export class DashboardDetailComponent {
  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((map) => {
      console.log(map.get('id'));
      // this.user = this.userService.getUser(params['id']);
    });
  }
}
