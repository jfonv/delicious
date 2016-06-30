/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const mongoose = require('mongoose');

describe('bookmarks', () => {
  // before((done) => {
  //   mongoose.connection.db.dropCollection('bookmarks', () => {
  //     done();
  //   });
  // });

  describe('bookmarks', () => {
    describe('post/bookmarks', () => {
      it('should create a bookmark', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'a', url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '2016-03-15',
          stars: 3, tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(200);
            expect(rsp.body.bookmark._id).to.not.be.undefined;
            expect(rsp.body.bookmark.__v).to.not.be.null;
            expect(rsp.body.bookmark.url).to.equal('http://google.com');
            done();
          });
      });
      it('should not create a bookmark', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '2016-03-15',
          stars: 3, tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"title" is required']);
            done();
          });
      });
      it('should not create a bookmark because the date is too old', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'old man', url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '1994-03-15',
          stars: 3, tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"datePublished" must be larger than or equal to "Sat Dec 31 1994 18:00:00 GMT-0600 (CST)"']);
            done();
          });
      });
      it('should not create a bookmark because the url is invalid', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'old man', url: 'b', description: 'asdfasdfs',
          isProtected: true, datePublished: '2002-03-15',
          stars: 3, tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"url" must be a valid uri']);
            done();
          });
      });
      it('should not create a bookmark because star number too high', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'old man', url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '2002-03-15',
          stars: 7, tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"stars" must be less than or equal to 5']);
            done();
          });
      });
      it('should not create a bookmark because star number too low', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'old man', url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '2002-03-15',
          stars: -12, tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"stars" must be larger than or equal to 1']);
            done();
          });
      });
      it('should not create a bookmark because star not number', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'old man', url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '2002-03-15',
          stars: '235fasdf', tags: ['d', 'e'] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"stars" must be a number']);
            done();
          });
      });
      it('should not create a bookmark because tags not >= 1', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'old man', url: 'http://google.com', description: 'asdfasdfs',
          isProtected: true, datePublished: '2002-03-15',
          stars: 3, tags: [] })
          .end((err, rsp) => {
            expect(err).to.be.null;
            expect(rsp.status).to.equal(406);
            expect(rsp.body.messages).to.deep.equal(['"tags" must contain at least 1 items']);
            done();
          });
      });
    });
  });
});
