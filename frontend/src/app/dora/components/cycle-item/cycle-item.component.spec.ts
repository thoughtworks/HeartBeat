import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleItemComponent } from './cycle-item.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatError } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CycleColumnComponent', () => {
  let component: CycleItemComponent;
  let fixture: ComponentFixture<CycleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSelectModule, BrowserAnimationsModule],
      declarations: [CycleItemComponent, MatError],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleItemComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({
      cycleTime: new FormGroup({
        jiraColumns: new FormArray([
          new FormGroup({
            key: new FormArray([new FormControl('')]),
          }),
        ]),
      }),
    });
    component.groupName = '0';
    component.columnItemKey = 'key';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
