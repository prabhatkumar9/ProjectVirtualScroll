export interface Movie {
    "_id": string,
    "plot": string,
    "genres": Array<any>,
    "runtime": number,
    "cast": Array<any>,
    "num_mflix_comments": number,
    "title": string,
    "fullplot": string,
    "languages": Array<any>,
    "released": string,
    "directors": Array<any>,
    "rated": string
    "awards": object
    "lastupdated": string
    "year": number,
    "imdb": {
        rating: number,
        id: string,
        votes: string,
        _id: string,
    },
    "countries": Array<any>,
    "type": string,
}

