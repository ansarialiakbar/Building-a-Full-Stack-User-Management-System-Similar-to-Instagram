exports.logInValidator = async(req, res, next)=>{
    const {username, password} = req.body
    if(req.body && username && password){
        next()
    }
    else{
        res.status(404).send({msg:"All input fields are required"})
    }
}