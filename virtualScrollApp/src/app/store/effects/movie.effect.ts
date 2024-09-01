/*** effects is used for making reducers and actions calls asynchronous */

import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MovieService } from "../../movie.service";
import { movieActions } from "../actions/movie.action";
import { catchError, map, of, switchMap } from "rxjs";
import { Api_Response } from "../../../models/api_response.model";


@Injectable()
export class MovieEffects {
    private action$ = inject(Actions);
    private movieService = inject(MovieService);

    loadMovies$ = createEffect(() => this.action$.pipe(

        /** groceryActions.loadGroceries for accessing type only , not need to use () parenthesis */
       /** listen for action called */ ofType(movieActions.loadMovies),

        /** switchMap operator for accessing api service call */
        switchMap(({ payload }) => this.movieService.fetchAllMovies(payload).pipe(

            /** flated data from api call, call new action for setting state */
            map((response: Partial<Api_Response>) => (movieActions.loadMoviesSuccess({ payload: response }))),

            /***  catch api error */
            catchError(() => of(movieActions.loadMoviesFailure({ payload: { message: "Fail to load", success: false } })))
        ))
    ))
}