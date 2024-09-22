import {
  Directive,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from '@angular/core';
import { AuthService } from 'src/app/services/account/auth.service';

@Directive({
  selector: '[appForceLogin]',
  standalone: true,
})
export class ForceLoginDirective {
  private authService = inject(AuthService);
  @Output() afterLoginClick = new EventEmitter();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopImmediatePropagation();
    if (!this.authService.isLogin() || this.authService.userNotVerified()) {
      return;
    }

    this.afterLoginClick.emit();
  }
}
