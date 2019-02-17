import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHostComponent } from './chat-host.component';

describe('ChatHostComponent', () => {
  let component: ChatHostComponent;
  let fixture: ComponentFixture<ChatHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
