
const mongoose=require("mongoose")

//post schema

let postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    
    date:{
        type:Date,
        default:Date.now
    },
    content:String,
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }]
})
       
// Compile model from schema
let posts = mongoose.model('posts', postSchema );

module.exports=posts;