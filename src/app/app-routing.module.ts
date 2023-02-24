import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMyMovieComponent } from './add-my-movie/add-my-movie.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MoviesComponent } from './movies/movies.component';

const routes: Routes = [
  { path: '', component: MoviesComponent },
  { path: 'moviesList', component: MoviesListComponent },
  { path: 'addMovie', component: AddMyMovieComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
