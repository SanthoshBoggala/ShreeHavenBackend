const asyncHandler = require('express-async-handler');
const TypeCategory = require('../Models/typeCategoryModel');
const Products = require('../Models/productModel');

const getAllTypesCategories = asyncHandler(async(req, res)=>{
    const {type} = req.query 

    let typecategories
    if(type) {
        typecategories = await TypeCategory.findOne({ type })
    }
    else {
        typecategories = await TypeCategory.find();
    }
    res.json({typecategories});
});
const addTypesCategories = asyncHandler(async(req, res)=>{

    const { type, category } = req.body;
    const { type: userType } = req.user;


    if( userType !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }

    if(type && !category ) {
        const typecategory = await TypeCategory.findOne({ type });
        if(typecategory) {
            res.status(400);
            throw new Error('Product type already exists');
        }
        const newType = await TypeCategory.create({ type, categories: [] });

        res.json({newType});
    }
    else if( type && category )
    {
        let typecategory = await TypeCategory.findOne({ type });

        const categoryExists = typecategory.categories.find( cat => cat.category === category );
        if(categoryExists) {
            res.status(400);
            throw new Error('Category already exists');
        }

        typecategory.categories.push( {category} );
        const updatedTypeCategory = await typecategory.save();

        res.json({updatedTypeCategory})
    }
    else {
        res.status(400);
        throw new Error('Invalid');
    }
});
const removeTypesCategories = asyncHandler(async(req, res)=>{
    const { type, category } = req.body;
    const { type: userType } = req.user;


    if( userType !== 'admin' ) {
        res.status(401);
        throw new Error('only admins can access');
    }

    if(type && !category){
        const typecategory = await TypeCategory.findOneAndDelete({ type })
        const deletedProducts = await Products.deleteMany({ type })
        res.json({typecategory})
        return
    }
    else if(type && category){
        let typecategory = await TypeCategory.findOne({ type })
        if(!typecategory) {
            res.status(400);
            throw new Error('Product type doesnt exists');
        }
        typecategory.categories = typecategory.categories.filter( cat => cat.category != category );

        await typecategory.save();
        const deletedProducts = await Products.deleteMany({ category })

        res.json({typecategory})
        return;
    }
});

module.exports = {
    getAllTypesCategories,
    addTypesCategories,
    removeTypesCategories
}