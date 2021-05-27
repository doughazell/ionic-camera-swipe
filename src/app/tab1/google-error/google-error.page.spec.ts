import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleErrorPage } from './google-error.page';

describe('GoogleErrorPage', () => {
  let component: GoogleErrorPage;
  let fixture: ComponentFixture<GoogleErrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleErrorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
