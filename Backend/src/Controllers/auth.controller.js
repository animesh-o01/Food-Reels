const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res){
    const {fullName, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User Already Exists",
        });
    }

    const hashesPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName, 
        email, 
        password: hashesPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    return res.status(201).json({
        message: "User Registered Successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    }) 

}

async function loginUser(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token);

    return res.status(200).json({
        message: "User logged in Successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}

async function logoutUser(req, res){
    res.clearCookie("token");
    return res.status(200).json({
        message: "User Logged Out Successfully"
    })
}

async function registerFoodPartner(req, res){

    const {name, email, password, contactName, phone, address} = req.body;

    const isAccountExists = await foodPartnerModel.findOne({email});

    if(isAccountExists){
        return res.status(400).json({
            message: 'Food Partner Already Exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        contactName,
        phone,
        address
    })

    const token = jwt.sign({
        id: foodPartner._id
    }, process.env.JWT_SECRET);
    res.cookie("token", token);

    return res.status(201).json({
        message: "Food Partner Registered Successfully",
        user: {
            _id: foodPartner._id,
            email: foodPartner.email,
            fullName: foodPartner.name
            
        }
    })

}

async function loginFoodPartner(req, res){

    const {email, password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    });

    if(!foodPartner){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token);

    return res.status(200).json({
        message: "Food Partner logged in Successfully",
        user: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })

}

function logoutFoodPartner(req, res){
    res.clearCookie("token");
    return res.status(200).json({
        message: "Food Partner logout Successfully"
    })
}

module.exports = { 
    registerUser ,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}