import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { reload } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageSnackbarComponent } from 'src/app/components/message-snackbar/message-snackbar.component';
import { AuthService } from 'src/app/services/account/auth.service';

@Component({
  selector: 'app-activate-email',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    @if (user(); as user) {
      <div class="min-w-[340px] relative">
        <button mat-dialog-close class="!absolute top-0 right-0 p-2">
          <mat-icon>close</mat-icon>
        </button>

        @switch (state()) {
          @case ('active') {
            <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
              <h2 class="text-2xl font-bold mb-4 text-center">
                立即啟用您的帳戶！
              </h2>
              <p class="text-center mb-6">啟用連結已寄送至 {{ user.email }}</p>

              <div class="flex justify-center mb-6">
                <span class="material-icons text-gray-400 text-6xl"
                  >mark_email_read</span
                >
              </div>

              <h3 class="text-lg font-semibold mb-2">為什麼要啟用您的帳戶？</h3>
              <ul class="list-disc pl-5 mb-6">
                <li>參與我們的推算服務</li>
                <li>購買我們獨特的生命密碼水晶</li>
              </ul>

              <p class="mb-4">沒有收到電子郵件？</p>
              <button
                (click)="resendVerificationEmail()"
                class="w-full bg-red-500 text-white py-3 rounded-md mb-4 hover:bg-red-600 transition duration-300"
              >
                重寄啟用連結
              </button>
              <button
                (click)="checkVerification()"
                class="w-full bg-green-500 text-white py-3 rounded-md mb-4 hover:bg-green-600 transition duration-300"
              >
                已驗證
              </button>
            </div>
          }
          @case ('resend') {
            <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
              <h2 class="text-2xl font-bold mb-4 text-center">
                啟用郵件已寄出！
              </h2>

              <div class="flex justify-center mb-6">
                <span class="material-icons text-gray-400 text-6xl"
                  >mail_outline</span
                >
              </div>

              <p class="mb-4">啟用連結已寄送至：</p>
              <p class="font-semibold mb-6">{{ user.email }}</p>

              <button
                (click)="openEmail(user.email)"
                class="w-full bg-green-500 text-white py-3 rounded-md mb-6 hover:bg-green-600 transition duration-300"
              >
                開啟我的郵箱
              </button>

              <button
                (click)="checkVerification()"
                class="w-full bg-red-500 text-white py-3 rounded-md mb-4 hover:bg-red-600 transition duration-300"
              >
                已驗證
              </button>

              <p class="font-semibold mb-2">沒看到郵件？</p>
              <ul class="list-disc pl-5 mb-6">
                <li>確保您的地址正確無誤</li>
                <li>檢查您的垃圾郵件資料夾</li>
              </ul>
            </div>
          }
        }
      </div>
    }
  `,
  styles: ``,
})
export class ActivateEmailComponent {
  private auth = inject(AngularFireAuth);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  state = signal<'active' | 'resend'>('active');
  user = toSignal(this.auth.user);

  async resendVerificationEmail() {
    try {
      const currentUser = await this.auth.currentUser;
      if (currentUser) {
        await currentUser.sendEmailVerification();
        this.state.set('resend');
      }
    } catch (error) {
      console.error('發送驗證郵件時出錯:', error);
      this.showSnackBar('發送驗證郵件時出錯，請稍後再試。', 'error');
    }
  }

  openEmail(email: string | null) {
    const _email = email ?? 'example@gmail.com';
    const domain = this.getDomain(_email);
    const url = this.getEmailUrl(domain);
    if (url) {
      window.open(url, '_blank');
    }
  }

  private getDomain(email: string): string {
    return email.split('@')[1];
  }

  private getEmailUrl(domain: string): string | null {
    const emailProviders: Record<string, string> = {
      'gmail.com': 'https://mail.google.com',
      'yahoo.com': 'https://mail.yahoo.com',
      'outlook.com': 'https://outlook.live.com',
      'hotmail.com': 'https://outlook.live.com',
    };
    return emailProviders[domain] || 'https://mail.google.com';
  }

  checkVerification() {
    const currentUser = this.authService.getFireAuthCurrentUser();
    if (currentUser) {
      reload(currentUser)
        .then(() => {
          if (currentUser.emailVerified) {
            window.location.reload();
          } else {
            this.showSnackBar(
              '您的電子郵件尚未驗證，請檢查您的收件箱並點擊驗證連結。',
              'warn',
            );
          }
        })
        .catch((error) => {
          console.error('檢查電子郵件驗證時出錯:', error);
          this.showSnackBar('檢查電子郵件驗證時出錯，請稍後再試。', 'error');
        });
    }
  }

  private showSnackBar(message: string, messageType: 'warn' | 'error') {
    this.snackBar.openFromComponent(MessageSnackbarComponent, {
      data: { message, messageType },
      horizontalPosition: 'end',
      duration: 1000,
    });
  }
}
