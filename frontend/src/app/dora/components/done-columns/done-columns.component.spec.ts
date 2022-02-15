import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneColumnsComponent } from './done-columns.component';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('DoneColumnsComponent', () => {
  let component: DoneColumnsComponent;
  let fixture: ComponentFixture<DoneColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DoneColumnsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneColumnsComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    component.metricsForm = new FormBuilder().group({});
    expect(component).toBeTruthy();
  });
});
