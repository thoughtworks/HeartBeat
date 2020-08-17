import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ConfigStepperComponent } from './components';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'config', component: ConfigStepperComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoraRoutingModule {}
