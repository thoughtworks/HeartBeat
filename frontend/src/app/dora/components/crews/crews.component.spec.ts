import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewsComponent } from './crews.component';
import { FormGroup } from '@angular/forms';

describe('CrewsComponent', () => {
  let component: CrewsComponent;
  let fixture: ComponentFixture<CrewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrewsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewsComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
