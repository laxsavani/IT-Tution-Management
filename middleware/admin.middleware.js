const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const adminSchema = async (req, res, next) => {
    try {
        const Token = req.cookies.jwt;
        if (Token) {
            const verifyAdmin = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            }
            );
            console.log(verifyAdmin);
            if (verifyAdmin == undefined) {

                res.redirect('/admin/login')
                
            } else {
                const adminData = await Admin.findById({ _id: verifyAdmin._id });
                if (adminData == null) {
                    res.redirect('/admin/login')
                    // res.status(401).json({
                    //     message: "UNAUTHORIZED",
                    //     status: 401,
                    // });
                } else {
                    req.admin = adminData;
                    req.token = Token;
                    return next();
                }
            }
        } else {
            res.redirect("/admin/login");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500,
        });
    }
};

module.exports = adminSchema;
