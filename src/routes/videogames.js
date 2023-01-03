require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const { Videogame, Genre, Op } = require('../db.js');
const { Router } = require("express");
const createVideogame = require("../controllers/createVideogame");

const router = Router();

router.post('/', async (req, res) => {
        try {
        const {name, description, released, rating, platforms, image, genres} = req.body;
        if(!name || !description || !platforms) {
            res.status(400).json({msg: 'Some essential information is missing'});
        }
        const createdGame = await createVideogame(name, description, released, rating, platforms, image, genres);
        return res.status(201).json({create:"ok", user:createdGame});
    } catch(error) {
        return res.status(400).send(error.message);
    }
   
});


router.get('/', async (req, res) => {
    const { name } = req.query;
    try {
        const videogamesDB = []
        if(name) await Videogame.findAll({ where: { name: { [Op.like]: `%${name}%` } }, include: { 
            model: Genre,
            attributes:["id","name"],
            through: {attributes: [],
            }}}).then(response => {
            for(const game of response) {
                if(name && videogamesDB.length === 15) break;
                videogamesDB.push(game);
            }
        });
        else await Videogame.findAll({ include: { 
            model: Genre,
            attributes:["id","name"],
            through: {attributes: [],
            }}}).then(response => {
            response.forEach(game => {
                videogamesDB.push(game);
            });
        });


        const videogamesApi = []
        const promisesApi = [];
        if(name) promisesApi.push(axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`));
        else {
            for (let i = 1; i <= 5; i++) {
                promisesApi.push(axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`));
            }
        }
        await Promise.all(promisesApi).then((pages) => {
            pages.forEach(page => {
                for(const game of page.data.results) {
                    if(name && videogamesApi.length + videogamesDB.length === 15) break;
                    videogamesApi.push({
                        'id': game.id,
                        'name': game.name,
                        'released': game.released,
                        'rating': game.rating,
                        'platforms': game.platforms.map((platform) => platform.platform.name),
                        'genres': game.genres.map((genre) => {
                            return { 
                                'id': genre.id,
                                'name': genre.name
                            };
                        }),
                        'image': game.background_image
                    });
                }
            });
        });
        return res.status(200).json([...videogamesApi, ...videogamesDB]);
    } catch(error) {
        return res.status(404).send(error);
    }
});



module.exports = router;