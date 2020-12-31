import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {

    } catch (e) {

    }
});


router.get('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({data: [], message: `Unauthorized to access this route!!!`});
        }
        const users = await User.find({});
        res.status(200).json({data: users, message: `${users.length} users retrieved!!!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.get('/:id', auth, async (req, res) => {
    try {

    } catch (e) {

    }
});


router.put('/:id', auth, async (req, res) => {
    try {

    } catch (e) {

    }
});

router.delete('/:id', auth, async (req, res) => {
    try {

    } catch (e) {

    }
});

export default router;