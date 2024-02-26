import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './dashboard-overview.component.html',
  styles: ``,
})
export class DashboardOverviewComponent {}
