import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTimeComponent } from './cycle-time.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
