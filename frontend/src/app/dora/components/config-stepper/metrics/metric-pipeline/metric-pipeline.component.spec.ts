import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricPipelineComponent } from './metric-pipeline.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('MetricPipelineComponent', () => {
  let component: MetricPipelineComponent;
  let fixture: ComponentFixture<MetricPipelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MetricPipelineComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricPipelineComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({});
    component.formArrayName = 'test';
    component.pipelines = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
