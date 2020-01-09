
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
// var uniqueValidator = require('mongoose-unique-validator');
const url = "mongodb+srv://fso1920:abhishek@cluster0-rrvky.mongodb.net/phoneApp?retryWrites=true&w=majority"
console.log('connecting to,',url)

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(res => {
            console.log('connected to mongoDB')
        })
        .catch(err=>{
            console.log('err connecting to mongoDB', err.message)
        })


// const personSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         minlength:3,
//         required:true,
//         unique:true
//     },
//     number:{
//         type:String,
//         minlength:8,
//         required:true
//     },
// })

// personSchema.plugin(uniqueValidator);

const personSchema = new mongoose.Schema({
    name:String,
    number:String
})

personSchema.set('toJSON', {
    transform : (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person',personSchema)

