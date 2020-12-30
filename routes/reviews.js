import express from "express";
import Review from "../models/review.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let {user, product, rating, comment} = req.body;
        let review = new Review({user, product, rating, comment});
        review = await Review.create(review);
        await review.populate({path: 'product', select: 'name'}).execPopulate();
        res.status(201).json({data: review, message: `Review created on product ${review.product.name}`})
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

export default router;