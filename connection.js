const mongoose=require("mongoose");
require("dotenv").config();
const cont=mongoose.connect(process.env.DBURL);
module.exports={
    cont
}