import mongoose from "mongoose";

const Schema = mongoose.Schema

const productSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User"
    },
    name: {
        trim: true,
        type: String,
        required: true
    },
    category: {
        trim: true,
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    description: {
        trim: true,
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    countInStock: {
        type: Number,
        default: 0
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});


productSchema.virtual('reviews', {
    localField: '_id',
    foreignField: 'product',
    justOne: false,
    ref: 'Review'
});


productSchema.virtual('numReviews', {
    localField: '_id',
    foreignField: 'product',
    justOne: false,
    count: true,
    ref: 'Review'
});

const Product = mongoose.model("Product", productSchema);

export default Product;