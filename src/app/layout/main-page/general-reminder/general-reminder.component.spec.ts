import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneralReminderComponent} from './general-reminder.component';

describe('GeneralReminderComponent', () => {
  let component: GeneralReminderComponent;
  let fixture: ComponentFixture<GeneralReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralReminderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
