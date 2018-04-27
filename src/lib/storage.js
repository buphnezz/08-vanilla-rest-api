'use strict';

const logger = require('./logger');

const storage = module.exports = {};
const memory = {};

// memory['Notes']['1234.567.89']['title']
// memory = {
//    'Notes': {
//      '1234.567.89': {
//        'id': 'same id as key'
//        'title': 'some title',
//        'content': 'some content',
//      }
//    }
//  }

// schema is the type of resource, in this case NOTE, and it will just be a 'string' 
// saying this is a note schema item is an actual object we'll pass in to post a newly created note
storage.create = function create(schema, item) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('Cannot create a new item, schema required'));
    if (!item) return reject(new Error('Cannot create a new item, item required'));

    if (!memory[schema]) memory[schema] = {};
    memory[schema][item.id] = item;
    logger.log(logger.INFO, 'STORAGE: Created a new resource');
    return resolve(item);
  });
};

storage.fetchOne = function fetchOne(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    const item = memory[schema][id];

    if (!item) {
      return reject(new Error('item not found'));
    }
    return resolve(item);
  });
};

storage.fetchAll = function fetchAll(schema) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!memory[schema]) return reject(new Error('schema not found'));

    const allIds = Object.keys(memory[schema]);
    const notes = allIds.map(ids => memory[schema][ids]);
    
    if (!notes) {
      return reject(new Error('object not found'));
    }
    return resolve(notes);
  });
};

storage.delete = function del(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    if (!memory[schema]) return reject(new Error('schema not found'));

    const item = memory[schema][id];
    delete memory[schema][id];

    return resolve(item);
  });
};
