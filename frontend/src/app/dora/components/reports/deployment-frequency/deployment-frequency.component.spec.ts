import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentFrequencyComponent } from './deployment-frequency.component';

describe('DeploymentFrequencyComponent', () => {
  let component: DeploymentFrequencyComponent;
  let fixture: ComponentFixture<DeploymentFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeploymentFrequencyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
