import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeanTimeToRecoveryComponent } from './mean-time-to-recovery.component';

describe('MeanTimeToRecoveryComponent', () => {
  let component: MeanTimeToRecoveryComponent;
  let fixture: ComponentFixture<MeanTimeToRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeanTimeToRecoveryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeanTimeToRecoveryComponent);
    component = fixture.componentInstance;
    component.meanTimeToRecovery = {
      avgMeanTimeToRecovery: {
        name: '1',
        step: '1',
        timeToRecovery: '1',
      },
      meanTimeRecoveryPipelines: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
