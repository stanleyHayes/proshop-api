import mongoose from "mongoose";

const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            name: {type: String, required: true},
            quantity: {type: Number, required: true},
            image: {type: String, required: true},
            price: {type: Number, required: true},
            product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
        }
    ],
    shippingAddress: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        country: {type: String, required: true}
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: String,
        status: {},
        update_time: {},
        email_address: {type: String}
    },
    taxPrice: {
        type: Number,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {timestamps: true});


const Order = mongoose.model("Order", orderSchema);

export default Order;