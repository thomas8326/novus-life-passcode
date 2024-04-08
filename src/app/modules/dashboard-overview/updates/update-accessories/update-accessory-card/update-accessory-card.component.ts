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
import { CrystalAccessory } from 'src/app/models/crystal-accessory';
import { CrystalAccessoryCardComponent } from 'src/app/modules/crystals-showroom/crystal-accessory-card/crystal-accessory-card.component';

@Component({
  selector: 'app-update-accessory-card',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DividerComponent,
    ConfirmDialogComponent,
    FirebaseImgUrlDirective,
    CrystalAccessoryCardComponent,
  ],
  templateUrl: './update-accessory-card.component.html',
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
export class UpdateAccessoryCardComponent {
  @Input('accessory') set setAccessory(accessory: CrystalAccessory) {
    this.accessory = accessory;
    this.initForm();
  }
  @Output() accessoryChanged = new EventEmitter<CrystalAccessory>();
  @Output() delete = new EventEmitter<string>();
  @Output() uploadFile = new EventEmitter<File>();

  showPreview = signal(false);
  tempImage: string | null = null;
  accessory: CrystalAccessory | null = null;

  private readonly INIT_FORM = {
    image_url: [''],
    name: ['', Validators.required],
    descriptions: this.fb.array([]),
    price: [0],
  };

  crystalAccessoryForm: FormGroup = this.fb.group(this.INIT_FORM);

  constructor(
    private readonly fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

  initForm() {
    if (this.accessory) {
      this.crystalAccessoryForm.patchValue({
        image_url: this.accessory.image_url,
        name: this.accessory.name,
        price: this.accessory.price || 0,
      });

      this.updateFormArray(this.descriptions, this.accessory.descriptions);
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
      if (confirmed) {
        this.onDelete();
      }
    });
  }

  onRedo() {
    this.crystalAccessoryForm.reset();
    this.crystalAccessoryForm = this.fb.group(this.INIT_FORM);
    this.initForm();
  }

  onPreview($event: MouseEvent) {
    $event.stopPropagation();
    this.showPreview.set(true);
  }

  onSubmit() {
    this.accessoryChanged.emit(this.crystalAccessoryForm.value);
  }

  onDelete() {
    this.delete.emit(this.crystalAccessoryForm.value.id);
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
    return this.crystalAccessoryForm.get('descriptions') as FormArray;
  }

  private updateFormArray(formArray: FormArray, values: any[]) {
    if (values?.length > 0) {
      formArray.clear();
      values.forEach((value) => formArray.push(this.fb.control(value)));
    }
  }
}
