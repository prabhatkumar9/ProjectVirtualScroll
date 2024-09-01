

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MoviesSchema = new Schema({
    "_id": { type: ObjectId },
    "plot": { type: String },
    "genres": { type: Array, index: true },
    "runtime": { type: Number },
    "cast": { type: Array },
    "num_mflix_comments": { type: Number },
    "title": { type: String, index: true },
    "fullplot": { type: String },
    "languages": { type: Array },
    "released": { type: Date },
    "directors": { type: Array },
    "rated": { type: String, index: true },
    "awards": { type: Object },
    "lastupdated": { type: Date },
    "year": { type: Number, index: true },
    "imdb": {
        type: {
            "rating": { type: String, index: true },
            "votes": { type: Number },
            "id": { type: Number },
        }
    },

    "countries": { type: Array },
    "type": { type: String, index: true },

}, { timestamps: true });

const Movies = mongoose.model('movies', MoviesSchema);

module.exports = { Movies };