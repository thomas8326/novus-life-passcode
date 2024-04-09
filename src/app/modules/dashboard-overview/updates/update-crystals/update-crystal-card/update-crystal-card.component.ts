import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { Crystal } from 'src/app/models/crystal';
import { CrystalProductCardComponent } from 'src/app/modules/crystals-showroom/crystal-product-card/crystal-product-card.component';

@Component({
  selector: 'app-update-crystal-card',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DividerComponent,
    CrystalProductCardComponent,
    ConfirmDialogComponent,
    FirebaseImgUrlDirective,
  ],
  templateUrl: './update-crystal-card.component.html',
  styles: ``,
  animations: [
    trigger('slideInOut', [
      state('void', style({ transform: 'translateX(100%)' })),
      state('*', style({ transform: 'translateX(0)' })),
      transition(':enter', [animate('200ms ease-in')]),
      transition(':leave', [animate('200ms ease-in')]),
    ]),
  ],
})
export class UpdateCrystalCardComponent {
  @Input('crystal') set setCrystal(_crystal: Crystal) {
    this.crystal = _crystal;
    this.initForm();
  }
  @Output() crystalChanged = new EventEmitter<Crystal>();
  @Output() delete = new EventEmitter<void>();
  @Output() uploadFile = new EventEmitter<File>();

  showPreview = signal(false);
  tempImage: string | null = null;
  crystal: Crystal | null = null;

  private readonly INIT_FORM = {
    image_url: [''],
    name: ['', Validators.required],
    descriptions: this.fb.array([]),
    emphasizes: this.fb.array([]),
    contents: this.fb.array([]),
    contentWarnings: this.fb.array([]),
    contentNotes: this.fb.array([]),
    price: [0],
    accessoryDiscount: [0],
  };

  crystalForm: FormGroup = this.fb.group(this.INIT_FORM);

  constructor(
    private readonly fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

  initForm() {
    if (this.crystal) {
      this.crystalForm.patchValue({
        image_url: this.crystal.image_url,
        name: this.crystal.name,
        price: this.crystal.price || 0,
        accessoryDiscount: this.crystal.accessoryDiscount || 0,
      });

      this.updateFormArray(this.descriptions, this.crystal.descriptions);
      this.updateFormArray(this.emphasizes, this.crystal.emphasizes);
      this.updateFormArray(this.contents, this.crystal.contents);
      this.updateFormArray(this.contentWarnings, this.crystal.contentWarnings);
      this.updateFormArray(this.contentNotes, this.crystal.contentNotes);
    }
  }

  onOpenDeletedDialog() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '刪除資料',
        message: '刪除後無法回覆資料，確定要刪除嗎？',
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      console.log('confirmed', confirmed);
      if (confirmed) {
        this.onDelete();
      }
    });
  }

  onRedo() {
    this.crystalForm.reset();
    this.crystalForm = this.fb.group(this.INIT_FORM);
    this.tempImage = null;
    this.initForm();
  }

  onPreview($event: MouseEvent) {
    $event.stopPropagation();
    this.showPreview.set(true);
  }

  onSubmit() {
    this.crystalChanged.emit(this.crystalForm.value);
  }

  onDelete() {
    this.delete.emit(this.crystalForm.value.id);
  }

  onAddNewField(array: FormArray) {
    if (array.length <= 10) {
      array.push(this.fb.control(''));
    }
  }

  onDeleteField(array: FormArray, index: number) {
    array.removeAt(index);
  }

  onUploadImage(fileList: FileList | null) {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempImage = e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadFile.emit(file);
    }
  }

  get descriptions(): FormArray {
    return this.crystalForm.get('descriptions') as FormArray;
  }

  get emphasizes(): FormArray {
    return this.crystalForm.get('emphasizes') as FormArray;
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

  private updateFormArray(formArray: FormArray, values: any[]) {
    if (values?.length > 0) {
      formArray.clear();
      values.forEach((value) => formArray.push(this.fb.control(value)));
    }
  }
}
