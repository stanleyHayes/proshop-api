import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(401).json({data: {}, message: `Unauthorized to access this route!!!`});
        }
        const {name, email, password, phone} = req.body;
        let user = await User.findOne({email});
        if (user) {
            return res.status(409).json({message: `Account with email ${email} already exists!!!`});
        }
        user = new User({email, name, password, phone});
        await user.save();
        res.status(201).json({data: user, message: `Account with email ${email} successfully created`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.get('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(401).json({data: [], message: `Unauthorized to access this route!!!`});
        }
        const users = await User.find({});
        res.status(200).json({data: users, message: `${users.length} users retrieved!!!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(401).json({data: {}, message: `Unauthorized to access this route!!!`});
        }
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({data: {}, message: `User with id ${req.params.id} does not exist`});
        }
        const updates = Object.keys(req.body);
        console.log(req.body);
        const allowedUpdates = ['email', 'phone', 'name', 'password', 'isAdmin'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) {
            return res.status(400).json({message: `Update not allowed`});
        }
        for (let key of updates) {
            user[key] = req.body[key];
        }
        await user.save();

        res.status(200).json({
            data: user,
            message: `Account with email ${req.body.email} successfully updated`
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.get('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({data: {}, message: `Unauthorized to access this route!!!`});
        }
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({data: {}, message: `User with id ${req.params.id} does not exist`});
        }
        res.status(200).json({data: user, message: `User with email ${user.email} successfully retrieved!!!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({data: {}, message: `Unauthorized to access this route!!!`});
        }
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({data: {}, message: `User with id ${req.params.id} does not exist`});
        }
        await user.remove();
        res.status(200).json({data: user, message: `Account with email ${user.email} removed!!!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

export default router;