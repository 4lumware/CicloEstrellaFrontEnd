import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementSearchForm } from './user-management-search-form';

describe('UserManagementSearchForm', () => {
  let component: UserManagementSearchForm;
  let fixture: ComponentFixture<UserManagementSearchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementSearchForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagementSearchForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
