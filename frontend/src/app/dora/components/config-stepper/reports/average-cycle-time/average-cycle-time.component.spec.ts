import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AverageCycleTimeReportComponent } from './average-cycle-time.component';

describe('Display averageCycleTimeReportComponent ', () => {
  let component: AverageCycleTimeReportComponent;
  let fixture: ComponentFixture<AverageCycleTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AverageCycleTimeReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageCycleTimeReportComponent);
    component = fixture.componentInstance;
    component.standardDeviation = [
      {
        sprintName: 'ADM Sprint4',
        value: {
          standardDeviation: 1.41,
          average: 2.94,
        },
      },
    ];

    fixture.detectChanges();
  });

  it('should create averageCycleTimeReportComponent', () => {
    expect(component).toBeTruthy();
  });
});
