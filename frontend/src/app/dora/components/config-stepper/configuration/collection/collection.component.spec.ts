import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionComponent } from './collection.component';
import { FormGroup } from '@angular/forms';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    component.configForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
