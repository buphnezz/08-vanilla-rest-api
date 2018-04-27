'use strict';

const logger = require('../lib/logger');
const Note = require('../model/note');
const storage = require('../lib/storage');

module.exports = function routeNote(router) {
  router.post('/api/v1/note', (req, res) => {
    logger.log(logger.INFO, 'NOTE-ROUTE: POST /api/v1/note');
    try {
      const newNote = new Note(req.body.title, req.body.content);
      storage.create('Note', newNote)
        .then((note) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(note));
          res.end();
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `NOTE-ROUTE: There was a bad request ${err}`);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Bad request');
      res.end();
      return undefined;
    }
    return undefined;
  });
  router.get('/api/v1/note', (req, res) => {
    if (req.url.query.id) {
      storage.fetchOne('Note', req.url.query.id)
        .then((item) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(item));
          res.end();
          return undefined;
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('Resource not found');
          res.end();
          return undefined;
        });
    } else {
      storage.fetchAll('Note')
        .then((item) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(item));
          res.end();
          return undefined;
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('Resource not found');
          res.end();
          return undefined;
        });
    }
  });
  router.delete('/api/v1/note', (req, res) => {
    storage.delete('Note', req.url.query.id)
      .then(() => {
        res.writeHead(204, { 'Content-Type': 'text/plain' });
        res.write('No content in the body');
        res.end();
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Resource not found');
        res.end();
        return undefined;
      });
    return undefined;
  });
};
