// require('dotenv').config();
// const express = require('express');
// const pick = require('lodash/pick');
// const { MongoClient, ObjectId } = require('mongodb');
import dotenv from 'dotenv';
import express from 'express';
import pick from 'lodash';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const clientPromise = new MongoClient(process.env.DB_URI);

const app = express();

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db('users');
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await req.db.collection('users').find(req.query).toArray();
    res.json(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await req.db
      .collection('users')
      .find({ _id: new ObjectId(id) })
      .toArray();
    if (user) res.json(user);
    else res.status(404).send('Unknown user');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = pick(req.body, 'name', 'age');
    const { insertedId } = await req.db.collection('users').insertOne(data);
    res
      .header(
        'location',
        `${req.protocol}://${req.hostname}/api/users/${insertedId}`
      )
      .sendStatus(201);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = pick(req.body, 'name', 'age', 'country');
    const { modifiedCount } = await req.db.collection('users').updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      }
    );
    if (modifiedCount === 0) res.status(404).send(`Unknown user id: ${id}`);
    else res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { deletedCount } = await req.db.collection('users').deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedCount === 0) res.status(404).send(`Unknown user id: ${id}`);
    else res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// module.exports = router;

export default router;
