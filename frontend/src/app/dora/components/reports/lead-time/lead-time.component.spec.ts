import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTimeComponent } from './lead-time.component';

describe('LeadTimeComponent', () => {
  let component: LeadTimeComponent;
  let fixture: ComponentFixture<LeadTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadTimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
