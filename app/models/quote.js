const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

const Quote = mongoose.model('Quote', quoteSchema)

module.exports = Quote
