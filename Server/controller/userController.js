const {userModel} = require('../model/userSchema.js')
// const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailValidator = require("email-validator");
// to user register
const signUp = async(req, res, next)=>{
    const {name, username, email, password,  bio}=req.body;
    if (!name || !email || !password || !username || !bio) {
        return res.status(400).json({
          success: false,
          message: "Every field is required"
        });
      }
      try {
        const userInfo = new userModel(req.body);
        console.log(userInfo);
          // userSchema "pre" middleware functions for "save" will hash the password using bcrypt
    // before saving the data into the database
    return res.status(200).json({
        success: true,
        data: result
      });

      } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
              success: false,
              message: `Account already exist with the provided email ${email} 😒`
            });
          }
          return res.status(400).json({
            message: error.message
          });
        }
 }
//  to log in a user
const logIn = async(req,res, next)=>{
     const {username, password} = req.body
       // send response with error message if email or password is missing
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "username and password are required"
    });
  }
  try {
    const getUserData=await userModel.findOne({username}).select("+password");
    if(getUserData && getUserData.username ){
        const result = await bcrypt.compare(password, getUserData.password)
        if(result){
          const token = await getUserData.jwtToken()
          const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000, //24hr
            
            httpOnly: true //  not able to modify  the cookie in client side
          }
          res.cookie("token", token, cookieOption);
                  res.status(200).json({
                    success: true,
                    data: getUserData
                  })
        }else{
          res.status(404).send({message:"Password is Incorrect, Try Again!"})
        }
    }
    else{  
      res.status(404).send({message:"No Account Found Associated with this username"})
  }

  } catch (error) {
    res.status(501).send({message:error.message})
  }
}
 /*
  * @FORGOTPASSWORD
 * @route /api/auth/forgotpassword
 * @method POST
 * @description get the forgot password token
 * @returns forgotPassword token
 */
const forgotPassword = async(req, res, next)=>{
    const email = req.body.email;
    // return response with error message If email is undefined
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }
  try {
     // retrieve user using given email.
     const user = await userModel.findOne({
        email
      });
        // return response with error message user not found
    if (!user) {
        return res.status(400).json({
          success: false,
          message: "user not found 🙅"
        });
      }
        // Generate the token with userSchema method getForgotPasswordToken().
        const forgotPasswordToken = user.getForgotPasswordToken()
        await user.save();
        return res.status(200).json({
            success: true,
            token: forgotPasswordToken
          });
  } catch (error) {
    return res.status(400).json({
        success: false,
        message: error.message
      });
  }
}
/*
 * @RESETPASSWORD
 * @route /api/auth/resetpassword/:token
 * @method POST
 * @description update password
 * @returns User Object
*/
const resetPassword = async(req, res, next)=>{
    const { token } = req.params;
    const { password } = req.body;
     // return error message if password or confirmPassword is missing
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "password  is required"
    });
  }
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    try {
        const user = await userModel.findOne({
            forgotPasswordToken: hashToken,
            forgotPasswordExpiryDate: {
              $gt: new Date() // forgotPasswordExpiryDate() less the current date
            }
          });
            // return the message if user not found
    if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Token or token is expired"
        });
      }
      user.password = password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "successfully reset the password"
    });
       
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
          });
    }
}
// get user details
const userDetail =async(req, res)=>{
  const {id, username} = req.user
  try {
    const userData = await userModel.findOne({username})
    res.status(200).json({
      success:true,
      data:userData
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      message:error.message
    })
  }
}

module.exports= {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  userDetail

}