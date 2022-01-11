import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingDetailDialogComponent} from './training-detail-dialog.component';

describe('TrainingDetailDialogComponent', () => {
  let component: TrainingDetailDialogComponent;
  let fixture: ComponentFixture<TrainingDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingDetailDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
