const express = require('express')
const usermodel=require("./models/user")
const postmodel=require("./models/post")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt") 
const path=require("path") 
const cookieParser=require("cookie-parser") 
const app = express()

//middlewares

app.set("view engine","ejs")
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(express.json());

//protected route : for example that if someone tries to visit the profile page without login then it will not show profile and ask to login 

function islogged(req,res,next){
  let token = req.cookies.token; // Ensure we are accessing the cookies correctly
  if (!token) { // Check if the token is undefined or null
      return res.status(401).send("You must be logged in !!"); // Send a 401 Unauthorized status
  }
  
  try {
      req.user = jwt.verify(token, "secrete"); // Verify the token
    //   console.log(req.user);
      // putting the details of user in the params so that i can access it at required page to show the particular details
      next();
  } catch (err) {
      return res.send("Invalid token",err); // Handle invalid token error
  }

}

app.get('/profile',islogged, async(req, res) => {
    let user=await usermodel.findOne({email:req.user.email}).populate("posts");


    res.render("profile",{user});

})

app.get('/like/:id',islogged, async(req, res) => {
    let post=await postmodel.findOne({_id:req.params.id}).populate("user");

    // console.log(req.user);
    let real_user=await usermodel.findOne({email:req.user.email});
    console.log(real_user);
    if(post.likes.indexOf(real_user._id)===-1)
        post.likes.push(real_user._id);
    
    else 
        post.likes.splice(post.likes.indexOf(real_user._id),1);
    
    await post.save();

    res.redirect("/profile");

})

app.get('/edit/:id',islogged, async(req, res) => {
    let post=await postmodel.findOne({_id:req.params.id});

    

    res.render("edit",{post});

})

app.post("/update/:id",async(req,res)=>{
    let post=await postmodel.findOneAndUpdate({_id:req.params.id},{content:req.body.content});
    res.redirect("/profile");
})

//posts route
app.post('/posts',islogged, async(req, res) => {
    let user=await usermodel.findOne({email:req.user.email});

    let {content}=req.body;
    // console.log(content);

    let post=await postmodel.create({
        user:user._id,
        content
    })

    user.posts.push(post._id);
    await user.save();


    res.redirect("profile");

})

app.get('/', (req, res) => {
  
  res.render('index')

})

app.post("/create",async(req,res)=>{
    let {username,email,password,age}=req.body;
    let checkuser= await usermodel.findOne({email})
   
    if(checkuser) res.send("user already exits ")
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{

            let newuser=await usermodel.create({
                username,
                email,
                password:hash,
                age
            })
            console.log(newuser.username);
            
            let token=jwt.sign({email:req.body.email},"secrete");
            res.cookie("token",token);
            
            res.redirect("profile");

            
        })
    })
})

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");

})

app.get("/login",(req,res)=>{
    res.render("login");

})

app.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let emailuser= await usermodel.findOne({email});
    if(emailuser===null) res.send("EMAIL WORNG  !!");
    
    bcrypt.compare(password,emailuser.password,(err,result)=>{
        if(result===true){
            let token=jwt.sign({email},"secrete");
            res.cookie("token",token);
            res.redirect("profile");
        }
        else {
            res.send(" password is wrong ");
        }
    })

})




const port = process.env.PORT || 5001

app.listen(port, () => {
  console.log(`listening on port `,port)
})