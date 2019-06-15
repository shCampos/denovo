import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListareqComponent } from './listareq.component';

describe('ListareqComponent', () => {
  let component: ListareqComponent;
  let fixture: ComponentFixture<ListareqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListareqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListareqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
