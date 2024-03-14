const asyncHandler = require('express-async-handler')
const Cart = require('../Models/cartModel');
const Products = require('../Models/productModel');

const getCartItems = asyncHandler(async (req, res) => {
    const { type } = req.user;
    if (type !== 'admin') {
        res.status(401);
        throw new Error('only admins can access');
    }
    const cart = await Cart.find().populate('items.product');

    res.json({ cart });
});

const getMyCartItems = asyncHandler(async (req, res) => {
    const { userId, type } = req.user;
    if (type !== 'customer') {
        res.status(401);
        throw new Error('only customers can access')
    }
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    res.json({ cart });
})

const addToCartItems = asyncHandler(async (req, res) => {
    const { userId, type } = req.user;
    if (type !== 'customer') {
        res.status(401);
        throw new Error('only customers can access')
    }
    const { key } = req.body;
    if (!key) {
        res.status(400);
        throw new Error('provide all fields');
    }

    const product = await Products.findOne({ key });

    if (!product) {
        res.status(400);
        throw new Error("Product not found");
    }

    let userExists;

    userExists = await Cart.findOne({ user: userId })

    if (!userExists) {
        userExists = await Cart.create({ user: userId, items: [] });
    }

    const userCartProducts = userExists.items;
    const productAlreadyExists = userCartProducts.find((x) => x.product.equals(product._id));
    let cart;

    if (productAlreadyExists) {
        cart = userExists;
    }
    else {
        cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $push: { items: { product: product._id } } },
            { new: true }
        );
    }
    res.json({ cart });
})

const removeFromCartItems = asyncHandler(async (req, res) => {
    const { userId, type } = req.user;
    if (type !== 'customer') {
        res.status(401);
        throw new Error('only customers can access')
    }
    const { key } = req.body;

    if (!key) {
        res.status(400);
        throw new Error("Provide all fields");
    }
    const product = await Products.findOne({ key });

    if (!product) {
        res.status(400);
        throw new Error("Product not found");
    }

    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: product._id } } },
        { new: true }
    );

    res.json({ cart });
});

module.exports = {
    getMyCartItems,
    getCartItems,
    addToCartItems,
    removeFromCartItems
}
