'use strict';

const logger = require('../lib/logger');
const Dinosaur = require('../model/dinosaur');
const storage = require('../lib/storage');

module.exports = function routeDinosaur(router) {
  router.post('/api/v1/dinosaur', (req, res) => {
    logger.log(logger.INFO, 'DINOSAUR-ROUTE: POST /api/v1/dinosaur');
    try {
      const newDinosaur = new Dinosaur(req.body.title, req.body.content);
      storage.create('Dinosaur', newDinosaur)
        .then((dinosaur) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(dinosaur));
          res.end();
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `DINOSAUR-ROUTE: There was a bad request ${err}`);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Bad request');
      res.end();
      return undefined;
    }
    return undefined;
  });
  router.get('/api/v1/dinosaur', (req, res) => {
    if (req.url.query.id) {
      storage.fetchOne('Dinosaur', req.url.query.id)
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
      storage.fetchAll('Dinosaur')
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
  router.delete('/api/v1/dinosaur', (req, res) => {
    storage.delete('Dinosaur', req.url.query.id)
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
