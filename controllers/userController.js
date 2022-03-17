const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

require('dotenv').config({ path: '../.env' })


//User Register
exports.register = async (req, res) => {
    try {

        const { userName, email, password } = req.body;

        const existUser = await User.findOne({ email: email })

        if (existUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exist, Please login!'
            })
        }

        console.log(userName)
        //encrypt password before save
        const encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            userName,
            email,
            password: encryptedPassword,
        })

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//Login
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(200).json({
                status: 404,
                success: false,
                message: "invalid credentials"
            })
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                status: 404,
                success: false,
                message: "invalid credentials!"
            })
        }

        const token = jwt.sign(
            {
                id: user._id
            }
            , `${process.env.JWT_SECRET || '$%jwt&^&token$$%key'}`,
            {
                expiresIn: `${process.env.JWT_EXPIRES_TIME || '7d'}`
            }
        )

        return res.status(200).json({
            status: 200,
            success: true,
            token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//Get logged in user
exports.getUser = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//Update Profile
exports.updateProfile = async (req, res) => {

    try {

        const { userName, email } = req.body;

        const user = await User.findByIdAndUpdate(req.user.id, {
            userName,
            email
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Profile update successfully."
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


//Change Password
exports.changePassword = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        const isCurrentPass = await bcrypt.compare(req.body.currentPassword, user.password)

        if (!isCurrentPass) {
            return res.status(400).json({
                success: false,
                message: "Incorrect current password."
            })
        }

        const hashPass = await bcrypt.hash(req.body.newPassword, 10)

        user.password = hashPass;

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password has been changed successfully."
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


//Forgot Password
exports.forgotPassword = async (req, res) => {

    const { email } = req.body

    //check if user exists
    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        })
    }

    try {

        const resetCode = Math.floor(100000 + Math.random() * 900000);

        //update user and set password 
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

        await user.save({ validateBeforeSave: false })

        const options = {
            from: "umwezimediaconsult@gmail.com",
            to: user.email,
            subject: "Password reset code .",
            text: `
                <p>Follow the link below to reset your password</p>
                <a href='http://localhost:4000/api/v1/users/password/reset/${resetCode}'>Reset Password</a>
                `
        }
        sendEmail(options)

        return res.status(200).json({
            success: true,
            message: `Reset code has been sent to : ${user.email}`
        })

    } catch (error) {

        user.resetPasswordCode = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false });
    }

}


//Reset Password
exports.resetPassword = async (req, res) => {

    try {

        //get password reset code
        const resetPasswordCode = req.params.code

        const user = await User.findOne({
            resetPasswordCode,
            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "code is incorrect or is expired."
            })
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password must be the same"
            })
        }

        // Set new password
        const hashPass = await bcrypt.hash(req.body.password, 10)

        user.password = hashPass;

        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()

        res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

//delete profile
exports.deleteProfile = async(req, res) =>{
    try {
        
        const user = await User.findByIdAndDelete(req.user.id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found."
            })
        }

        return res.status(200).json({
            success: true,
            message: "You have successfully deleted your account."
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}