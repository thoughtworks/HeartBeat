/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassificationReportComponent } from './classification.component';

describe('ReportsClassificationComponent', () => {
  let component: ClassificationReportComponent;
  let fixture: ComponentFixture<ClassificationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassificationReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationReportComponent);
    component = fixture.componentInstance;
    component.classifications = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
