import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleItemComponent } from './cycle-item.component';
import { FormArray, FormGroup } from '@angular/forms';

describe('CycleColumnComponent', () => {
  let component: CycleItemComponent;
  let fixture: ComponentFixture<CycleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CycleItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleItemComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({
      cycleTime: new FormGroup({
        jiraColumns: new FormArray([]),
      }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
