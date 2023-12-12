import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from 'src/app/modules/client/client.component';
import { HomeComponent } from 'src/app/modules/client/home/home.component';
const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'crystals',
        loadChildren: () =>
          import('../select-crystal/select-crystal.module').then(
            (m) => m.SelectCrystalModule
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
