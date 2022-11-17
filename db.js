//communication between dbms and server app
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Ecommerce')

//The Mongoose module's default (single) connection
const conn = mongoose.connection

conn.on('connected', () => {
  console.log('Connected to DB')
})
conn.on('disconnected', () => {
  console.log('Disconnected from DB')
})
conn.on('error', () => {
  console.log('Could not connected to DB')
})
