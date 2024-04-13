import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-clean-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-clean-flow.component.html',
  styles: ``,
})
export class UpdateCleanFlowComponent implements OnDestroy {
  private readonly loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();

  showFlow = '';
  flow = '';

  constructor(private readonly updateUserFormService: UserFormService) {
    this.loadingSubject.next(true);
    this.updateUserFormService.listenCleanFlow((data) => {
      this.flow = data;
      this.updateUserFormService.unsubscribe();
      this.loadingSubject.next(false);
    });
  }

  update() {
    this.updateUserFormService.updateCleanFlow(this.flow);
  }

  ngOnDestroy(): void {}
}
