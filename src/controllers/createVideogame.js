const { Videogame } = require("../db");

const createVideogame = async (name, description, released, rating, platforms, image, genres) => {   
    try {
        const videogamesDB = await Videogame.create({name, description, released, rating, platforms, image});
        await videogamesDB.addGenres(genres);//lo relaciono con el array de ids de generos
        return videogamesDB;
    } catch(error) {
        console.log(error.message);
    }
};

module.exports = createVideogame;