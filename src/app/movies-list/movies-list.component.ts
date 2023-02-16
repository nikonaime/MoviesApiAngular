import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MovieApiService } from '../movie-api.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit {

  movieList$ : Observable<any> = this.apiService.getSavedMovieList();

  constructor(private apiService: MovieApiService) { }

  deleteMovie(id: string) {
    this.apiService.deleteMovie(id).subscribe((bla)=> console.log(bla))
  }

  ngOnInit(): void {
    
  }

}
