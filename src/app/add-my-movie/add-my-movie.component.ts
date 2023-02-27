import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-my-movie',
  templateUrl: './add-my-movie.component.html',
  styleUrls: ['./add-my-movie.component.scss'],
})
export class AddMyMovieComponent implements OnInit {
  movieForm!: FormGroup;
  movies: any[] = [];
  countries: any[] = [];
  genres = ['Action', 'Horror', 'Comedy', 'Drama', 'Romance'];

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.movieForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],

      countries: this.formBuilder.array([]),
      premierEventPlace: [{ value: '', disabled: true }],

      releaseDate: [
        '',
        [
          Validators.required,
          (control: FormControl) => this.futureDateValidator(control.value),
        ],
      ],
      selectedGenres: ['', [Validators.required, this.checkSelectedGenres()]],
      category: ['', Validators.required],
      numberField: [
        '',
        [
          Validators.required,
          (control2: FormControl) => this.rangeValidator(control2),
          ,
        ],
      ],
      number: [''],
    });
    this.loadMovies();
    this.loadCountries();
  }

  loadMovies() {
    this.http.get<any[]>('http://localhost:3000/myMovies').subscribe((data) => {
      this.movies = data;
    });
  }

  checkDuplicateMovieName(name: string) {
    return this.movies.some(
      (movie) => movie.data.name.toLowerCase() === name.toLowerCase()
    );
  }

  onSubmit() {
    if (this.movieForm.invalid) {
      return;
    }

    const name = this.movieForm.controls['name'].value;
    const data = this.movieForm.value;

    if (this.checkDuplicateMovieName(name)) {
      console.log(`Movie with name '${name}' already exists`);
      return;
    }

    this.http
      .post('http://localhost:3000/myMovies', { data })
      .subscribe((data) => {
        console.log(data);
        this.movies.push(data);
      });
  }

  futureDateValidator(date: string) {
    const today = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  rangeValidator(control: any) {
    const value = control.value;
    console.log(value);
    if (value < 60 || value > 190) {
      return { rangeError: true };
    }
    return null;
  }

  private checkSelectedGenres(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedGenres = control.value;
      if (!selectedGenres || selectedGenres.length === 0) {
        return { noSelection: true };
      }
      return null;
    };
  }

  checkDuplicateName() {
    const name = this.movieForm.controls['name'].value;

    if (name.length < 3) {
      this.movieForm.controls['name'].setErrors({ minlength: true });
      return;
    }

    if (name.length > 20) {
      this.movieForm.controls['name'].setErrors({ maxlength: true });
      return;
    }

    if (this.checkDuplicateMovieName(name)) {
      this.movieForm.controls['name'].setErrors({ duplicateName: true });
    } else {
      this.movieForm.controls['name'].setErrors(null);
    }
  }

  ngOnInit(): void {
    this.movieForm
      .get('countries')
      ?.valueChanges.pipe(
        debounceTime(400),
        switchMap((countries: any) => {
          const requests = countries.map((country: any) => {
            const url = `https://restcountries.com/v2/name/${country['country']}?fullText=true`;
            return this.http
              .get(url, { params: { fields: 'population' } })
              .pipe(
                catchError((error) => {
                  console.log(
                    `Error while fetching population data for ${country}:`,
                    error
                  );
                  return of(null);
                })
              );
          });
          return forkJoin(requests);
        })
      )
      .subscribe((responses: any) => {
        const populations = responses
          .filter(Boolean)
          .map((response: any) => response[0].population);
        console.log(populations);
        const hasSmallPopulation = populations.some(
          (population: any) => population < 50000000
        );
        if (hasSmallPopulation) {
          this.movieForm.get('premierEventPlace')?.disable();
        } else {
          this.movieForm.get('premierEventPlace')?.enable();
        }
      });
  }

  get countryControls() {
    return (this.movieForm.get('countries') as FormArray).controls;
  }

  get genreControls() {
    return (this.movieForm.get('genre') as FormArray).controls;
  }

  loadCountries() {
    this.http
      .get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe((countries) => {
        this.countries = countries;
        this.addCountry();
      });
  }

  addCountry() {
    console.log(this.movieForm.get('countries')?.value);

    const countryGroup = this.formBuilder.group({
      country: ['', Validators.required],
    });
    (this.movieForm.get('countries') as FormArray).push(countryGroup);
  }

  removeCountry(index: number) {
    (this.movieForm.get('countries') as FormArray).removeAt(index);
  }

  getSelectedCountries(): string[] {
    return this.countryControls.map((control) => control.value.country);
  }
}
