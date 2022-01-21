import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigStepperComponent } from './config-stepper.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('ConfigStepperComponent', () => {
  let component: ConfigStepperComponent;
  let fixture: ComponentFixture<ConfigStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [ConfigStepperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
