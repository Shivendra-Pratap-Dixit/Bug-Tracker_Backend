const mongoose=require("mongoose");

const Joi = require("joi");
const passwordcomplexity=require("joi-password-complexity")
require("dotenv").config()
const userSchema=new mongoose.Schema({
    name:{type:String,maxlength:50},
    avatar:{type:String},
email:{type:String,unique:true},
password:{type:String},
googleId:String,
displayName:String,
image:String,
created_at: { type: Date, default: Date.now },

},{
    versionKey:false,
    timestamps:true
})




// const userdb = new mongoose.model("users",userSchema);
// const userGoogle=new mongoose.model("users",userGoogleSchema)
// module.exports = userdb;
const validate=(user)=>{
    const schema=Joi.object({
        name:Joi.string().min(5).max(10).required(),
        avatar:Joi.string().required(),
        email:Joi.string().email().required(),
        password:passwordcomplexity().required(),
    })
    return schema.validate(user)
}
const userModel=mongoose.model("User",userSchema)
module.exports={
    userModel,validate
}