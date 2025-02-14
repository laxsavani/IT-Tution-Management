const Admin = require("../models/admin.model");
const jwt = require('jsonwebtoken');
const Enquiry = require("../models/enquiry.model");
const Student = require("../models/student.model");
const RecentsUpdates = require("../models/recentUpdates.model");
const Manager = require("../models/manager.model")
const payFees = require('../models/payFees.model')

const nodemailer = require('nodemailer');
const cloudinary = require('../helper/cloudinary');

exports.loginStudent = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const emailData = await Student.findOne({ email: email });
        if (emailData == null) {
            const displayErrorEmail = "Email cannot match";
            const displayErrorPassword = undefined;
            res.render('student_login', { displayErrorEmail, displayErrorPassword });
            next();
        } else {
            if (password != emailData.password) {
                const displayErrorEmail = "Password cannot match";
                const displayErrorPassword = undefined;
                res.render('student_login', { displayErrorEmail, displayErrorPassword });
                next();
            } else {
                const token = await jwt.sign({ _id: emailData._id }, process.env.SECRET_KEY);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 5 * 1000 * 1000 * 1000),
                    httpOnly: true
                });
                
                req.flash('success','login successfully');
                res.redirect("/student");
            }
        }
    } catch (error) {
        console.log("manager Loginmanager Error", error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
};

exports.newpass = async (req, res,next) => {
    try {
        var npass = req.body.npass
        var oldpass=req.body.oldpass
        var cpass=req.body.cpass
        var stu_id=req.body.id
        var data=await Student.findById(stu_id);
        if (data.password != oldpass){         
            req.flash('error','old password and you enter password not match')
            res.redirect('/student/changePass');
        }
        else{
            if(npass!=cpass){

                req.flash('error','new password and confirm password not match')
                
                res.redirect('/student/changePass');
            
            }
            else{
               
                new_password=await Student.findByIdAndUpdate(stu_id,{password:npass});
                if(new_password){
                    req.flash('success','password generate successfully');
                    res.redirect('/student');
                }
                
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })

    }

}