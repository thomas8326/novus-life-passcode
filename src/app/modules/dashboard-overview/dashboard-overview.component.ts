import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { AuthService } from 'src/app/services/account/auth.service';

const ROUTER_LINKS = [
  { text: 'ADMIN帳號', link: 'admin-account', icon: 'shield_person' },
  { text: '會員列表', link: 'user-list', icon: 'group' },
  {
    text: '編輯提示',
    icon: 'edit',
    children: [
      { text: '更新生命密碼', link: ['update', 'life-passcode'] },
      { text: '更新身分證推算', link: ['update', 'id-calculation'] },
    ],
  },
  {
    text: '編輯產品資訊',
    icon: 'edit',
    children: [
      {
        text: '更新生命力款式',
        link: ['update', 'crystals', LifeType.Health],
      },
      { text: '更新財富款式', link: ['update', 'crystals', LifeType.Wealth] },
      { text: '更新貴人款式', link: ['update', 'crystals', LifeType.Friend] },
    ],
  },
  {
    text: '編輯吊飾資訊',
    icon: 'edit',
    children: [
      {
        text: '更新大衛星',
        link: ['update', 'accessories', CrystalPendantType.Satellite],
      },
      {
        text: '更新銀吊飾',
        link: ['update', 'accessories', CrystalPendantType.Sliver],
      },
      {
        text: '更新注金吊飾',
        link: ['update', 'accessories', CrystalPendantType.Gold],
      },
      {
        text: '更新貔貅',
        link: ['update', 'accessories', CrystalMythicalBeastType.BraveTroops],
      },
      {
        text: '更新萌狐',
        link: ['update', 'accessories', CrystalMythicalBeastType.CuteFox],
      },
      {
        text: '更新九尾狐',
        link: ['update', 'accessories', CrystalMythicalBeastType.NineTails],
      },
    ],
  },
  {
    text: '編輯其他',
    icon: 'edit',
    children: [
      { text: '更新FAQ', link: ['update', 'form', 'faq'] },
      { text: '更新淨化流程', link: ['update', 'form', 'clean-flow'] },
      { text: '更新推算介紹', link: ['update', 'form', 'introduction'] },
      { text: '更新寶盒介紹', link: ['update', 'form', 'box-introduction'] },
      {
        text: '更新手圍教學',
        link: ['update', 'form', 'wrist-size-tutorial'],
      },
    ],
  },
  { text: '更新匯款帳號', link: 'update/remittance', icon: 'edit' },
  { text: '更新價錢', link: 'update/prices', icon: 'edit' },
];

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
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  LifeType = LifeType;
  CrystalMythicalBeastType = CrystalMythicalBeastType;
  CrystalPendantType = CrystalPendantType;

  myAccount = this.accountService.myAccount();
  ROUTER_LINKS = ROUTER_LINKS;

  async onLogout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/admin-login']);
    });
  }
}
