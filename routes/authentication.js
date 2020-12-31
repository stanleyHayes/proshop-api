import User from "../models/user.js";
import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {name, email, password, phone} = req.body;
        let user = await User.findOne({email});
        if (user) {
            return res.status(409).json({message: `Account with email ${email} already exists!!!`});
        }
        user = new User({email, name, password, phone});
        await user.save();
        const token = await user.generateToken();
        res.status(201).json({data: user, message: `User account created Successfully`, token});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({data: {}, message: `No account exists with email ${email}`});
        }
        if (!await user.matchPassword(password)) {
            return res.status(401).json({data: {}, message: `Password does not match account with email ${email}`});
        }
        const token = await user.generateToken();
        res.status(200).json({data: {user}, message: `User logged in Successfully`, token})
    } catch (e) {

    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.logins = req.user.logins.filter(login => login.token !== req.token);
        await req.user.save();
        res.status(200).json({message: `Logout successful!!!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.logins = [];
        await req.user.save();
        res.status(200).json({message: `Logged out of all devices`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        res.status(200).json({data: req.user, token: req.token, message: `Profile retrieved`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

export default router;