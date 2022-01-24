/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClassificationComponent } from './classification.component';
import { FormGroup } from '@angular/forms';

describe('ClassificationComponent', () => {
  let component: ClassificationComponent;
  let fixture: ComponentFixture<ClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassificationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationComponent);
    component = fixture.componentInstance;
    component.metricsForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
