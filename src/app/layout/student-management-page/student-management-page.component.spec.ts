import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StudentManagementPageComponent} from './student-management-page.component';

describe('StudentManagementPageComponent', () => {
  let component: StudentManagementPageComponent;
  let fixture: ComponentFixture<StudentManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentManagementPageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
