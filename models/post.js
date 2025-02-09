
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
        ref:'user'// THE NAME OF THIS SHOULD BE SAME AS COLLECTION OF THIS REFERRING TO IN MODEL ("")
    }]
})
       
// Compile model from schema
let posts = mongoose.model('post', postSchema );

module.exports=posts;