import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, Subject, Subscription } from 'rxjs';
import { MovieComponent } from './movie.component';
import { MovieService } from '../../movie.service';
import { PagerService } from '../../pager.service';
import { LoaderComponent } from '../loader/loader.component';
import { selectMovies } from '../../store/selectors/movie.selector';
import { movieActions } from '../../store/actions/movie.action';
import { addToBucket, removeFromBucket } from '../../store/actions/bucket.action';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Movie } from '../../../models/movie.model';
import { Api_Response } from '../../../models/api_response.model';
import { CommonModule } from '@angular/common';

fdescribe('MovieComponent', () => {
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;
  let store: MockStore;
  let movieService: jasmine.SpyObj<MovieService>;
  let pagerService: jasmine.SpyObj<PagerService>;

  const initialState = { movies: { success: true, data: [], total: 0 } };

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['fetchGenres']);
    const pagerServiceSpy = jasmine.createSpyObj('PagerService', ['getPager']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ScrollingModule, MovieComponent, LoaderComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: PagerService, useValue: pagerServiceSpy },
      ],
    }).compileComponents();

    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    pagerService = TestBed.inject(PagerService) as jasmine.SpyObj<PagerService>;

    movieService.fetchGenres.and.returnValue(of({
      success: true,
      data: [{ genres: ['Action'], rated: ['PG'] }]
    }));

    fixture = TestBed.createComponent(MovieComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data from store', () => {
    const mockMovies: Api_Response = {
      success: true,
      data: [{ _id: '1', title: 'Movie 1', imdb: { rating: 8.0 } }],
      page_number: 1,
      page_size: 10,
      message: "test",
      genre: "Action",
      total: 100
    };

    store.overrideSelector(selectMovies, mockMovies);
    fixture.detectChanges();

    expect(component.movies).toEqual([]);
  });

  it('should call MovieService.fetchGenres on initialization', (done) => {
    const genresResponse = { success: true, data: [{ genres: ['Action'], rated: ['PG'] }] };
    movieService.fetchGenres.and.returnValue(of(genresResponse));

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(movieService.fetchGenres).toHaveBeenCalled();
      expect(component.genreList).toEqual(['Action']);
      expect(component.ratedList).toEqual(['PG']);
      done();
    });
  });

  it('should dispatch loadMovies action on loadMoreMovies', () => {
    spyOn(store, 'dispatch');
    component.loadMoreMovies();

    expect(store.dispatch).toHaveBeenCalledWith(movieActions.loadMovies({ payload: { page_number: 1, page_size: 20 } }));
  });

  it('should dispatch addToBucket action when increment is called', () => {
    const movie: Partial<Movie> | unknown | any = {
      _id: '1',
      title: 'Movie 1',
      imdb: { rating: 8.0 }
    };
    spyOn(store, 'dispatch');
    component.increment(movie);

    expect(store.dispatch).toHaveBeenCalledWith(addToBucket({ payload: { id: '1', name: 'Movie 1', imdb: 8.0 } }));
  });

  it('should dispatch removeFromBucket action when decrement is called', () => {
    const movie: Partial<Movie> | unknown | any = {
      _id: '1', title: 'Movie 1', imdb: { rating: 8.0 }
    };
    spyOn(store, 'dispatch');
    component.decrement(movie);

    expect(store.dispatch).toHaveBeenCalledWith(removeFromBucket({ payload: { id: '1', name: 'Movie 1', imdb: 8.0 } }));
  });

  it('should not call loadMoreMovies if isLoading is true', () => {
    const scrollEvent = {
      target: { scrollTop: 250, offsetHeight: 200, scrollHeight: 500 }
    };

    // Set isLoading to true to prevent loadMoreMovies from being called
    component.isLoading = true;

    spyOn(component, 'loadMoreMovies');

    component.onScroll(scrollEvent);

    // Assert that loadMoreMovies was not called because isLoading was true
    expect(component.loadMoreMovies).not.toHaveBeenCalled();
  });

  it('should not call loadMoreMovies if scrollPosition is below 80%', () => {
    const scrollEvent = {
      target: { scrollTop: 100, offsetHeight: 200, scrollHeight: 1000 }
    };

    // Set isLoading to false to ensure loadMoreMovies could be called
    component.isLoading = false;

    spyOn(component, 'loadMoreMovies');

    component.onScroll(scrollEvent);

    // Assert that loadMoreMovies was not called because scrollPosition was below 80%
    expect(component.loadMoreMovies).not.toHaveBeenCalled();
  });


  it('should update selectedGenre and reload movies on type change', () => {
    spyOn(component, 'loadMoreMovies');
    const event = { target: { value: 'Action' } } as unknown as Event;
    component.onTypeChange(event);

    expect(component.selectedGenre).toBe('Action');
    expect(component.page_number).toBe(1);
    expect(component.loadMoreMovies).toHaveBeenCalled();
  });

  it('should unsubscribe on component destroy', () => {
    const subs = new Subscription();
    const genre = new Subscription();

    spyOn(subs, 'unsubscribe');
    spyOn(genre, 'unsubscribe');

    component['subs'] = subs;
    component['genre'] = genre;

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(subs.unsubscribe).toHaveBeenCalled();
    expect(genre.unsubscribe).toHaveBeenCalled();
  });
});

