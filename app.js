const path = require('path');
const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const indexRouter = require('./routes/index');
const commandsRouter = require('./routes/commands');
const serverRouter = require('./routes/server');

app.use('/', indexRouter);
app.use('/commands', commandsRouter);
app.use('/server', serverRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});

module.exports = app;