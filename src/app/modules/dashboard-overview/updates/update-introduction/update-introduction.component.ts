import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-introduction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-introduction.component.html',
  styles: ``,
})
export class UpdateIntroductionComponent {
  private readonly loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();

  showFlow = '';
  introduction = '';

  constructor(private readonly updateUserFormService: UserFormService) {
    this.loadingSubject.next(true);
    this.updateUserFormService.listenIntroduction((data) => {
      this.introduction = data;
      this.updateUserFormService.unsubscribe();
      this.loadingSubject.next(false);
    });
  }

  update() {
    this.updateUserFormService.updateIntroduction(this.introduction);
  }

  ngOnDestroy(): void {}
}
