import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoraRoutingModule } from './dora-routing.module';
import { SharedModule } from '../shared/shared.module';
import * as fromComponents from './components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...fromComponents.components],
  imports: [CommonModule, DoraRoutingModule, SharedModule, ReactiveFormsModule],
})
export class DoraModule {}
