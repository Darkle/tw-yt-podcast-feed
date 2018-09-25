'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));

// import http from 'http'
// import { initDB } from './db.lsc'
// app.set('port', process.env.PORT)
// server = http.createServer(app)
// server.listen(process.env.PORT)

const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`)); // initDB()
// setInterval(getNewTWvideos, tp.ONE_DAY)
// getNewTWvideos()
