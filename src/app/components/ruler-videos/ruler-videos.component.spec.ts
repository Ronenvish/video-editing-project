import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulerVideosComponent } from './ruler-videos.component';

describe('RulerVideosComponent', () => {
  let component: RulerVideosComponent;
  let fixture: ComponentFixture<RulerVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulerVideosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RulerVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
