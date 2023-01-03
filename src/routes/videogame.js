require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const { Videogame, Genre } = require('../db.js');
const { Router } = require("express");



const router = Router();

router.get('/:idVideogame', async (req, res) => {
    const { idVideogame } = req.params;    
    try { //primero busco en api (numero) y luego en BD (UUID). 
        if(!isNaN(idVideogame)) {
            const videogamesApi = await axios.get(`https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`).then((response) => {
                return {
                    'id': response.data.id,
                    'name': response.data.name,
                    'description': response.data.description_raw,
                    'released': response.data.released,
                    'rating': response.data.rating,
                    'platforms': response.data.platforms.map((platform) => platform.platform.name),
                    'genres': response.data.genres.map((genre) => {
                        return {
                            'id': genre.id,
                            'name': genre.name
                        };
                    }),
                    'image': response.data.background_image
                };
            });
            return res.json(videogamesApi);
        } else {
            const videogameDB = await Videogame.findByPk(idVideogame, { 
            include: { 
                model: Genre,
                attributes:["id","name"],
                through: {attributes: [],
                }}});
            return res.json(videogameDB);
        }
    } catch(error) {
        return res.status(404).send(error);
    }
});



module.exports = router;