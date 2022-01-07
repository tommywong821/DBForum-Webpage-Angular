import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingSummaryComponent} from './training-summary.component';

describe('IncomingTrainingSummaryComponent', () => {
  let component: TrainingSummaryComponent;
  let fixture: ComponentFixture<TrainingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingSummaryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
