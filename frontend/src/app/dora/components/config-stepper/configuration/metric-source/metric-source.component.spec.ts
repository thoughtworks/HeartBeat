import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricSourceComponent } from './metric-source.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { UtilsService } from '../../../../service/utils.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MetricSourceComponent', () => {
  let component: MetricSourceComponent;
  let fixture: ComponentFixture<MetricSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [UtilsService],
      declarations: [MetricSourceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricSourceComponent);
    component = fixture.componentInstance;
    component.groupName = 'board';
    component.sources = {
      Linear: {
        projectName: [Validators.required],
        token: [Validators.required],
      },
    };
    component.configForm = new FormBuilder().group({
      startDate: new FormControl(new Date(), Validators.required),
      endDate: new FormControl(new Date(), Validators.required),
      considerHoliday: new FormControl(false, Validators.required),
      projectName: new FormControl('', Validators.required),
      metrics: new FormControl(['Velocity'], Validators.required),
    });
    // component.selected = 'Linear';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
