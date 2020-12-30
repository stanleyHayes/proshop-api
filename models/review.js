import mongoose from "mongoose";

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

const Review = mongoose.model("Review", reviewSchema);

export default Review;