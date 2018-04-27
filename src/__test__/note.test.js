'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

let note1;

describe('Note routes', () => {
  beforeAll(() => server.start(4444));
  afterAll(() => server.stop());

  describe('POST', () => {
    it('should respond with success status 201', () => { // eslint-disable-line
      return superagent.post(':4444/api/v1/note')
        .send({ title: 'note1', content: 'note1 body' })
        .then((res) => {
          note1 = res.body;
          expect(res.status).toBe(201);
          expect(res.body.title).toBe('note1');
        });
    });
  });
  describe('GET', () => {
      it('should respond with success status 200', () => { // eslint-disable-line
      return superagent.get(`:4444/api/v1/note?id=${note1.id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.title).toBe('note1');
        });
    });
  });
  describe('fetchAll', () => {
      it('should respond with success status 200', () => { // eslint-disable-line
      return superagent.get(':4444/api/v1/note')
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body[0].title).toBe('note1');
        });
    });
  });
});
