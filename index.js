require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const Person = require('./models/person')

morgan.token('body', function setToken(req, res){
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) 

app.get('/info', async (request, response) => {
    try {
      let count = await Person.countDocuments({});
      let todayDate = new Date();
      let message = `<p>Phonebook has info for ${count} people</p>` +
        `<p>${todayDate}</p>`;
      response.send(message);
    } catch (error) {
      console.log(error);
      response.status(500).send('Error getting count');
    }
}) 

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const personId = request.params.id
    Person.findById(personId)
        .then(person => {
            if (!person) {
                return response.status(404).json({
                    error: 'Person not found'
                })
            }
            response.json(person)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: 'Server error'
            })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(person => {
        if (!person) {
            return response.status(404).json({
                error: 'Person not found'
            })
        }
        response.status(204).send();
    })
    .catch(error => {
        console.log(error);
        response.status(500).json({
            error: 'Server error'
        })
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.number==='' || body.name==='') {
        return response.status(400).json(
            {
                error: "missing data"
            }
        )
    }
    else if (!body) {
        return response.status(400).json(
            {
                error: "content missing"
            }
        )
    }
    const person = Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    //console.log(id)
    Person.findByIdAndUpdate(id, body, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: 'Server error'
            });
        });
});

const  unknownPath = (request, response) => {
    response.status(404).json({
        error: 'unknown Path'
    })
} 

app.use(unknownPath)
const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running in port ${PORT}`)
})