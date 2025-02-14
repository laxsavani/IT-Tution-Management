const manager = require("../models/manager.model");
const jwt = require("jsonwebtoken");
const managerSchema = async (req, res, next) => {
    try {
        const Token = req.cookies.jwt;
        if (Token) {
            const verifymanager = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            }
            );
            console.log(verifymanager);
            if (verifymanager == undefined) {
                res.redirect('/manager/login')
                console.log("token cannot match");
            } else {
                const managerData = await manager.findById({ _id: verifymanager._id });
                if (managerData == null) {
                    res.redirect('/manager/login');
                    // res.status(401).json({
                    //     message: "UNAUTHORIZED",
                    //     status: 401,
                    // });
                } else {
                    req.manager = managerData;
                    req.token = Token;
                    return next();
                }
            }
        } else {
            res.redirect("/manager/login");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500,
        });
    }
};

module.exports = managerSchema;
