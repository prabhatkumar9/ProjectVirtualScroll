import { createActionGroup, props } from "@ngrx/store";
import { Api_Payload } from "../../../models/api_payload.model";
import { Api_Response } from "../../../models/api_response.model";


export const movieActions = createActionGroup({
    source: "Movies API",
    events: {
        "Load Movies": props<{ payload: Partial<Api_Payload> }>(),
        "Load Movies Success": props<{ payload: Partial<Api_Response> }>(),
        "Load Movies Failure": props<{ payload: Partial<Api_Response> }>(),
    }
});


