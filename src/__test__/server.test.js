'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

const testPort = 5000;
const mockResource = { title: 'test title', content: 'test content' };
let mockId = null;

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('POST /api/v1/note', () => {
    it('should respond with status 201 and created a new note', () => {
      return superagent.post(`:${testPort}/api/v1/note`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(201);
        });
    });
  });

  describe('GET /api/v1/note', () => {
    it('should respond with the previously created note', () => {
      return superagent.get(`:${testPort}/api/v1/note?id=${mockId}`)
        .then((res) => {
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(200);
        });
    });
  });
});

describe('INVALID request to the API', () => {
  describe('GET /api/v1/note', () => {
    it('it should respond with bad request if no request body was provided or the body was invalid', () => {
      return superagent.get(':5000/cowsayPage')

        .then(() => { })
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
    it(' should respond with not found for valid requests made with an id that was not found', () => {
      return superagent.get(`:${testPort}/api/v1/note?id=77`)
        .query({})
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
    it('should respond with bad request if no id was provided in the request', () => {
      return superagent.get(`:${testPort}/api/v1/note?id=`)
        .query({})
        .then(() => { })
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
  describe('POST /api/v1/note', () => {
    it('should err out with 400 when no body exists', () => {
      return superagent.get(`:${testPort}/api/v1/note?id=${mockId}`)
        .query({})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});
