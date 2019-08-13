import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpagePage } from './hpage.page';

describe('HpagePage', () => {
  let component: HpagePage;
  let fixture: ComponentFixture<HpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
