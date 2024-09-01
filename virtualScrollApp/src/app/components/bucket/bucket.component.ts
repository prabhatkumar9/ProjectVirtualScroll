import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bucket } from '../../../models/bucket.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { removeFromBucket } from '../../store/actions/bucket.action';


@Component({
  selector: 'app-bucket',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './bucket.component.html',
  styleUrl: './bucket.component.css'
})
export class BucketComponent {
  private store: Store<{ bucket: Bucket[] }> = inject(Store);

  myBucket$?: Observable<Bucket[]> = this.store.select("bucket");


  decrement(item: Bucket) {
    this.store.dispatch(removeFromBucket({ payload: item }));
  }

}
