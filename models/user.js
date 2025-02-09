
const mongoose=require("mongoose")


mongoose.connect("mongodb://127.0.0.1:27017/mini_project")
.then(()=>{
    console.log("successfull database !!");
    
}).catch(err=>{
    console.log("error in database ::",err);

})

//user scheme

let userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]
},{timestamps:true})
       
// Compile model from schema
let User = mongoose.model('User', userSchema );

module.exports=User;