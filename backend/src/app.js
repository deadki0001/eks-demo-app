const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const paymentsRouter = require('./routes/payments');
const healthRouter = require('./routes/health');
const marketRouter = require('./routes/market');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/market', marketRouter);
app.use('/api/payments', paymentsRouter);

module.exports = app;
