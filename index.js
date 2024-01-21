// REVERT PACKAGE.JSON TYPE TO COMMON.JS
import dotenv from 'dotenv';
import express from 'express';
// import {MongoClient, ObjectId} from 'mongodb'
import router from './users.js';
import http from 'http';
dotenv.config();
// const express = require('express');

const app = express();

app.use(express.json());
app.use('/api/users', router);
app.use((err, req, res, next) => res.status(500).send(err.message));
const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});

export default app;
