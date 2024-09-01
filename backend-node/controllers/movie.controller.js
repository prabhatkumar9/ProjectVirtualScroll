

// const axios = require('axios');
const { Movies } = require("../utils/models/movies.model");

// const fetchUserList = async (req, res) => {
//     try {
//         let { page_number, page_size } = req.query;

//         let config = {
//             method: 'get',
//             maxBodyLength: Infinity,
//             url: `https://randomuser.me/api?page=${page_number}&results=${page_size}`,
//             headers: {}
//         };

//         let response = await axios.request(config);

//         if (response) {
//             return res.json({
//                 success: true, data: response.data.results, total: 10000,
//                 page_number, page_size, message: response.data.info.seed
//             });
//         }

//         return res.json({ success: false, data: [], message: "something went wrong." });

//     } catch (error) {
//         console.log("fetchUserList catch >> ", error);
//         return res.json({ success: false, message: error.message });
//     }
// }

const fetchMovies = async (req, res) => {
    try {
        let { page_number, page_size, genre } = req.query;

        if (!page_number || isNaN(page_number))
            page_number = 1;
        if (!page_size || isNaN(page_size))
            page_size = 20;

        let query = {};
        if (genre) {
            query['genres'] = { $in: [genre] }
        }

        let total = await Movies.countDocuments({ ...query });

        let movies = await Movies.find({ ...query }).sort({ _id: -1 })
            .skip((Number(page_number) - 1) * Number(page_size))
            .limit(Number(page_size));

        return res.json({
            success: true,
            data: movies,
            total,
            page_number,
            page_size,
            total,
            genre,
            message: "",
        });
    } catch (error) {
        console.log("fetchMovies catch >> ", error);
        return res.json({ success: false, message: error.message });
    }
}

const getGenresAndRated = async (req, res) => {
    try {
        let rated = await Movies.distinct('rated');
        let genres = await Movies.distinct('genres');

        return res.json({
            success: true,
            message: "",
            data: [{ rated, genres }]
        });
    } catch (error) {
        console.log("getGenresAndRated catch >> ", error);
        return res.json({ success: false, message: error.message });
    }
}

module.exports = { fetchMovies, getGenresAndRated };