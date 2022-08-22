import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCsvComponent } from './export-csv.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExportCsvComponent', () => {
  let component: ExportCsvComponent;
  let fixture: ComponentFixture<ExportCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExportCsvComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
