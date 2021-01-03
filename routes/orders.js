import express from "express";
import Order from "../models/order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, async (req, res, ) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({data: {}, message: `No order items`});
        }
        let order = new Order({
            items,
            shippingPrice,
            shippingAddress,
            paymentMethod,
            taxPrice,
            itemsPrice,
            totalPrice,
            user: req.user
        });

        order = await order.save();
        res.status(201).json({data: order, message: `Order created successfully`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id}).populate({path: 'user', select: 'name email'});

        res.status(200).json({data: orders, message: `${orders.length} Orders successfully retrieved`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.get('/:id', auth, async (req, res, ) => {
    try {
        const order = await Order.findById(req.params.id).populate({path: 'user', select: 'name email'});
        if (!order) {
            return res.status(404).json({data: {}, message: `Order with id ${req.params.id} does not exist!!!!`});
        }
        res.status(200).json({data: order, message: `Order with id ${req.params.id} successfully retrieved`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate({path: 'user', select: 'name email'});

        res.status(200).json({data: orders, message: `${orders.length} Orders successfully retrieved`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({data: {}, message: `Order with id ${order._id} not found!!!`});
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ['isPaid', 'isDelivered', 'paidAt', 'deliveredAt', 'paymentResult'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if (!isAllowed) {
            return res.status(400).json({data: {}, message: `Updates not allowed`});
        }
        for (const key of updates) {
            if (key === 'isPaid') {
                order[key] = true;
                order['paidAt'] = Date.now();
                switch (order.paymentMethod) {
                    case 'MOMO':
                        break;
                    case 'PAY_PAL':
                        order.paymentResult = {
                            id: req.body.id,
                            status: req.body.status,
                            update_time: req.body.update_time,
                            email_address: req.body.email_address
                        }
                        break;
                    case 'STRIPE':
                        break;
                    case 'CREDIT_CARD':
                        break;
                }
            } else if (key === 'isDelivered') {
                order[key] = true;
                order['deliveredAt'] = Date.now();
            } else {
                order[key] = req.body[key];
            }
        }
        order = await order.save();
        await order.populate({path: 'user', select: 'email name'}).execPopulate();
        res.status(200).json({data: order, message: `Order with id ${order._id} successfully updated`});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

export default router;