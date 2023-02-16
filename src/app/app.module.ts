import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieApiService } from './movie-api.service';
import { MoviesComponent } from './movies/movies.component';
import { API_BASE } from './tokens';
import { ExtractNamesPipe } from './extract-names.pipe';
import { YearAgoPipe } from './year-ago.pipe';
import { CommaSeparatedToArrayPipe } from './comma-separated-to-array.pipe';
import { MoviesListComponent } from './movies-list/movies-list.component';

@NgModule({
  declarations: [AppComponent, MoviesComponent, ExtractNamesPipe, YearAgoPipe, CommaSeparatedToArrayPipe, MoviesListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: API_BASE,
      useValue: environment.apiBase,
    },
    MovieApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
