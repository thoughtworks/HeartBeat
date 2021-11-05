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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
