import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";
import authRoutes from "./routes/authentication.js";
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import colors from "colors";

const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_URI,
    {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    error => {
        if (!error) console.log(`MongoDB Connected`.cyan.underline);
        else {
            console.log(`Error: ${error.message}`.red.underline.bold);
            process.exit(1);
        }
    });

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);


app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));