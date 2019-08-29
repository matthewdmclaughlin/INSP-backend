const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
    unique: true
  }, {
  timestamps: true,
  toObject: {

    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = quoteSchema
