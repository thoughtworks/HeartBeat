import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VelocityReportComponent } from './velocity.component';

describe('VelocityComponent', () => {
  let component: VelocityReportComponent;
  let fixture: ComponentFixture<VelocityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VelocityReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VelocityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
