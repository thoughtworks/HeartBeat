import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineItemComponent } from './pipeline-item.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormArray, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PipelineItemComponent', () => {
  let component: PipelineItemComponent;
  let fixture: ComponentFixture<PipelineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule, MatSelectModule, BrowserAnimationsModule],
      declarations: [PipelineItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineItemComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({
      test: new FormArray([]),
    });
    component.formArrayName = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
