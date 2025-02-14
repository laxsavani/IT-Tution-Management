const Student = require("../models/student.model");
const jwt = require("jsonwebtoken");
const studentSchema = async (req, res, next) => {
    try {
        const Token = req.cookies.jwt;
        if (Token) {
            const verifystudent = jwt.verify(Token, process.env.SECRET_KEY, (error, data) => {
                // if (error == null) { return error; }
                // else return data;
                return data;
            });
            console.log(verifystudent);
            if (verifystudent == undefined) {
                res.redirect('/student/login');
                
                console.log("token cannot match");

            } else {
                const studentData = await Student.findById({ _id: verifystudent._id });
                if (studentData == null) {
                    res.redirect('/student/login');
                    // res.status(401).json({
                    //     message: "UNAUTHORIZED",
                    //     status: 401,
                    // });
                } else {
                    req.Student = studentData;
                    req.token = Token;
                    next();
                }
            }
        } else {
            res.redirect("/student/login");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500,
        });
    }
};

module.exports = studentSchema;
