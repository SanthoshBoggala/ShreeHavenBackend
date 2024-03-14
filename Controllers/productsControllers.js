require('dotenv').config();

const asyncHandler = require("express-async-handler"); 
const Products = require('../Models/productModel');
const uploadToS3 = require('../s3')


const getAllProducts = asyncHandler(async (req, res) => {
    const { limit, type, search } = req.query
    const filters = req.query

    let products
    if(type){
        products = Products.find({ type });
    }
    else{
        products = Products.find()
    }

    let cates = []
    const k = Object.keys(filters)

    k.map(one => {
        if(filters[one] == 'false'){
            cates.push(one)
        }
    })

    if(search && search.length !== 0){
        products = products.find({name: { $regex: new RegExp(search, 'i') }});
    }
    if(filters.sortOption){
        products = products.sort({newPrice: parseInt(filters.sortOption) })
    }

    if(cates.length !== 0){
        products = products.find({category: { $nin: cates} })
    }
    if(limit){
        products = products.limit(parseInt(limit))
    }
    if(filters.ratings){
        const rating = Number(filters.ratings)
        products = products.find({ $or: [{ ratings: { $gte: rating } }, { ratings: 0 }] })
    }
    if(filters.priceUnder){
        const higherBound = Number(filters.priceUnder)
        products = products.find({ newPrice: { $lte: higherBound} })
    }

    products = await products.exec()

    res.json({products});
});

const getAllStyleProducts = asyncHandler(async(req, res)=>{
    const {category} = req.params
    const {search} = req.query

    let products
    if(search){
        products = await Products.find({ category ,name: { $regex: new RegExp(search, 'i') }});
    } else {
        products = await Products.find({ category })
    }

    res.json({products})
})

const getAllHotProducts = asyncHandler(async (req, res) => {
    const { limit , search} = req.query;

    let products = Products.find().sort({ discount: -1 });
    if(limit) {
        products = products.limit(parseInt(limit));
    }

    if(search){
        products = products.find({ name: { $regex: new RegExp(search, 'i') }});
    }
    products = await products.exec();
    res.json({products});
});

const getAllTrendingProducts = asyncHandler(async (req, res) => {
    const { limit, search } = req.query;

    let products = Products.find().sort({ ratings: -1 });
    if(limit) {
        products = products.limit(parseInt(limit));
    }
    if(search){
        products = products.find({ name: { $regex: new RegExp(search, 'i') }});
    }

    products = await products.exec();
    res.json({products});
});

const getAllTopRatedProducts = asyncHandler(async (req, res) => {
    const { limit, category, search } = req.query;

    let products = await Products.find().sort({ starRating: -1 });
    let topRated = {}
    let cateCaptions = []
    if(limit) {
        products.some(one => {
            if(!topRated[one.category]) {
                topRated[one.category] = one
            }
            if(topRated.length == limit) return true
            else return false
        });
        cateCaptions = ['New Range', 'Top Collection', 'Bestsellers', 'Specials', 'Popular', 'In Focus Now', "Don't Miss", 
                                     "Best Picks", "Most Loved", "Explore Now", "Widest Range"]

        function shuffleArray(cap) {
            for (let i = cap.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cap[i], cap[j]] = [cap[j], cap[i]];
            }
        }    
        
        shuffleArray(cateCaptions)

        products = Object.values(topRated)
    }
    else{
        if(search){
            products = await Products.find({ category,  name: { $regex: new RegExp(search, 'i') }});
        }
        else{
            products = await Products.find({ category })
        }
    }
    res.json({products, cateCaptions});
});

const getAllSimilarProducts = asyncHandler(async (req, res)=>{
    const {key} = req.query

    const presentProduct = await Products.findOne({ key })
    let products = await Products.find()

    let similarProducts = products.filter(one => (one.category == presentProduct.category && one.type == presentProduct.type && one.key != key ))

    // let getSomeExtra = products.map(one =>{ if(one.type == presentProduct.type && one.category != presentProduct.category && one.key != key){
    //     similarProducts.push(one)
    // }})
        
    res.json({products: similarProducts})
})

