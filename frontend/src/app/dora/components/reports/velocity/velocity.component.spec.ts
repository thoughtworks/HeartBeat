import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VelocityComponent } from './velocity.component';

describe('VelocityComponent', () => {
  let component: VelocityComponent;
  let fixture: ComponentFixture<VelocityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VelocityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VelocityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
