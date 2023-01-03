const { Videogame, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Videogame model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Videogame.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Videogame.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        Videogame.create({ name: 'Super Mario Bros' });
      });
    });
  });

  describe('description should', () => {
    let incorrectlyDescribedGame = {
        name: "my great game",
        description: "",
        launchDate: "1987-4-5",
        rating: 4.2,
        platforms: ["PlayStation 4", "Xbox", "PC"]
    }
    let correctlyDescribedGame = {
        name: "another greate name",
        description: "",
        launchDate: "2011-8-17",
        rating: 4.2,
        platforms: ["PlayStation 4", "Xbox", "PC"]
    }
    describe('throw an error when it is', () => {
        it('null', (done) => {
            incorrectlyDescribedGame.description = null;
            Videogame.create(incorrectlyDescribedGame)
                .then(() => done(new Error('It requires a valid description')))
                .catch(() => done());
        });
        it('undefined', (done) => {
            incorrectlyDescribedGame.description = undefined;
            Videogame.create(incorrectlyDescribedGame)
                .then(() => done(new Error('It requires a valid description')))
                .catch(() => done());
        });
        it('a number', (done) => {
            incorrectlyDescribedGame.description = 17;
            Videogame.create(incorrectlyDescribedGame)
                .then(() => done(new Error('It requires a valid description')))
                .catch(() => done());
        });
        it('a boolean', (done) => {
            incorrectlyDescribedGame.description = false;
            Videogame.create(incorrectlyDescribedGame)
                .then(() => done(new Error('It requires a valid description')))
                .catch(() => done());
        });
    });
   
});
describe('launch date should', () => {
    let anyLaunchDateGame = {
        name: "another greate game",
        description: "the best",
        rating: 3.6,
        platforms: ["PlayStation 4", "PC"]
    };
    
    
    describe('should throw an error when launchDate is', () => {
        it('undefined', (done) => {
            anyLaunchDateGame.launchDate = undefined;
            Videogame.create(anyLaunchDateGame)
                .then(() => done(new Error('It should reject an undefined launch date')))
                .catch(() => done());
        });
        it('an invalid year', (done) => {
            anyLaunchDateGame.launchDate = "1920-02-12";
            Videogame.create(anyLaunchDateGame)
                .then(() => done(new Error('It should reject an invalid year')))
                .catch(() => done());
        });
        it('an invalid month < 1', (done) => {
            anyLaunchDateGame.launchDate = "1975-0-14";
            Videogame.create(anyLaunchDateGame)
                .then(() => done(new Error('It should reject an invalid month')))
                .catch(() => done());
        });
        it('an invalid month > 12', (done) => {
            anyLaunchDateGame.launchDate = "2012-20-21";
            Videogame.create(anyLaunchDateGame)
                .then(() => done(new Error('It should reject an invalid month')))
                .catch(() => done());
        });
        it('an invalid day (Feb. 29)', (done) => {
            anyLaunchDateGame.launchDate = "1999-2-29";
            Videogame.create(anyLaunchDateGame)
                .then(() => done(new Error('It should reject an invalid day')))
                .catch(() => done());
        });
        it('an invalid day (Apr. 31)', (done) => {
            anyLaunchDateGame.launchDate = "1999-4-31";
            Videogame.create(anyLaunchDateGame)
                .then(() => done(new Error('It should reject an invalid day')))
                .catch(() => done());
        });
    })
});
describe('rating should', () => {
    let ratedGame = {
        name: "I rated this game",
        description: "it could be better",
        launchDate: null,
        platforms: ["PlayStation 4", "PC", "Xbox"]
    };
    
    describe('throw an error when it is', () => {
        it('< 0 (-0.1)', (done) => {
            ratedGame.rating = -0.1;
            Videogame.create(ratedGame)
                .then(() => done(new Error('It should reject a negative rating')))
                .catch(() => done());
        });
        it('< 0 (-78914)', (done) => {
            ratedGame.rating = -78914;
            Videogame.create(ratedGame)
                .then(() => done(new Error('It should reject a negative rating')))
                .catch(() => done());
        });
        it('> 5 (5.1)', (done) => {
            ratedGame.rating = 5.1;
            Videogame.create(ratedGame)
                .then(() => done(new Error('It should reject a > 5 rating')))
                .catch(() => done());
        });
        it('> 5 (48903)', (done) => {
            ratedGame.rating = 48903;
            Videogame.create(ratedGame)
                .then(() => done(new Error('It should reject a > 5 rating')))
                .catch(() => done());
        });
    });
});
describe('platforms should', () => {
   
    describe('reject', () => {
        let invalidPlatformsGame = {
            name: "I wanna play this game",
            description: "where can I play it",
            launchDate: "2008-03-25"
        };
        it('an empty array', (done) => {
            invalidPlatformsGame.platforms = [];
            Videogame.create(invalidPlatformsGame)
                .then(() => done(new Error('It should reject an empty array')))
                .catch(() => done());
        });
        describe('an array of', () => {
            it('one invalid element', (done) => {
                invalidPlatformsGame.platforms = ["error me"];
                Videogame.create(invalidPlatformsGame)
                    .then(() => done(new Error('It should reject an invalid array')))
                    .catch(() => done());
            });
            it('one or more invalid elements', (done) => {
                invalidPlatformsGame.platforms = ["error me", "PC"];
                Videogame.create(invalidPlatformsGame)
                    .then(() => done(new Error('It should reject an invalid array')))
                    .catch(() => done());
            });
            it('one or more invalid elements (reversed)', (done) => {
                invalidPlatformsGame.platforms = ["PC", "nope"];
                Videogame.create(invalidPlatformsGame)
                    .then(() => done(new Error('It should reject an invalid array')))
                    .catch(() => done());
            });
            it('two or more invalid elements', (done) => {
                invalidPlatformsGame.platforms = ["macOS", "custom device", "PC"];
                Videogame.create(invalidPlatformsGame)
                    .then(() => done(new Error('It should reject an invalid array')))
                    .catch(() => done());
            });
        });
    });
});

});
