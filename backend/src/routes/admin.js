const express = require('express')
const route = express.Router()
const upload = require('../middleware/upload')
const {verifyTokenAdmin, verifyTokenKetoan, verifyToken} = require('../middleware/veritify')

const apartmentRoutes = require('./apartmentRoutes')
const residentRoutes = require('./residentRoutes')
const userRoutes = require('./userRoutes')
const feeRoutes = require('./feeRoutes')
const invoiceRoutes = require('./invoiceRoutes')
const vehicleRoutes = require('./vehicleRoutes')
const feedbackRoutes = require('./feedbackRoutes')

// Use the separated routes
route.use('/apartments', apartmentRoutes)
route.use('/residents', residentRoutes)
route.use('/users', userRoutes)
route.use('/fees', feeRoutes)
route.use('/invoices', invoiceRoutes)
route.use('/vehicles', vehicleRoutes)
route.use('/feedback', feedbackRoutes)

module.exports = route