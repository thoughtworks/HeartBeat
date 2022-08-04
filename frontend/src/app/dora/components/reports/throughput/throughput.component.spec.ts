import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThroughputReportComponent } from './throughput.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ThroughputReportComponent', () => {
  let throughputReportComponent: ThroughputReportComponent;
  let fixture: ComponentFixture<ThroughputReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ThroughputReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThroughputReportComponent);
    throughputReportComponent = fixture.componentInstance;
    throughputReportComponent.completedCardsNumber = [
      { sprintName: 'Iteration30', value: 13 },
      { sprintName: 'Iteration31', value: 8 },
      { sprintName: 'Iteration32', value: 11 },
      { sprintName: 'Iteration33', value: 12 },
      { sprintName: 'Iteration34', value: 13 },
      { sprintName: 'Iteration35', value: 6 },
      { sprintName: 'Iteration36', value: 13 },
      { sprintName: 'Iteration37', value: 8 },
      { sprintName: 'Iteration38', value: 11 },
      { sprintName: 'Iteration39', value: 8 },
    ];
    fixture.detectChanges();
  });

  it('should create throughput component success', () => {
    expect(throughputReportComponent).toBeTruthy();
  });
});
