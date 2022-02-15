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
    component.deploymentFrequency = {
      avgDeploymentFrequency: {
        name: '1',
        step: '1',
        deploymentFrequency: '1',
      },
      deploymentFrequencyOfPipelines: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
