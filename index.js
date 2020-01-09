require('dotenv').config()
const express = require('express')
const app = express()

const Person = require('./models/person') 

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const morgan = require('morgan')
morgan.token('person', function (req, res) {
    const result = Object.keys(req.body).length > 0
        ? JSON.stringify(req.body)
        : ''
    return result
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

// ---ROUTES---

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
      res.json(persons)
  })
})

//---GET persons by ID---

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
      .then((result) => {
          if (result) {
              res.json(result.toJSON())
          }
          else {
              res.status(404).end()
          }
      })
      .catch((err) => next(err))
})


app.get('/info', (request, response) => {
  Person.countDocuments({}, function (err, count) {
      response.send(
          `Phonebook has info for ${count} people
          <br/><br/>
          ${new Date()}`
      )
  })
})



//---DELETE person by ID---//

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
      .then(result => {
         res.status(204).end()
      })
      .catch((err) => next(err))
})

//---UPDATE person to Phone-book-----//

app.put('/api/persons/:id',(req,res,next)=>{
  const body = req.body
  const person_updated = {
      name: body.name,
      number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person_updated, { new: true,runValidators: true, context: 'query' })
      .then(updatedPerson => {
          res.json(updatedPerson.toJSON())
      })
      .catch(err => next(err))           
})

//---ADD person to Phone-book-----//
app.post('/api/persons', (request, response ,next) => {
  const body = request.body
  if (!body.number && !body.name) {
      return response.status(400).json({ error:"name or number is missing"})
  }

  const person_to_save = new Person({
      name: body.name,
      number: body.number,
  })

  person_to_save.save()
  .then(savePerson => response.json(savePerson.toJSON()))
      .catch((err) => next(err))
})

// ---unknown Endpoint---

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}


app.use(unknownEndpoint)
// ---errorHandle middleware---

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})