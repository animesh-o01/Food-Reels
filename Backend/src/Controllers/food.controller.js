const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const {v4: uuid} = require('uuid');

async function createFood(req, res) {
    
        try {
        if (!req.file) {
            return res.status(400).json({ message: "video file is required (form-data key: video)" });
        }

        const fileUploadResult = await storageService.uploadFile(
            req.file.buffer.toString('base64'),
            uuid()
        );

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id // adjust to however your auth middleware sets this
        });

        console.log(foodItem);
        return res.status(201).json({ message: "food created successfully", food: foodItem });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

async function getFoodItems(req, res){

    const foodItems = await foodModel.find({});
    res.status(200).json({
        message: 'Food Item Fetched Successfully',
        foodItems
    })
    
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user._id;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if(isAlreadyLiked){
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            messgae: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1}
    })

    res.status(200).json({
        message: "Food Liked",
        like
    })

}

async function saveFood(req, res){
    const {foodId} = req.body;
    const user = req.user._id;

    const isAlreadySaved = await saveModel.findOne({
        food: foodId,
        user: user._id
    })

    if(isAlreadySaved){
        await saveModel.deleteOne({
            food: foodId,
            user: user._id
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1}
        })

        return res.status(200).json({
            message: "Food Unsaved successfully"
        })
    }

    const save = await saveModel.create({
        food: foodId,
        user: user._id
    })

    await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        })

    return res.status(200).json({
        message: "Food Saved Successfully",
        save
    })
}

async function getSavedFoods(req, res){
    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoods
};