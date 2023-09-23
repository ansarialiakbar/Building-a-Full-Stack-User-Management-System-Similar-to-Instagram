exports.signUpValidator = async(req, res, next)=>{
    const {name, username, email, password, bio}=req.body
    if(req.body && name && username && email && password  && bio){
        next()
    }else{
        res.status(404).send({msg:"all Input Fields are required"})
    }
}