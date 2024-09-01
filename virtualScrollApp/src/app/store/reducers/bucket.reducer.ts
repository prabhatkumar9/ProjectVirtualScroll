import { createReducer, on } from "@ngrx/store";
import { Bucket } from "../../../models/bucket.model";
import { addToBucket, removeFromBucket } from "../actions/bucket.action";


const initialState: Bucket[] = [];

export const bucketReducer = createReducer(initialState,
    on(addToBucket, (state, action) => {
        const bucketItem = state.find(item => item.id === action.payload.id);

        if (!bucketItem) {
            return [...state, action.payload];
        }

        return [...state];
    }),

    on(removeFromBucket, (state, action) => {
        const bucketItem = state.find(item => item.id === action.payload.id);

        if (bucketItem) {
            return state.filter(item => item.id !== action.payload.id);
        }
        return [...state];
    })

)