const axios = require('axios');
require('dotenv').config();
const { API_KEY } = process.env;
const {Genre} = require('../db.js');

const getGenres = async () => {
    try {
       const genres = await Genre.findAll(); 
       if(!genres.length) {
        const genresData = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
        await Genre.bulkCreate(genresData.data.results);
       }
    } catch (error) {
        console.log(error);
    }
  };


  module.exports = getGenres;

  