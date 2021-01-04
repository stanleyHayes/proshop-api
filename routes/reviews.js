import express from "express";
import Review from "../models/review.js";
import Product from "../models/product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        let {product, rating, comment} = req.body;
        let productReviews = await Review.find({product});
        const alreadyReviewed = productReviews.find(review => review.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            return res.status(400).json({data: {}, message: `You have already reviewed this product`});
        }
        let review = new Review({user: req.user._id, product, rating, comment});
        review = await Review.create(review);
        let productBeingReviewed = await Product.findById(product);
        const totalRating = productReviews.reduce((accumulator, review) => accumulator + review.rating, 0) + rating;
        productBeingReviewed.rating = totalRating / (productReviews.length + 1);
        productBeingReviewed.save();
        await review.populate({path: 'product', select: 'name'}).populate({
            path: 'user',
            select: 'name email _id'
        }).execPopulate();
        res.status(201).json({data: review, message: `Review created on product ${review.product.name}`})
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.get('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(401).json({data: [], message: `Unauthorized to access this route`});
        }
        const reviews = Review.find({});
        res.status(200).json({data: reviews, message: `${reviews.length} reviews retrieved!!!`});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.get('/:id', auth, async (req, res) =>{
    try {
        const review = await Review.findById(req.params.id)
            .populate({
                path: "product",
                select: 'name price description category brand'
            }).populate({
                path: "user",
                select: 'name email'
            });

        if (!review) {
            return res.status(404).json({message: "Review not found", data: {}});
        }
        res.status(200).json({data: review, message: `Review with user ${review.user.name} retrieved successfully`});
    }catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.put('/:id', auth, async (req, res) =>{
    try {
        let review = await Review.findById(req.params.id)
        if (!review) {
            return res.status(404).json({data: {}, message: `Review with id ${req.params.id} not found`});
        }
        const allowedUpdates = ['comment'];
        const updates = Object.keys(req.body);
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) {
            return res.status(400).json({data: {}, message: `${review._id} update failed!`});
        }
        for (let key of updates) {
            review[key] = req.body[key];
        }
        await review.save();
        await review
            .populate({
                path: "product",
                select: 'name price description category brand'
            }).populate({
                path: "user",
                select: 'name email'
            }).execPopulate();
    }catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.delete('/:id', auth, async (req, res) =>{
    try {
        let review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({data: {}, message: `Review with id ${review._id} not found`});
        }
        await review.remove();
        res.status(200).json({data: review, message: `${review._id} removed!`});
    }catch (e) {
        res.status(500).json({error: e.message});
    }
});

export default router;