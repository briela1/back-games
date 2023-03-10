const { Genre, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Genre model', () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
    describe('Validators', () => {
        beforeEach(() => Genre.sync({ force: true }));
      
        describe('id should', () => {
            describe('reject', () => {
                it('a null value', (done) => {
                    Genre.create({ id: null, name: "genreee" })
                        .then(() => done(new Error('It should reject a null id')))
                        .catch(() => done());
                });
                it('an undefined value', (done) => {
                    Genre.create({ id: undefined, name: "genree" })
                        .then(() => done(new Error('It should reject an undefined id')))
                        .catch(() => done());
                });
            });
        });
    });
});