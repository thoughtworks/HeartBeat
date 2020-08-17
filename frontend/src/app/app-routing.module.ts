import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dora',
    loadChildren: () => import('./dora/dora.module').then((m) => m.DoraModule),
  },
  {
    path: '',
    redirectTo: 'dora/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
