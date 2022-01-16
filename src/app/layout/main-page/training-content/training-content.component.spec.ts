import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingContentComponent} from './training-content.component';

describe('TrainingListContentComponent', () => {
  let component: TrainingContentComponent;
  let fixture: ComponentFixture<TrainingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingContentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
