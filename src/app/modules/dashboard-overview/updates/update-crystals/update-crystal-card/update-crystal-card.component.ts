import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  computed,
  EventEmitter,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { isNotNil } from 'src/app/common/utilities';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { ImageLoaderComponent } from 'src/app/components/image-loader/image-loader.component';
import {
  AccessoryTypeText,
  AllTypes,
  OptionalTypes,
} from 'src/app/consts/accessory_type.const';
import {
  CrystalAccessoryType,
  CrystalMythicalBeastType,
  CrystalPendantType,
} from 'src/app/enums/accessory-type.enum';
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
    MatSelectModule,
    MatCheckboxModule,
    DividerComponent,
    CrystalProductCardComponent,
    ConfirmDialogComponent,
    ImageLoaderComponent,
    MatProgressSpinnerModule,
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
export class UpdateCrystalCardComponent implements OnInit {
  crystal = input<Crystal | null>(null);
  @Output() crystalChanged = new EventEmitter<Crystal>();
  @Output() delete = new EventEmitter<void>();
  @Output() uploadFile = new EventEmitter<File>();

  showPreview = signal(false);
  tempImage = signal<string | null>(null);

  AllTypes = AllTypes;
  OptionalTypes = OptionalTypes;

  CrystalMythicalBeastType = CrystalMythicalBeastType;
  CrystalPendantType = CrystalPendantType;

  private readonly INIT_FORM = {
    image_url: [''],
    name: ['', Validators.required],
    descriptions: this.fb.array([]),
    emphasizes: this.fb.array([]),
    contents: this.fb.array([]),
    contentWarnings: this.fb.array([]),
    contentNotes: this.fb.array([]),
    price: [0],
    type: [CrystalPendantType.Satellite],
    mandatoryDiscount: [0],
    pendantDiscount: [0],
    mandatoryTypes: this.fb.array(AllTypes.map(() => this.fb.control(false))),
    optionalTypes: this.fb.array(
      OptionalTypes.map(() => this.fb.control(false)),
    ),
    pendantTypes: this.fb.array(AllTypes.map(() => this.fb.control(false))),
  };

  crystalForm: FormGroup = this.fb.group(this.INIT_FORM);

  constructor(
    private readonly fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const crystal = this.crystal();
    if (isNotNil(crystal)) {
      this.crystalForm.patchValue({
        image_url: crystal.image_url,
        name: crystal.name,
        price: crystal.price || 0,
        mandatoryDiscount: crystal.mandatoryDiscount || 0,
        pendantDiscount: crystal.pendantDiscount || 0,
        type: crystal.type || CrystalPendantType.Satellite,
        mandatoryTypes: this.AllTypes.map((item) =>
          (crystal.mandatoryTypes || []).includes(item.key),
        ),
        optionalTypes: this.OptionalTypes.map((item) =>
          (crystal.optionalTypes || []).includes(item.key),
        ),
        pendantTypes: this.AllTypes.map((item) =>
          (crystal.pendantTypes || []).includes(item.key),
        ),
      });

      this.updateFormArray(this.descriptions, crystal.descriptions);
      this.updateFormArray(this.emphasizes, crystal.emphasizes);
      this.updateFormArray(this.contents, crystal.contents);
      this.updateFormArray(this.contentWarnings, crystal.contentWarnings);
      this.updateFormArray(this.contentNotes, crystal.contentNotes);
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
    this.crystalForm.reset();
    this.crystalForm = this.fb.group(this.INIT_FORM);
    this.tempImage.set(null);
    this.initForm();
  }

  onPreview($event: MouseEvent) {
    $event.stopPropagation();
    this.showPreview.set(true);
  }

  onSubmit() {
    const crystal: Crystal = {
      ...this.crystalForm.value,
      mandatoryTypes: this.mandatoryTypes.value
        .map((checked: boolean, i: number) =>
          checked ? this.AllTypes[i].key : null,
        )
        .filter((v: string) => v !== null),
      optionalTypes: this.optionalTypes.value
        .map((checked: boolean, i: number) =>
          checked ? this.OptionalTypes[i].key : null,
        )
        .filter((v: string) => v !== null),
      pendantTypes: this.pendantTypes.value
        .map((checked: boolean, i: number) =>
          checked ? this.AllTypes[i].key : null,
        )
        .filter((v: string) => v !== null),
    };
    this.crystalChanged.emit(crystal);
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
        this.tempImage.set(e.target.result);
      };
      reader.readAsDataURL(file);
      this.uploadFile.emit(file);
    }
  }

  accessoryTypeValues = computed(() => {
    const keys = [
      ...Object.values(CrystalPendantType),
      ...Object.values(CrystalMythicalBeastType),
    ] as CrystalAccessoryType[];

    return keys.map((key) => ({ key, text: AccessoryTypeText[key] }));
  });

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

  get optionalTypes(): FormArray {
    return this.crystalForm.get('optionalTypes') as FormArray;
  }

  get pendantTypes(): FormArray {
    return this.crystalForm.get('pendantTypes') as FormArray;
  }

  get mandatoryTypes(): FormArray {
    return this.crystalForm.get('mandatoryTypes') as FormArray;
  }

  private updateFormArray(formArray: FormArray, values: any[]) {
    if (values?.length > 0) {
      formArray.clear();
      values.forEach((value) => formArray.push(this.fb.control(value)));
    }
  }
}
