import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BucketComponent } from './components/bucket/bucket.component';
import { MovieComponent } from './components/movie/movie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BucketComponent, MovieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


}
