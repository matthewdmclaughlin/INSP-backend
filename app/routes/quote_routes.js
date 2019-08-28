
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for examples
const Quote = require('../models/quote')

const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
router.get('/quotes', (req, res, next) => {
  Quote.find()
    .then(quote => {
      return quotes.map(quote => quote.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(quotes => res.status(200).json({ quotes: quotes }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/quotes/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Quote.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(quote => res.status(200).json({ quote: quote.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /examples
router.post('/quotes', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.quote.owner = req.user.id

  Quote.create(req.body.quote)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(quote => {
      res.status(201).json({ quote: quote.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/quotes/:id', requireToken, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.quote.owner

  Quote.findById(req.params.id)
    .then(handle404)
    .then(quote => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, quote)

      // pass the result of Mongoose's `.update` to the next `.then`
      return quote.updateOne(req.body.quote)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/quotes/:id', requireToken, (req, res, next) => {
  Quote.findById(req.params.id)
    .then(handle404)
    .then(quote => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, quote)
      // delete the example ONLY IF the above didn't throw
      quote.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
