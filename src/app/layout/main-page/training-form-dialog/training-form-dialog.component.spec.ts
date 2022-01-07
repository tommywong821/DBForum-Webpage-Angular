import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingFormDialogComponent} from './training-form-dialog.component';

describe('TrainingFormDialogComponent', () => {
  let component: TrainingFormDialogComponent;
  let fixture: ComponentFixture<TrainingFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingFormDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
