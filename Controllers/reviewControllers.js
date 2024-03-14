const { formatDistanceToNow } = require('date-fns');
const asyncHandler = require('express-async-handler');
const Reviews = require('../Models/reviewModel');
const Products = require('../Models/productModel');


const getAllReviews = asyncHandler(async (req, res) => {
    const { type } = req.user
    if( type !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }
    let reviews = await Reviews.find();

    reviews = reviews.map((one) => {
        const timeAgo = formatDistanceToNow( one.date, { addSuffix: true } )
        return ({ ...one, date: timeAgo })
    })

    res.json({ reviews });
});
const getAllMyReviews = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    if( type !== 'customer' ) {
        res.status(401);
        throw new Error('only customers can access');
    }
    const reviews = await Reviews.find({ user: userId });
    res.json({ reviews });
});
const getSingleReview = asyncHandler(async (req, res) => {

    const review = await Reviews.findById(req.params.id);
    res.json({ review });
});
const postSingleReview = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    if( type !== 'customer' ) {
        res.status(401);
        throw new Error('only customers can access');
    }
    const { key, starRating, comment } = req.body;
    if (!key || !starRating) {
        res.status(400);
        throw new Error('provide all fields');
    }
    const productExists = await Products.findOne({ key });
    if (!productExists) {
        res.status(400);
        throw new Error('product not exists');
    }

    let reviewData = { starRating, user: userId };

    if (comment) reviewData = { ...reviewData, comment }

    const review = await Reviews.create({ ...reviewData });

    if (review) {
        let stars = (productExists.starRating * productExists.ratings) + parseFloat(starRating);
        let newStar = stars / (productExists.ratings + 1);
        let reviewMyProduct = { starRating: parseFloat(newStar).toFixed(1), ratings: productExists.ratings + 1 };
        if (comment) reviewMyProduct = { ...reviewMyProduct};
        
        let product = await Products.findOneAndUpdate(
            { key },
            { $set: reviewMyProduct },
            { new: true }
        );
    
        if (comment) {
            product.reviews.push({ review: review._id });
            await product.save();
        }
    }
    res.json({ review });
});
const putSingleReview = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    // if( type !== 'customer' ) {
    //     res.status(401);
    //     throw new Error('only customers can access');
    // }
    res.json({ msg: "done later" });
});
const deleteSingleReview = asyncHandler(async (req, res) => {
    const { userId, type } = req.user
    // if( type !== 'customer' ) {
    //     res.status(401);
    //     throw new Error('only customers can access');
    // }
    const review = await Reviews.findByIdAndDelete(req.params.id);
    res.json({ review });
})

module.exports = {
    getAllReviews,
    getSingleReview,
    getAllMyReviews,
    postSingleReview,
    putSingleReview,
    deleteSingleReview
}