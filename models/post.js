
const mongoose=require("mongoose")

//post schema

let postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    
    date:{
        type:Date,
        default:Date.now
    },
    content:String,
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})
       
// Compile model from schema
let posts = mongoose.model('Post', postSchema );

module.exports=posts;