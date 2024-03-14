const asyncHandler = require('express-async-handler')
const WishListItems = require('../Models/wishListModel')
const Products = require('../Models/productModel')

const getWishListItems = asyncHandler(async (req, res) => {
    const { type } = req.user
    if (type !== 'admin') {
        res.status(401)
        throw new Error('only admins can access')
    }
    const wishListItems = await WishListItems.find()

    res.json({ wishListItems })
})

const getMyWishListItems = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    if (type !== 'customer') {
        res.status(401)
        throw new Error('only customer can access')
    }

    const { key } = req.query
    const wishListItems = await WishListItems.findOne({ user: userId }).populate('products.product')

    let get = false
    if(wishListItems && wishListItems.products){
        const oneWish = wishListItems.products.find(one => one.product.key === key)
        if(oneWish) get = true
    }

    res.json({ wishListItem: get })
})

const addToWishList = asyncHandler(async(req, res)=>{
    const {userId, type } = req.user
    if (type !== 'customer') {
        res.status(401)
        throw new Error('only customers can access')
    }

    const { key } = req.body

    if (!key) {
        res.status(400)
        throw new Error("Provide all fields")
    }
    const product = await Products.findOne({ key })

    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }

    let wishListItems = await WishListItems.findOneAndUpdate({ user : userId })
    if(!wishListItems){
        wishListItems = await WishListItems.create({
            user: userId,
            products: []
        })
    }

    let getWishListItems = await WishListItems.findOne({ user : userId }).populate('products.product')

    let get = false
    if(getWishListItems && getWishListItems.products){
        const oneWish = getWishListItems.products.find(one => one.product.key === key)
        if(oneWish) get = true
    }

    if(get){
        wishListItems = await WishListItems.findOneAndUpdate(
            { user: userId },
            { $pull: { products: { product: product._id } } },
            { new: true }
        )
    }
    else{
        wishListItems = await WishListItems.findOneAndUpdate(
            { user: userId }, 
            { $push: { products: {product : product._id} } }
        )
    }
    res.json({ wishListItem: !get })
})

const removeFromWishList = asyncHandler(async (req, res) => {
    const { userId, type } = req.user;
    if (type !== 'customer') {
        res.status(401);
        throw new Error('only customers can access')
    }
    const { key } = req.body

    if (!key) {
        res.status(400)
        throw new Error("Provide all fields")
    }
    const product = await Products.findOne({ key })

    if (!product) {
        res.status(400)
        throw new Error("Product not found")
    }

    const wishListItems = await WishListItems.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { product: product._id } } },
        { new: true }
    )

    res.json({ wishListItems })
})

module.exports = {
    getWishListItems,
    addToWishList,
    getMyWishListItems,
    removeFromWishList
}