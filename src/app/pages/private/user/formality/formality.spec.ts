import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formality } from './formality';

describe('Formality', () => {
  let component: Formality;
  let fixture: ComponentFixture<Formality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formality);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
