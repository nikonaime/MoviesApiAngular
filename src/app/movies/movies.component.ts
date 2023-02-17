import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  from,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { MovieSearchResponse, Movie } from '../movies.model';
import { MovieApiService } from '../movie-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { query } from '@angular/animations';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  constructor(
    private movieService: MovieApiService // private toastr: ToastrService
  ) // private toastr: ToastrService
  {}
  search = new FormControl();

  result$: Observable<MovieSearchResponse> | undefined;
  currencies$: Observable<any> | undefined;
  countries$: Observable<any> | undefined;

  reviewText: string | undefined;
  ratingValue: number | undefined;
  showReviewForm: boolean | undefined;

  private getEmptyResult() {
    const empty: MovieSearchResponse = {};

    return of(empty);
  }

  addToList(movie: Movie) {
    this.movieService.saveMovie(movie).subscribe(() => 'movie has been added');
  }

  addReview(result: Movie) {
    const review = { text: this.reviewText, rating: Number(this.ratingValue) };
    const updatedResult = { ...result, review };
    console.log(updatedResult)
    this.movieService
      .saveMovie(updatedResult)
      .subscribe(() => this.showReviewForm = !this.showReviewForm);
  }

  ngOnInit(): void {
    this.result$ = this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query) => {
        if (query.length > 3 && query.length < 120) {
          return this.movieService.searchMovie(query);
        }

        return this.getEmptyResult();
      }),
      catchError((error: HttpErrorResponse) => {
        return this.getEmptyResult();
      })
    );

    this.currencies$ = this.result$.pipe(
      switchMap((value) => from(this.movieService.getCurrencies(value.Country)))
    );

    this.countries$ = this.result$.pipe(
      switchMap((value) =>
        from(this.movieService.getCountryCodesForFlags(value.Country))
      )
    );
  }
}
