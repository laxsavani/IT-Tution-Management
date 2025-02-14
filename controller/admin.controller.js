const Admin = require("../models/admin.model");
const jwt = require('jsonwebtoken');
const Enquiry = require("../models/enquiry.model");
const Student = require("../models/student.model");
const RecentsUpdates = require("../models/recentUpdates.model");
const Manager = require("../models/manager.model");
const bcrypt = require("bcrypt");

exports.loginAdmin = async (req, res, next) => {
     try {
            const email = req.body.email;
            const password = req.body.password;
            const emailData = await Admin.findOne({ email: email });
            if (emailData == null) {
                const displayErrorEmail = "Email cannot match";
                const displayErrorPassword = undefined;
                res.render('admin_login', { displayErrorEmail, displayErrorPassword });
                next();
            } else {
                const match = await bcrypt.compare(password, emailData.password);
                if (!match) {
                    const displayErrorEmail = "Password cannot match";
                    const displayErrorPassword = undefined;
                    res.render('admin_login', { displayErrorEmail, displayErrorPassword });
                    next();
                } else {
                    const token = await jwt.sign({ _id: emailData._id }, process.env.SECRET_KEY);
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 5 * 1000 * 1000 * 1000),
                        httpOnly: true
                    });
                    req.flash("success", "hello")
                    res.redirect("/admin");
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

exports.dashboardAdmin = async (req, res) => {
    try {
        const enquiryData = await Enquiry.find();
        const studentData = await Student.find();
        const recentsUpdate = await RecentsUpdates.find();
        const activeEnquiry = await Enquiry.find({ status: true });
        const deactiveEnquiry = await Enquiry.find({ status: false });
        const managerData = await Manager.find();
        res.render('admin_dashboard',
            {
                enquiryData,
                studentData,
                recentsUpdate,
                activeEnquiry,
                deactiveEnquiry,
                managerData,
            });
    } catch (error) {
        console.log(`Admin Dashboard Error ${error}`);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.managerRegister = async (req, res, next) => {
    try {
        const managername = req.body.managername;
        const email = req.body.email;
        const password = req.body.password; 
        const epassword = await bcrypt.hash(password, 10)
        const managerInsert = new Manager({
            managername: managername,
            email: email,
            password: epassword
        });
        await managerInsert.save();
        res.redirect("/admin");
    } catch (error) {
        console.log(`Admin Profile Error ${error}`);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
};

exports.recents_updates = async (req, res) => {
    try {
        const message = req.body.message;
        const files = req.files;
        console.log(files);
        let image_post = [];
        for (let file of files) {
            let { path } = file;
            const imageLink = path;
            image_post.push(imageLink)
        }
        const recentPostData = new RecentsUpdates({
            message: message,
            image_post: image_post,
        });
        await recentPostData.save();
        // const userData = await User.find().sort({ _id: -1 });
        // const itemsData = await Item.find().sort({ _id: -1 });
        // const categoryData = await Category.find().sort({ _id: -1 })
        res.redirect("/admin");
    } catch (error) {
        console.log(`Admin Profile Error ${error}`);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        });
    }
}

exports.deleteManager = async (req, res) => {
    try {
        const manager_id = req.params.id
        if (manager_id) {
            var deleteManager = await Manager.findByIdAndDelete(manager_id);
            if (deleteManager) {
                console.log('manager deleted successfully');
                res.redirect('/admin')
            }
        }
    } catch (error) {
        console.log(`Admin Profile Error ${error}`);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        });
    }
}
