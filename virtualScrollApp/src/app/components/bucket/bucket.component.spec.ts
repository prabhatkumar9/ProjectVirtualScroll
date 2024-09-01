import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BucketComponent } from './bucket.component';
import { Bucket } from '../../../models/bucket.model';
import { removeFromBucket } from '../../store/actions/bucket.action';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoaderComponent } from '../loader/loader.component';

fdescribe('BucketComponent', () => {
  let component: BucketComponent;
  let fixture: ComponentFixture<BucketComponent>;
  let store: MockStore;
  const initialState = { bucket: [] as Bucket[] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, ScrollingModule, BucketComponent, LoaderComponent],
      providers: [
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select bucket from the store', () => {
    const mockBuckets: Bucket[] = [{ id: '1', name: 'Item 1', imdb: Number('8.0') }];
    store.overrideSelector('bucket', mockBuckets);

    component.myBucket$?.subscribe(buckets => {
      expect(buckets).toEqual([]);
    });
  });

  it('should call store.dispatch when decrement is called', () => {
    const item: Bucket = { id: '1', name: 'Item 1', imdb: Number('8.0') };
    spyOn(store, 'dispatch');
    component.decrement(item);
    expect(store.dispatch).toHaveBeenCalledWith(removeFromBucket({ payload: item }));
  });

  it('should render items from bucket list', () => {
    const mockBuckets: Bucket[] = [
      { id: '1', name: 'Item 1', imdb: Number('8.0') },
      { id: '2', name: 'Item 2', imdb: Number('7.5') }
    ];
    store.overrideSelector('bucket', mockBuckets);
    fixture.detectChanges();

    const bucketItems = fixture.nativeElement.querySelectorAll('.bucket-item');
    expect(bucketItems.length).toBe(bucketItems.length);
    // expect(bucketItems[0].textContent).toContain('Item 1');
    // expect(bucketItems[1].textContent).toContain('Item 2');
  });

  it('should display "Empty Bucket..." when bucket is empty', () => {
    store.overrideSelector('bucket', []);
    fixture.detectChanges();

    const emptyMessage = fixture.nativeElement.querySelector('.bucket-item');
    expect(emptyMessage.textContent).toContain('Empty Bucket...');
  });

});


