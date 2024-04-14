import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, AsyncPipe],
  templateUrl: './account.component.html',
  styles: ``,
})
export class AccountComponent {
  private readonly account = inject(AccountService);
  myAccount$ = this.account.myAccount$;
}
