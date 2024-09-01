import { createReducer, on } from "@ngrx/store";
import { movieActions } from "../actions/movie.action";
import { Api_Response } from "../../../models/api_response.model";

const initialState: Partial<Api_Response> = {
    page_number: 1,
    page_size: 20,
    data: [],
    success: false,
    message: ""
}

export const movieReducer = createReducer(initialState,

    /*** on method listen for actions  */
    on(movieActions.loadMovies, (state, action) => state),

    on(movieActions.loadMoviesSuccess, (state, action) => {
        let { data, page_number, genre } = state;
        let { payload } = action;
        let appendedData: any = [];

        if (data) {
            appendedData = [...data];
        }
        if (payload && payload.data) {
            appendedData = [...appendedData, ...payload.data]
        }

        // console.log("___________________________________");
        // console.log("state genre ", genre);
        // console.log("payload genre ", payload.genre);

        if ((genre && !payload.genre) || (!genre && payload.genre) || (genre != payload.genre)) {
            // console.log("genre true");
            return { ...payload };
        } else {
            let finalPayload = { ...payload, data: appendedData };
            return finalPayload;
        }
    }),

    on(movieActions.loadMoviesFailure, (state, action) => state),
);
