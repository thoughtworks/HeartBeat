import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineItemComponent } from './pipeline-item.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';

describe('PipelineItemComponent', () => {
  let component: PipelineItemComponent;
  let fixture: ComponentFixture<PipelineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      declarations: [PipelineItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineItemComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
