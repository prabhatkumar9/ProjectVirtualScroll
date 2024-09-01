const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const cors = require('cors');
const { getGenresAndRated, fetchMovies } = require("./controllers/movie.controller");
const { connectDatabase } = require("./utils/database");

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));

router.get('', (req, res) => {
    return res.json({ success: true, message: "Go get some docs" });
})

router.get('/api/check', (req, res) => {
    return res.json({ success: true, message: "hey its working." });
})

router.get('/api/movie', fetchMovies);
router.get('/api/genres', getGenresAndRated);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.listen(3000, async () => {
    await connectDatabase();
    console.log('Server is running at port 3000');
});     