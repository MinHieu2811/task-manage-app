import User from '../model/user.js'
import jsonwebtoken from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import connect from '../connectDB.js'

export const validateToken = (token) => {
    jwt.verify(token, process.env.JWT_SECRET || '', (err) => {
      if(err instanceof jwt.JsonWebTokenError) {
        return false
      }
    })
  
    return true
}

const verifyToken = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            if(validateToken(token)) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id)
                
                next()
            } else {
                res.status(401)
                throw new Error('Not authorized')
            }
        }catch(err){
            console.log(err)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

export { verifyToken }