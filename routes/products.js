import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let {name, description, category, price, brand, image, countInStock} = req.body;
        let product = new Product({name, description, category, price, brand, image, countInStock});
        product = await Product.create(product);

        await product
            .populate({
                path: "reviews",
                populate: {
                    path: "user"
                }
            }).populate({
                path: "numReviews"
            }).execPopulate();

        res.status(201).json({data: product, message: `${product.name} Created`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.get('/', async (req, res) => {
    try {
        const products = await Product.find({})
            .populate({
                path: "reviews",
                populate: {
                    path: "user"
                }
            }).populate({
                path: "numReviews"
            });
        res.status(200).json({data: products, message: `${products.length} products retrieved`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: "user"
                }
            }).populate({
                path: "numReviews"
            });

        if (!product) {
            return res.status(404).json({message: "Product not found", data: {}});
        }
        res.status(200).json({data: product, message: `${product.name} retrieved successfully`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.put('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: "user"
                }
            }).populate({
                path: "numReviews"
            });
        if (!product) {
            return res.status(404).json({data: {}, message: `${product.name} not found`});
        }

        const allowedUpdates = ['name', 'category', 'brand', 'price', 'description', 'countInStock', 'image'];
        const updates = Object.keys(req.body);
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) {
            return res.status(400).json({data: product, message: `${product.name} update failed!`});
        }
        for (let key of updates) {
            product[key] = req.body[key];
        }
        await product.save();
        res.status(200).json({data: product, message: `${product.name} successfully updated!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.delete('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({data: {}, message: `${product.name} not found`});
        }
        await product.remove();
        res.status(200).json({data: product, message: `${product.name} removed!`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

export default router;