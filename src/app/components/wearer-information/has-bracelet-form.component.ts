import { Component, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { FileSizePipe } from 'src/app/pipes/fileSize.pipe';

@Component({
  selector: 'app-has-bracelet-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxComponent,
    MatButtonModule,
    MatIconModule,
    FileSizePipe,
  ],
  template: `
    <div class="flex flex-col gap-2">
      <label class="flex items-center cursor-pointer gap-1.5">
        <app-checkbox
          [checked]="hasBraceletControl().value"
          (checkedChange)="
            hasBraceletControl().setValue($event); onRemoveFile()
          "
        >
        </app-checkbox>
        <span class="text-mobileContent sm:text-desktopContent"
          >是否有搭配過生命密碼手鍊</span
        >
      </label>

      @if (hasBraceletControl().value) {
        <div class="my-2">
          <div>
            <input
              type="file"
              class="appearance-none hidden"
              #file
              multiple="false"
              accept="image/*"
              (change)="onFileChange(file.files)"
            />
            @let tempImageData = tempImage();
            @if (tempImageData) {
              <div
                class="flex flex-col sm:flex-row gap-2 sm:items-center my-2 relative border sm:border-0 border-gray-400 rounded p-2"
              >
                <img
                  [src]="tempImageData.src"
                  alt="Product Image"
                  class="w-16 h-16 sm:w-32 sm:h-32"
                />
                <div class="line-clamp-5 flex-1">
                  {{ tempImageData.file.name }}
                </div>
                <div class="flex-none">
                  {{ tempImageData.file.size | fileSize }}
                  @if (tempImageData.file.size > FileSize5MB) {
                    <div
                      class="text-red-500 sm:text-desktopSmall text-mobileSmall"
                    >
                      檔案大小超過5MB
                    </div>
                  }
                </div>
                <button
                  mat-button
                  class="sm:!p-4 !absolute top-0 -right-2 sm:!relative"
                  (click)="$event.stopPropagation(); onRemoveFile()"
                >
                  <mat-icon class="!w-6 !h-6 !text-[24px] !m-0">close</mat-icon>
                </button>
              </div>
            }
            <button
              type="button"
              mat-raised-button
              color="primary"
              (click)="file.click()"
            >
              上傳手鍊圖片
            </button>
          </div>
          <div class="text-mobileSmall sm:text-desktopSmall text-gray-600">
            *檔案大小勿超過5MB* <br />
            *將已搭配的生命密碼手鍊一起放在桌面上拍攝若有搭配三條，則三條都在同一張照片即可*
          </div>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class HasBraceletFormComponent {
  hasBraceletControl = input.required<FormControl<boolean>>();
  FileSize5MB = 5 * 1024 * 1024;
  tempImage = model<{ src: string; file: File } | null>(null);

  onRemoveFile() {
    this.tempImage.set(null);
  }

  onFileChange(fileList: FileList | null) {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempImage.set({
          src: e.target.result,
          file,
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
