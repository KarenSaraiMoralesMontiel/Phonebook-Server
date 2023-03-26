const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

morgan.token('body', function setToken(req, res){
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) 

let persons = [
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


app.get('/info', (request, response) => {
    let size = persons.length
    let todayDate = new Date()
    let message = `<p>Phonebook has info for ${size} people</p>` +
    `<p>${todayDate}</p>`
    response.send(message)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log(id)
    const person = persons.find(x=> x.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).send("Page Not Found")
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    let size = persons.length

    //console.log(id)
    persons = persons.filter(x=> x.id !== id)
    if (size > persons.length) {
        response.status(204).send("Deleted")
    }
    else {
        response.status(404).send("Page Not Found")
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const repeated = persons.some((element) => element.name.toLocaleUpperCase() === body.name.toLocaleUpperCase()) 
    if (body.number==='' || body.name==='') {
        return response.status(400).json(
            {
                error: "missing data"
            }
        )

    }
    else if (repeated) {
        return response.json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000) 
    }
    
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
