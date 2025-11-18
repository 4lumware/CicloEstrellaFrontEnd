import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentManagement } from './comment-management';

describe('CommentManagement', () => {
  let component: CommentManagement;
  let fixture: ComponentFixture<CommentManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
