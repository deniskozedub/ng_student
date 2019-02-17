import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadAuthComponent } from './head-auth.component';

describe('HeadAuthComponent', () => {
  let component: HeadAuthComponent;
  let fixture: ComponentFixture<HeadAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
