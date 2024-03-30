import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Crystal } from 'src/app/models/crystal';
import { v4 } from 'uuid';

@Component({
  selector: 'app-updated-card',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './updated-card.component.html',
  styles: ``,
})
export class UpdatedCardComponent implements OnInit {
  @Input() crystal: Crystal | null = null;

  crystalForm: FormGroup = this.fb.group({
    id: [''],
    image_url: [''],
    name: [''],
    descriptions: this.fb.array([this.fb.control('')]),
    contents: this.fb.array([this.fb.control('')]),
    contentWarnings: this.fb.array([this.fb.control('')]),
    contentNotes: this.fb.array([this.fb.control('')]),
    price: [0],
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.crystal &&
      this.crystalForm.patchValue(
        this.crystal.id ? this.crystal : { ...this.crystal, id: v4() },
      );
  }

  get descriptions(): FormArray {
    return this.crystalForm.get('descriptions') as FormArray;
  }

  get contents(): FormArray {
    return this.crystalForm.get('contents') as FormArray;
  }

  get contentWarnings(): FormArray {
    return this.crystalForm.get('contentWarnings') as FormArray;
  }

  get contentNotes(): FormArray {
    return this.crystalForm.get('contentNotes') as FormArray;
  }
}
