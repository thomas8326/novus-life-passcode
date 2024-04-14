import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import {
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-faq.component.html',
  styles: ``,
})
export class UpdateFaqComponent implements OnDestroy {
  private readonly loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();

  question = '';
  answer = '';

  faqForm = this.fb.group({
    faqs: this.fb.array([]),
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly updateUserFormService: UserFormService,
  ) {
    this.listenFAQs();
  }

  get faqs() {
    return this.faqForm.get('faqs') as FormArray;
  }

  listenFAQs() {
    this.loadingSubject.next(true);
    this.updateUserFormService.listenFAQs((data) => {
      this.faqs.clear();

      Object.entries(data).forEach(([key, faq]) => {
        this.faqs.push(
          this.fb.group({
            id: [key],
            question: [faq.question, Validators.required],
            answer: [faq.answer, Validators.required],
          }),
        );
      });
      this.loadingSubject.next(false);
    });
  }

  addFaq() {
    if (this.answer === '' || this.question === '') return;

    this.updateUserFormService.addFaq(this.question, this.answer);
    this.question = '';
    this.answer = '';
  }

  removeFaq(id: string) {
    this.updateUserFormService.removeFaq(id);
  }

  updateFaq(faq: FAQ) {
    this.updateUserFormService.updateFaq(faq);
  }

  ngOnDestroy(): void {
    this.updateUserFormService.unsubscribe();
  }
}
