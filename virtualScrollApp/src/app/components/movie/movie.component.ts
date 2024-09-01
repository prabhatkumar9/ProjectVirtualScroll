import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Movie } from '../../../models/movie.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addToBucket, removeFromBucket } from '../../store/actions/bucket.action';
import { selectMovies } from '../../store/selectors/movie.selector';
import { movieActions } from '../../store/actions/movie.action';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { PagerService } from '../../pager.service';
import { LoaderComponent } from "../loader/loader.component";
import { Api_Response } from '../../../models/api_response.model';
import { MovieService } from '../../movie.service';


@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, ScrollingModule, LoaderComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit, OnDestroy {

  private movService = inject(MovieService);
  private store: Store<{ movies: Api_Response }> = inject(Store);
  private storeData: Observable<any> = this.store.select(selectMovies);
  private subs?: Subscription;
  private genre?: Subscription;
  filteredMovies$?: Observable<any>;

  page_number: number = 1;
  page_size: number = 20;
  isLoading: Boolean = false;
  message: String = '';
  movies: Movie[] = [];

  selectedGenre: String = '';
  genreList: any = [];
  ratedList: any = [];

  pagerService = inject(PagerService);
  pager: any = {};

  @ViewChild('cdkViewPort') cdkViewPort?: CdkVirtualScrollViewport;

  ngOnInit(): void {
    this.getRatedAndGenre();
    this.subscribeData();
    this.loadMoreMovies();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }

    if (this.genre) {
      this.genre.unsubscribe();
    }
  }

  getRatedAndGenre() {
    this.genre = this.movService.fetchGenres().subscribe((result: any) => {
      // console.log("result >> ", result);
      if (result.success) {
        this.genreList = result?.data[0]?.genres ?? [];
        this.ratedList = result?.data[0]?.rated ?? [];
      }
    })
  }

  subscribeData() {
    this.isLoading = true;
    this.subs = this.storeData.subscribe((response: any) => {
      // console.log("res >> ", response);
      if (response.success) {
        this.movies = response.data;
        this.pager = this.pagerService.getPager(response.total, this.page_number, this.page_size);
        // console.log("this.pager >> ", this.pager.currentPage);
        this.message = '';
      } else {
        this.movies = [];
        this.message = response.message;
      };
      this.isLoading = false;
    });
  }

  loadMoreMovies() {
    this.isLoading = true;

    let obj: any = {
      page_number: this.page_number,
      page_size: this.page_size,
    };

    if (this.selectedGenre) {
      obj['genre'] = this.selectedGenre;
    }

    this.store.dispatch(movieActions.loadMovies({ payload: obj }));
  }

  onTypeChange(event: Event) {
    // console.log("change");

    if (this.cdkViewPort) {
      this.cdkViewPort.scrollToOffset(0);
    };

    let selectedtype = (event.target as HTMLSelectElement).value;
    this.selectedGenre = selectedtype;
    this.page_number = 1;
    // this.isLoading = true;
    this.loadMoreMovies();
  }

  increment(item: Movie) {
    const payload = {
      id: item._id,
      name: item.title,
      imdb: item?.imdb?.rating ?? 0,
    }

    this.store.dispatch(addToBucket({ payload }));
  }

  decrement(item: Movie) {
    const payload = {
      id: item._id,
      name: item.title,
      imdb: item?.imdb?.rating ?? 0,
    }

    this.store.dispatch(removeFromBucket({ payload }));
  }


  onScroll(event: any): void {
    // Load more items when scrolled past 50%
    // Calculate the scroll position as a percentage
    const scrollPosition = event.target.scrollTop + event.target.offsetHeight;
    const scrollHeight = event.target.scrollHeight;

    // console.log("scrollPosition / scrollHeight >> ", scrollPosition / scrollHeight);


    if ((scrollPosition / scrollHeight) > 0.8 && !this.isLoading) {
      // console.log("from here ....");
      let page = this.pager.currentPage;
      let endpage = this.pager.endPage;

      if (page < endpage) {
        this.page_number += 1;
      }

      this.isLoading = true;
      this.loadMoreMovies();
    }
  }

}
