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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(throughputReportComponent).toBeTruthy();
  });
});
