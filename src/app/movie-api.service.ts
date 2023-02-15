import { Inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MovieSearchResponse } from './movies.model';
import { API_BASE } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE) private apiBase: string
  ) {}

  getCurrencies(country: any): Observable<any> {
    const countries = country.split(', ');
    const observables = countries.map((country: any) => {
      const url =
        `https://restcountries.com/v3.1/name/${country}` + '?fullText=true';
      return this.http.get<any>(url).pipe(map((data) => data[0].currencies));
    });

    return forkJoin(observables).pipe(
      map((value: any) =>
        value.map((obj: object) => Object.values(obj)[0].name).join(', ')
      )
    );
  }

  getCountryCodesForFlags(country: any): Observable<any> {
    const countries = country.split(', ');

    const observables = countries.map((country: any) => {
      const url =
        `https://restcountries.com/v3.1/name/${country}` + '?fullText=true';
      return this.http.get<any>(url).pipe(map((data) => data[0].cca2));
    });

    return forkJoin(observables).pipe(
      map((value: any) => value.map((obj: object) => obj).join(', '))
    );
  }

  searchMovie(query: string): Observable<MovieSearchResponse> {
    console.log(query);
    return this.http.get<MovieSearchResponse>(`${this.apiBase}` + query);
  }
}
