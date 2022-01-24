import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTimeComponent } from './cycle-time.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('CycleTimeComponent', () => {
  let component: CycleTimeComponent;
  let fixture: ComponentFixture<CycleTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CycleTimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleTimeComponent);
    component = fixture.componentInstance;
    component.cycleTimeData = [];
    component.importCycleTime = undefined;
    component.metricsForm = new FormGroup({});
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
