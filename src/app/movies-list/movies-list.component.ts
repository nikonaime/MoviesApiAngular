import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MovieApiService } from '../movie-api.service';
import { Movie } from '../movies.model';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movieList$: Observable<any> = this.apiService.getSavedMovieList();

  selectedMovieId: string | undefined;
  @ViewChild('input') input: ElementRef | undefined;
  @ViewChild('inputReview') inputReview: ElementRef | undefined;

  isEditMode = false;
  constructor(private apiService: MovieApiService) {}

  deleteMovie(id: string) {
    this.apiService
      .deleteMovie(id)
      .subscribe(() => (this.movieList$ = this.apiService.getSavedMovieList()));
  }

  enterEdit(id: string) {
    this.selectedMovieId = id;
  }


  edit(movie: any) {
    console.log(movie);
    const value = this.input?.nativeElement.value;
    const valueReview = this.inputReview?.nativeElement.value;

    movie.Title = value;
    // movie.review.text = valueReview;
    // movie.review.rating = valueReview;
    this.apiService
      .editMovie(movie.id, { ...movie, value,valueReview })
      .subscribe(
        () => (this.movieList$ = this.apiService.getSavedMovieList()),
        (this.selectedMovieId = undefined)
      );
  }

  cancelEdit() {
    this.selectedMovieId = undefined;
  }
  ngOnInit(): void {}
}
