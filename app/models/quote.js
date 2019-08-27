const mongoose = require('mongoose')

const exampleSchema = new mongoose.Schema({
  Quote: {
    type: String,
    required: true
  },
  quote_id: {
  type: int,
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

module.exports = mongoose.model('Quote', exampleSchema)
