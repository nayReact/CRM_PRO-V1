import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import { sendResponse } from "../utils/ApiResponse.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs' 

 export const onboardTenant = async (req, res) => {
    try{
        const {companyName, name, email, password } = req.body
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json(new ApiResponse(400, null, 'Email already registered'))
        }

        const newTenant = await Tenant.create({ name: companyName})

        const salt = await bcrypt.genSalt(10)
        //const hashedPassword = await bcrypt.hash(password, salt )

        const user = await User.create({
            name, 
            email,
            password,
            role: 'admin',
            tenantId: newTenant._id
        })

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '30d'})

        return res.status(201).json(new ApiResponse(201, {
            user: { id:user._id, name: user.name, email: user.email, role:user.role },
            tenant: newTenant,
            token
        }, 'onboarding successful'))
    } catch(error)  {
        return res.status(500).json(new ApiResponse(500, null, error.message))
    }
 }

 export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email attempting to login:", email);

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 2. Check password (assuming you have a matchPassword method in your User model)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // generate token
        console.log("✅ Login successful, sending response...");
        return res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            }
        });

    } catch (error) {
        console.error(" Controller Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

//  export const loginUser = async(req, res) => {
//     console.log('login req received')
//     try{
//         const {email, password} = req.body
//         console.log('email attempting to login', email)
//         const user = await User.findOne({ email }) 
//          //find user by email
//         if(user && (await bcrypt.compare(password, user.password))) {
//             const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'})
//             return res.status(200).json(new ApiResponse(200, {
//                 user: {
//                     id: user._id, 
//                     name: user.name, 
//                     email: user.email, 
//                     role: user.role },
//                 token
//             }, "Login successful "))
//         }
//     } catch(error){
//         return res.status(500).json(new ApiResponse(500, null, error.message))
//     }
//  }

 export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        return sendResponse(res, 200, user)
    } catch(error){
        return sendResponse(res, 500, null, error.message)
    }
 }