const jwt = require("jsonwebtoken");

const auth = async(req,res,next)=>{
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];

            const userID = jwt.verify(token, process.env.SECRET)
            if(userID){
                next();
            }
        } catch (error) {
            console.log(error);
            res.send({message : "Unuthorized user !!"})
        }
    } 
}

module.exports = auth;