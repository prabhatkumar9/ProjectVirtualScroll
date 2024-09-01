import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // <-- Import HttpClientTestingModule here
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no outstanding requests are left open
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all movies with the correct parameters', () => {
    const dummyMovies = {
      success: true,
      data: [
        { _id: '1', title: 'Movie 1' },
        { _id: '2', title: 'Movie 2' }
      ],
      total: 2
    };

    const payload = { page_number: 2, page_size: 10, genre: 'Action' };

    service.fetchAllMovies(payload).subscribe((movies) => {
      expect(movies).toEqual(dummyMovies);
    });

    // Check that the correct URL and parameters were used
    const req = httpMock.expectOne((request) =>
      request.url === 'http://localhost:3000/api/movie' &&
      request.params.get('page_number') === '2' &&
      request.params.get('page_size') === '10' &&
      request.params.get('genre') === 'Action'
    );

    // Ensure the method was GET
    expect(req.request.method).toBe('GET');

    // Provide a mock response
    req.flush(dummyMovies);
  });

  it('should fetch genres', () => {
    const dummyGenres = {
      success: true,
      data: [{ genres: ['Action', 'Comedy'], rated: ['PG', 'R'] }]
    };

    service.fetchGenres().subscribe((genres) => {
      expect(genres).toEqual(dummyGenres);
    });

    // Check that the correct URL was used
    const req = httpMock.expectOne('http://localhost:3000/api/genres');

    // Ensure the method was GET
    expect(req.request.method).toBe('GET');

    // Provide a mock response
    req.flush(dummyGenres);
  });
});
