import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEditModal } from './employee-edit-modal';

describe('EmployeeEditModal', () => {
  let component: EmployeeEditModal;
  let fixture: ComponentFixture<EmployeeEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeEditModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
