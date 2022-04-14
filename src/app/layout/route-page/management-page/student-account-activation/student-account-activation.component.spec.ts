import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StudentAccountActivationComponent} from './student-account-activation.component';

describe('StudentAccountActivationComponent', () => {
  let component: StudentAccountActivationComponent;
  let fixture: ComponentFixture<StudentAccountActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentAccountActivationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAccountActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
