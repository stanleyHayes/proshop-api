import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        trim: true,
        type: String,
        required: true
    },
    password: {
        trim: true,
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate: function (value) {
            if (!validator.isEmail(value)) {
                return new Error(`Invalid Email ${value}`);
            }
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: function (value) {
            if (!validator.isMobilePhone(value)) {
                return new Error(`Invalid Phone Number ${value}`);
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    logins: [
        {
            token: String,
            date: Date
        }
    ]
}, {timestamps: true});

userSchema.methods.matchPassword = async function (password){
    return bcrypt.compare(password, this.password);
}

userSchema.pre("save", async function (next) {
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateToken = async function(){
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET, {expiresIn: '30d'});
    this.logins = this.logins.concat({token, date: Date.now()});
    await this.save();
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;