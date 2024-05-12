import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ExpandingButtonComponent } from 'src/app/components/expanding-button/expanding-button.component';
import {
  CrystalMythicalBeastType,
  CrystalPendantType,
} from 'src/app/enums/accessory-type.enum';
import { LifeType } from 'src/app/enums/life-type.enum';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    ExpandingButtonComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
  ],
  templateUrl: './dashboard-overview.component.html',
  styles: ``,
})
export class DashboardOverviewComponent {
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;
  LifeType = LifeType;
  CrystalMythicalBeastType = CrystalMythicalBeastType;
  CrystalPendantType = CrystalPendantType;
  myAccount$ = this.accountService.myAccount$;

  constructor(
    private readonly accountService: AccountService,
    private route: Router,
  ) {}

  onLogout() {
    this.accountService
      .logout()
      .then(() => this.route.navigate(['/admin-login']));
  }
}
