import User from "../model/user.js";
import asyncHandler from 'express-async-handler'
import generateToken from "../utils/genToken.js";

const registerHandler = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
        res.status(400)
        throw new Error('User already exist')
    }

    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201)
        res.json({
            user: {
                _id: user.id,
            username: user.username,
            email: user.email,
            }, 
            access_token: generateToken(user._id),
            success: true,
            message: 'Welcome !'
        })
    } else {
        res.status(400)
        throw new Error('User not found')
    }
})

const loginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
            },
            access_token: generateToken(user._id),
            success: true,
            message: 'Login successfully!'
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or passwords')
    }
})

export { registerHandler, loginHandler }