const getSingleProduct = asyncHandler(async (req, res) => {
    
    let product = await Products.findOne({ key: req.params.id }).populate({
        path: 'reviews.review',
        populate: {
          path: 'user',
          model: 'users'
        }
      });
    if(!product) {
        res.status(400);
        throw new Error('product not found');
    }

    product.reviews.sort((a, b) => new Date(b.review.date) - new Date(a.review.date))

    res.json({product});
});

const postSingleProduct =  asyncHandler(async(req, res) => {
    const {
        name, brand, price, category, productType ,discount = 0, starRating = 0, ratings = 0,
        description
    } = req.body;

    const { userId, type } = req.user;

    if( type !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }

    const files = req.files

    if(!files || files.length < 3){
        res.status(400);
        throw new Error('min 3 images should be uploaded');
    }

    if(!name || !brand || !price || !category || !productType || !description){
        res.status(400);
        throw new Error('provide all fields');
    }

    const productKey = name.split(' ').join('_');

    const productExists = await Products.findOne({ key: productKey });
    if(productExists) {
        res.json({msg : "product already exists"});
        return;
    }

    let s3res = await Promise.all( files.map(async(file)=>{
        const s3file = await uploadToS3({ file, productKey })
        return s3file
    }))

    const er = s3res.find((one) => one && one.error)

    if(er){
        res.status(500);
        throw new Error('error in uploading to s3');
    }

    imageUrls = s3res.map(one => process.env.AWS_URL_PREFIX+one.key)

    const modifiedPrice = (price, dis)=>{
        const nprice = (price * (100-dis))/100;
        return parseInt(nprice);
    }

    const newPrice = modifiedPrice(Number(price), Number(discount));

    let images = imageUrls.join(",")
    let inStock = req.body.inStock === 'true' ? true : false;
    let data = {
        key: productKey, name, brand, category, type: productType, price,
        newPrice, discount, inStock, ratings, starRating, description, images
    }
    let product = await Products.create( data );

    res.json({product});
});

const putSingleProduct = asyncHandler(async (req, res) => {
    let { brand, price, category, productType ,discount, inStock, starRating, ratings,
    description } = req.body;
    const { userId, type } = req.user;

    if( type !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }

    const productExists = await Products.findOne({ key: req.params.id });
    if(!productExists) {
        res.status(400);
        throw new Error('product not found');
    }

    const modifiedPrice = (price, dis)=>{
        const nprice = (price * (100-dis))/100;
        return parseInt(nprice);
    }


    let newPrice = 0;
    if(price && discount){
        newPrice = modifiedPrice(parseInt(price), parseInt(discount));
    }
    else if(price) {
        newPrice = modifiedPrice(parseInt(price), productExists.discount);
    } 
    else if(discount) {
        newPrice = modifiedPrice(productExists.price, parseInt(discount));
    }   

    let product;
    let newProduct = req.body
    productType = newProduct.productType
    
    delete newProduct.productType
    
    if(productType) {
        newProduct = {...newProduct, type: productType}
    }
    if(newPrice !== 0){
        product = await Products.findOneAndUpdate(
            {key: req.params.id},
            {...newProduct, newPrice },
            {new: true}
        );
    }
    else{
        product = await Products.findOneAndUpdate(
            {key: req.params.id},
            {...newProduct},
            {new: true}
        );
    }

    res.json({product})
});

const deleteSingleProduct = asyncHandler(async(req, res) => {
    const { userId, type } = req.user;
    // if( type !== 'admin' ) {
    //     res.status(401);
    //     throw new Error('only admins can access');
    // }
    const product = await Products.findOneAndDelete({ key: req.params.id });
    res.json({product});
});

module.exports = {
    getAllProducts,
    getAllStyleProducts,
    getAllHotProducts,
    getAllTrendingProducts,
    getAllTopRatedProducts,
    getAllSimilarProducts,
    getSingleProduct,
    postSingleProduct,
    putSingleProduct,
    deleteSingleProduct
}