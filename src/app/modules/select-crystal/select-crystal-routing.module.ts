import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrystalsComponent } from 'src/app/modules/select-crystal/crystals/crystals.component';
const routes: Routes = [
  {
    path: 'type',
    component: CrystalsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectCrystalModule {}
