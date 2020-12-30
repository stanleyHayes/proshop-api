import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
    try {
        if(req.get('Authorization') && !req.get('Authorization').startsWith('Bearer')){
            return res.status(400).json({data: {}, message: `Invalid header format`});
        }
        let token = req.get('Authorization').split(' ')[1];
        if(!token){
            return res.status(400).json({data: {}, message: `Invalid header format`});
        }
        const {_id} = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id, "logins.token": token});
        if(!user){
           return  res.status(403).json({message: `Session expired. Please login again`});
        }
        req.token = token;
        req.user = user;
        next();
    }catch (e) {
        res.status(500).json({message: e.message});
    }
}

export default auth