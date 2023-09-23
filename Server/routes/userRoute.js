const express = require("express")
const {signUp, logIn, forgotPassword, resetPassword,  userDetail } = require("../controller/userController.js")
const { signUpValidator } = require("../middleware/signUpValidator.js");
const { logInValidator } = require("../middleware/logInValidator.js");
const { authenticateUser } = require("../middleware/authenticateUser.js");
const userRoute = express.Router()
userRoute.post('/signup', signUp)
userRoute.post('/login', logIn)
userRoute.post('/forgotPassword', signUpValidator, forgotPassword)
userRoute.post('/resetPassword ', logInValidator, resetPassword )
userRoute.post('/userdetil', authenticateUser, userDetail)

module.exports= userRoute