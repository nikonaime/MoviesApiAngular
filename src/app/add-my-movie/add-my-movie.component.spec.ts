import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMyMovieComponent } from './add-my-movie.component';

describe('AddMyMovieComponent', () => {
  let component: AddMyMovieComponent;
  let fixture: ComponentFixture<AddMyMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMyMovieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMyMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
