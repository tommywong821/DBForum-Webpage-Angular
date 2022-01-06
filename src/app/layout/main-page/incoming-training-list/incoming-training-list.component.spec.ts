import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IncomingTrainingListComponent} from './incoming-training-list.component';

describe('IncomingTrainingListComponent', () => {
  let component: IncomingTrainingListComponent;
  let fixture: ComponentFixture<IncomingTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomingTrainingListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
