const jwt = require("jsonwebtoken");



const AuthCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            req.body.userid = decoded.userid
            req.userid = decoded.userid
            next()
        } else {
            // in the case of token not found
            return res.status(400).json({
                errors: true,
                message: "token not found"
            })
        }
        
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            errors: true,
            message: "Authorization failed"
        })    
    }  
}

module.exports =AuthCheck