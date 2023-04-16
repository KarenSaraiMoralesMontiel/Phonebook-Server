const mongoose = require('mongoose')

//const url = 'mongodb+srv://fullstack:Abc123@karendatabase.5dvtrdg.mongodb.net/app-phonebook?retryWrites=true&w=majority'

const url = process.argv[2]
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDb')
    })
    
mongoose.connection.on('error', error => {
        console.error('Error connecting to MongoDB:', error.message)
      })
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON',  { 
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v, returnedObject.__id
    }
})
module.exports = mongoose.model('Person', personSchema)
    