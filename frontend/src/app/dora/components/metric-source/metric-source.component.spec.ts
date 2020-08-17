import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricSourceComponent } from './metric-source.component';

describe('MetricSourceComponent', () => {
  let component: MetricSourceComponent;
  let fixture: ComponentFixture<MetricSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetricSourceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
