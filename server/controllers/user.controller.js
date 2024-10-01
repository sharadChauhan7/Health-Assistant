import { json } from 'express';
import User from '../modals/user.modal.js';
import UserStatus from '../modals/userStatus.modal.js';
import cookieParser from 'cookie-parser';
import {calculateCalories,calculateMacros} from '../util/calorieCounter.js'

export const setUserStatus = async (req, res) => {
    try {
        let  status  = req.body;
        let user = req.cookies.user;
        user = await JSON.parse(user);
        status.user = user;
        status=calculateCalories(status);
        calculateMacros(status);
        console.log(status);
        let userStatus = new UserStatus( status );
        await userStatus.save();
        res.send("Status set");
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send("Error in saving status");
    }
}

export const getUserStatus = async (req, res) => {
    try {
        let user = req.user;
        if(user){
            let userStatus = await UserStatus.findOne({user:user});
            userStatus = await userStatus.populate('user');
            res.status(200).send(userStatus);
        }
        else{
            res.status(400).send("User not found");
        }
    }
    catch(err){
        console.log(err);
    }
}

export const updateUser = async (req,res)=>{
    try{
        let user = req.body;
        let updatedUser = await User.findByIdAndUpdate(user._id,user,{new:true});
        console.log(updatedUser);
        res.status(200).send("User updated successfully");
    }
    catch(e){
        res.status(400).send("Error in updating user");
    }
}

export const updateStatus = async (req,res)=>{
    try{
        let status = req.body;
        status=calculateCalories(status);

        let updatedStatus = await UserStatus.findByIdAndUpdate(status._id,status,{new:true});
        console.log(updatedStatus);
        res.status(200).send("Status updated successfully");
    }
    catch(e){
        res.status(400).send("Error in updating status");
    }
}

// Update user for Dite Plan need to merge the abouv api in one in future

export const updateStatusDite = async (req,res)=>{
    try{

        let {foodAllergies,ditePreference,diteType} = req.body;
        // Conver json to jsObject
        let {_id}= await JSON.parse(req.cookies.user);
        let Status = await UserStatus.findOne({user:_id});
        // Update status
        Status.foodAllergies = foodAllergies;
        Status.dietPreference = ditePreference;
        Status.dietType = diteType;
        await Status.save();
        res.status(200).send("Status updated successfully");
    }
    catch(err){
        console.log(err);
        res.status(400).send("Error in updating status");
    }
}

