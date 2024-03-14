const asyncHandler = require('express-async-handler');
const Products = require('../Models/productModel');
const Orders = require('../Models/ordersModel');


const getAllOrders = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    const { status } = req.query
    if( type !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }
    let orders = []
    if(status && status.length != 0){
        orders = await Orders.find( { status } ).populate('product').sort({ orderedDate: -1 })
    }
    else{
        allOrders = await Orders.find().populate('product').sort({ orderedDate: -1 })
        allOrders.map(one => {
            if(one.status == 'Pending'){
                orders.push(one)
            }
        })
        allOrders.map(one => {
            if(one.status == 'Return'){
                orders.push(one)
            }
        })
        allOrders.map(one => {
            if(one.status == 'Delivered'){
                orders.push(one)
            }
        })
    }
    
    res.json({ orders });
});
const getAllMyOrders = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    const { status } = req.query
    if( type !== 'customer' ) {
        res.status(401);
        throw new Error('only customers can access');
    }
    let orders
    if(status && status.length !== 0){
        orders = await Orders.find({ user: userId, status }).populate('product').sort({ orderedDate: -1 })
    }
    else{
        orders = await Orders.find({ user: userId }).populate('product').sort({ orderedDate: -1 })
    }
    
    res.json({ orders });
});
const getSingleOrder = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    if( type !== 'customer' ) {
        res.status(401);
        throw new Error('only customers can access');
    }
    const order = await Orders.findById(req.params.id)
    res.json({ order });
});
const addToOrders = asyncHandler(async(req, res) => {
    const { userId, type } = req.user
    if( type !== 'customer' ) {
        res.status(401);
        throw new Error('only customers can access');
    }
    const { key, size, count, color, address, paymentMethod } = req.body;

    if( !count || !address || !paymentMethod  || !key){
        res.status(400);
        throw new Error("provide all fields");
    }

    const productExists = await Products.findOne({ key });
    if(!productExists) {
        res.status(400);
        throw new Error('product not exists');
    }

    let order
    if(color){
        order = await Orders.create( 
            {   
                user: userId,
                product: productExists._id,
                size,
                count,
                color,
                address,
                paymentMethod,
                price : Number(count) * productExists.newPrice,
            });
    }
    else{
        order = await Orders.create( 
            {   
                user: userId,
                product: productExists._id,
                count,
                address,
                paymentMethod,
                price : Number(count) * productExists.newPrice,
            });
    }
    
    res.json({order});
});

const updateOrder = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    if( type !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }
    const orderId  = req.params.id;
    const { status } = req.body;

    if (!orderId || !status) {
        res.status(400);
        throw new Error("Please provide orderId and status");
    }
    const statusOptions = ['Pending', 'Failed', 'Delivered', 'Return Pending'];
    if (!statusOptions.includes(status)) {
        res.status(400);
        throw new Error("status is invalid");
    }

    const orderData = await Orders.findByIdAndUpdate(
        orderId,
        { status, deliveredDate: Date.now()},
        { new: true }
    );

    res.json({ orderData });
});
const delOrder = asyncHandler(async (req, res) => {
    // const { userId, type } = req.user
    // if( type !== 'customer' ) {
    //     res.status(401);
    //     throw new Error('only customers can access');
    // }
    const order = await Orders.findByIdAndDelete(req.params.id);
    res.json({order});
});



module.exports = {
    getAllOrders,
    getAllMyOrders,
    getSingleOrder,
    addToOrders,
    delOrder,
    updateOrder
}
