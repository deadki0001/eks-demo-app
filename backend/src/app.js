const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const paymentsRouter     = require('./routes/payments')
const healthRouter        = require('./routes/health')
const marketRouter        = require('./routes/market')
const beneficiariesRouter = require('./routes/beneficiaries')
const vouchersRouter      = require('./routes/vouchers')

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.use('/health',          healthRouter)
app.use('/api/payments',    paymentsRouter)
app.use('/api/market',      marketRouter)
app.use('/api/beneficiaries', beneficiariesRouter)
app.use('/api/vouchers',    vouchersRouter)

module.exports = app
