const mongoose = require("mongoose")
const {Schema} = mongoose
const userSchema = new Schema({
  name:{
    type:String,
    require:[true, "user name is required"],
    minLength: [5, 'Name must be at least 5 characters'],
    maxLength: [50, 'Name must be less than 50 characters'],
    trim: true,
  },
  email:{
    type:String,
    require:[true, 'user email is required'],
    unique:true,
    lowercase:true,
    unique:[true, 'already registered']
  },
  password:{
    type:String,
    require:true,
    select:false
  },
  bio:{
    type:String,
   require:true
  },
  username:{
    type:String,
    require:[true, "user name is required"],
    minLength: [5, 'Name must be at least 5 characters'],
    maxLength: [50, 'Name must be less than 50 characters'],
  },
  forgotPasswordToken: {
    type: String,
  }
})
const userModel = mongoose.model("user", userSchema)
module.exports = {userModel}