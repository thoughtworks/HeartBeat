import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTimeComponent } from './cycle-time.component';

describe('CycleTimeComponent', () => {
  let component: CycleTimeComponent;
  let fixture: ComponentFixture<CycleTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CycleTimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
