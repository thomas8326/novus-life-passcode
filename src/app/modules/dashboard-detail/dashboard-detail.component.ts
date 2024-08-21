import { Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ExpandingButtonComponent } from 'src/app/components/expanding-button/expanding-button.component';
import { RequestRecord } from 'src/app/models/account';
import { DashboardDetailDataService } from 'src/app/modules/dashboard-detail/dashboard-detail-data.service';
import { CalculationRequestService } from 'src/app/services/reqeusts/calculation-request.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    ExpandingButtonComponent,
  ],
  providers: [DashboardDetailDataService],
})
export class DashboardDetailComponent {
  requestRecords = signal<RequestRecord[]>([]);

  constructor(
    private readonly location: Location,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dashboardDetailDataService: DashboardDetailDataService,
    private readonly request: CalculationRequestService,
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.request.getCalculationRequests(id).subscribe((records) => {
            this.dashboardDetailDataService.updateUserRequestRecords(records);
            this.requestRecords.set(records);
          });
        }
      });
  }

  onBack() {
    this.location.back();
  }
}
