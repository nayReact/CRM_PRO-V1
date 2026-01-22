import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import {sendResponse} from '../utils/ApiResponse.js'

export const protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1] //get token
            const decoded= jwt.verify(token, process.env.JWT_SECRET)// verify token
            req.user = await User.findById(decoded.id).select('-password')//get user from token
            next()
        }catch(error){
            return sendResponse(res, 401, null, "Not authorized, token req canceled")
        }
    }
    if (!token){ 
        return sendResponse(res, 401, null, 'Not authorized, Token not available')
    }
}