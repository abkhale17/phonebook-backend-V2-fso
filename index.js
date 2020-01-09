const express = require('express')
const app = express()

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


let persons = 
[
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]  


// ---ROUTES---
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person){
    res.json(person)
  } else {
    res.status(404).end()
  }
  
})

app.get('/info', (req, res) => {
      res.send(
          `Phonebook has info for ${persons.length} people
          <br/><br/>
          ${new Date()}`)
})

app.post('/api/persons', (req, res) => {
  const generate_id = Math.floor(Math.random()*10000)
  const body = req.body
  if(!body.number && !body.name){
    return res.status(400).json({error:"name or number is missing"})
  }

  const dup_person=persons.find(person=>person.name === body.name)
  if(dup_person){
    return res.status(400).json({error:'name must be unique!'})
  }

  const person = {
    name:body.name,
    number : body.number,
    id : generate_id,
  }
  
  persons = persons.concat(person)

  res.json(person)
})


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})