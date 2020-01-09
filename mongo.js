const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
    }

const password = process.argv[2]

const url =
  `mongodb+srv://fso1920:${password}@cluster0-rrvky.mongodb.net/phoneApp?retryWrites=true&w=majority`

console.log('connecting to,',url)
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(res => {
      console.log('connected to mongoDB')
  })
  .catch(err=>{
      console.log('err connecting to mongoDB', err.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id:Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5 ){

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(response => {
        console.log('note saved!')
        mongoose.connection.close()
      })


}

else if (process.argv.length == 3 ){
    console.log('phonebook:')
    Person.find({})
    .then(persons=>{
        persons.forEach(person=>{
            console.log(person.name,person.number)
        })
    mongoose.connection.close()   
    })

}

else {
    console.log('provide sufficient arguments')
    mongoose.connection.close()
}