import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CrystalsComponent } from 'src/app/modules/select-crystal/crystals/crystals.component';

@NgModule({
  declarations: [CrystalsComponent],
  imports: [CommonModule, MatIconModule, FormsModule],
})
export class SelectCrystalModule {}
