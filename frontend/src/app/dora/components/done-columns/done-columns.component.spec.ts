import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneColumnsComponent } from './done-columns.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
