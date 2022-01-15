import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingListContentComponent} from './training-list-content.component';

describe('TrainingListContentComponent', () => {
  let component: TrainingListContentComponent;
  let fixture: ComponentFixture<TrainingListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingListContentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
