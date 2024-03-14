require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();
const connectUrl = process.env.MONGODB_URL;

const userRoutes = require('./Routes/userRoutes');
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require('./Routes/cartRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const wishListRoutes = require('./Routes/wishListRoutes');
const typeCategoryRoutes = require('./Routes/typeCategoryRoutes');
const errorHandler = require("./Middlewares/errorHandler");
const connectDB = require('./DB/connectDB');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.use('/api/products', productRoutes);
app.use('/api/type_category', typeCategoryRoutes);
app.use('/api/reviews', reviewRoutes)
app.use('/api', userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/wishList',wishListRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

const server = process.env.PORT || 5000;
const start =  async()=>{
    try{
        await connectDB(connectUrl)
            .then(()=>{
                app.listen(server);
                console.log(`server running on ${server}..`);
            })
            .catch((err)=> console.log(err))
    }
    catch(err){
        console.log(err);
    }
}

start();