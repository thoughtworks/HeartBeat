import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigStepperComponent } from './components/config-stepper/config-stepper.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'config', component: ConfigStepperComponent },
  { path: '', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoraRoutingModule {}
