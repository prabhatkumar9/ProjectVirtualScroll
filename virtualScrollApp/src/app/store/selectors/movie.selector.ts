import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Api_Response } from "../../../models/api_response.model";

export const selectMovies = createFeatureSelector<Partial<Api_Response>>("movies");

export const selectMoviesByType = (type: string) => createSelector(
  selectMovies,
  (state) => {
    // console.log("selector working >> ", type);
    return state?.data?.filter(item => item.genres.includes(type));
  }
);



/** selectors are used for transform data before subscribe in a component ,
 *  but its not changing actual data state */