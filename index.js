const express=require("express");
const cors=require("cors");
require("dotenv").config()
const { cont } = require("./connection");
const userRoute = require("./Routes/user");
// const productRoute = require("./Routes/product");
const session = require("express-session");
const passport = require("passport");
const { userModel } = require("./Model/user.model");
const router = require("./Routes/bugs");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const app=express();

const PORT=process.env.PORT ||8080;



const clientid = "351492689096-ljc1g40jumcio0di6n5a4pl0pd4mt4ot.apps.googleusercontent.com"
const clientsecret = "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"

app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));
app.use(express.json())
app.use(session({
    secret:"1234slide",
    resave:false,
    saveUninitialized:true
}))


app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        
        try {
            let user = await userModel.findOne({googleId:profile.id});

            if(!user){
                user = new userModel({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
});

app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/chat",
    failureRedirect:"http://localhost:3000/auth"
}))

app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3000");
    })
})

app.use("/api",userRoute);
app.use("/api",router)
// app.use("/api",productRoute)
app.get("/",(req,res)=>{
    res.status(200).send({message:"Welcome to Backend by Shivendra for api/register and api/login {for Products => api/products(for post product) products/(for get product) api/products/:id(for single product) api/products/:id (for edit patch) api/products/:id(for delete the product) "})
})
app.listen(PORT,async()=>{
    try {
        await cont
        console.log(`Server is running at ${PORT} and Connected to MongoDB`)
        
    } catch (error) {
        console.error(`${error}`)
    }
    
})