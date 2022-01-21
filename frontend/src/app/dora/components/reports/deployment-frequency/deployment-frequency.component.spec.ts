import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentFrequencyReportComponent } from './deployment-frequency.component';

describe('DeploymentFrequencyComponent', () => {
  let component: DeploymentFrequencyReportComponent;
  let fixture: ComponentFixture<DeploymentFrequencyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeploymentFrequencyReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentFrequencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
