const {Genre} = require("../db.js");
const { Router } = require("express");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const videogamesDB = await Genre.findAll();
        return res.json(videogamesDB);
    } catch(error) {
        return res.status(404).send(error);
    }
});


module.exports = router; 

