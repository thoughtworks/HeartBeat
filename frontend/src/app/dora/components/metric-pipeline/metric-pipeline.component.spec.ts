import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricPipelineComponent } from './metric-pipeline.component';

describe('MetricPipelineComponent', () => {
  let component: MetricPipelineComponent;
  let fixture: ComponentFixture<MetricPipelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetricPipelineComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
