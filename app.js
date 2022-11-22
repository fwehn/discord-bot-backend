const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');

const db = require('./database');
db.init().then(console.log).catch(console.error);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const indexRouter = require('./routes/index');
const serverRouter = require('./routes/server');

app.use('/', indexRouter);
app.use('/server', serverRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});

module.exports = app;