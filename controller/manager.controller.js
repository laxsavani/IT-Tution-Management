const { Calendar } = require('calendar');
const Admin = require("../models/admin.model");
const jwt = require('jsonwebtoken');
const Enquiry = require("../models/enquiry.model");
const Student = require("../models/student.model");
const RecentsUpdates = require("../models/recentUpdates.model");
const Manager = require("../models/manager.model")
const path = require('path')
const fs = require('fs')
const XLSX = require('xlsx')
const schedule = require('node-schedule')
const payFees = require('../models/payFees.model')
const nodemailer = require('nodemailer')
const cloudinary = require('../helper/cloudinary')
const { time } = require("console");
const { brotliCompress } = require('zlib');
const bcrypt = require('bcrypt')


exports.loginManager = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const emailData = await Manager.findOne({ email: email });
        if (emailData == null) {
            const displayErrorEmail = "Email cannot match";
            const displayErrorPassword = undefined;
            res.render('manager_login', { displayErrorEmail, displayErrorPassword });
            next();
        } else {
            const match = await bcrypt.compare(password, emailData.password);
            if (!match) {
                const displayErrorEmail = "Password cannot match";
                const displayErrorPassword = undefined;
                res.render('manager_login', { displayErrorEmail, displayErrorPassword });
                next();
            } else {
                const token = await jwt.sign({ _id: emailData._id }, process.env.SECRET_KEY);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 5 * 1000 * 1000 * 1000),
                    httpOnly: true
                });
                req.flash("success", "hello")
                res.redirect("/manager");
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

exports.managerAdmin = async (req, res) => {
    try {

        const enquiryData = await Enquiry.find();
        const studentData = await Student.find();
        const recentsUpdate = await RecentsUpdates.find();
        const activeEnquiry = await Enquiry.find({ status: true });
        const deactiveEnquiry = await Enquiry.find({ status: false });
        const managerData = await Manager.find();

        // function formatAMPM(date) {
        //     var hours = date.getHours();
        //     var minutes = date.getMinutes();
        //     var ampm = hours >= 12 ? 'pm' : 'am';
        //     hours = hours % 12;
        //     hours = hours ? hours : 12; // the hour '0' should be '12'
        //     hours = hours < 10 ? '0' + hours : hours; // add leading zero if less than 10
        //     minutes = minutes < 10 ? '0' + minutes : minutes;
        //     var strTime = hours + ':' + minutes + ' ' + ampm;
        //     return strTime;
        // }
        // var current_time = new Date();
        // console.log(current_time);
        // var times = formatAMPM(current_time);
        // var hours = times[0] + times[1] + times[6] + times[7];
        // console.log(hours);
        // var time = hours[0] + hours[1] + ':00 ' + hours[2] + hours[3];
        // console.log(time);
        // var tim = String(time);
        // console.log(tim, 'k');


        // console.log("OOOO", Date());

        res.render('manager_dashboard',
            {
                enquiryData,
                studentData,
                activeEnquiry,
                deactiveEnquiry,
                managerData,
            });

    } catch (error) {
        console.log(`manager Dashboard Error ${error}`);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.add_enquiry_data = async (req, res, next) => {

    try {
        req.body.status = true;
        var add_enquiry_data = await Enquiry.create(req.body)
        if (add_enquiry_data) {
            console.log('enquiry added successfully');
            req.flash('success', 'Enquiry added successfully');
            res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        });
    }
}

exports.delete_enquiry = async (req, res) => {

    try {
        if (req.params.id) {
            var delete_enquiry = req.params.id;
            if (delete_enquiry) {
                var delete_data = await Enquiry.findByIdAndDelete(delete_enquiry);
                if (delete_data) {
                    console.log('enquiry deleted successfully');
                    res.redirect('back')
                }
            }
        }
        console.log(req.body.dataid);
        if (req.body.dataid) {
            console.log('hello')
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.delete_enq_confirm = async (req, res) => {

    try {
        if (req.body.dataid) {
            var delete_enq_confirm = await Enquiry.findByIdAndDelete(req.body.dataid);
            if (delete_enq_confirm) {
                console.log('enquiry deleted and confirmed addmission');
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

exports.change_enq_color = async (req, res) => {

    try {

        const RED_TIME = 24 * 60 * 60 * 1000; // 2 minutes in milliseconds
        let intervalId = null;
        let greenTime = {};
        const now = new Date();
        const button = await Enquiry.findByIdAndUpdate(req.body.id, { color: '#add483', lastClicked: now }, { new: true, upsert: true });
        greenTime = now;

        const startInterval = () => {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(async () => {
                const button = await Enquiry.findById(req.body.id);
                if (button?.lastClicked && new Date() - button.lastClicked > RED_TIME) {
                    if (button != null) {
                        button.color = '#fa4e576e';
                        button.lastClicked = '';
                        greenTime = null;
                        await button.save();
                    }
                } else if (greenTime && new Date() - greenTime > RED_TIME) {
                    if (button != null) {
                        button.color = '#fa4e576e';
                        button.lastClicked = '';
                        greenTime = null;
                        await button.save();
                    }
                }
            }, 5 * 1000);
        };
        startInterval();
        res.redirect('/manager')

    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.default_enq_color = async (req, res) => {

    try {
        // console.log(req.body,'color default');
        var enquiry_number = await Enquiry.findByIdAndUpdate(req.body.id, { enquiry_number: 1 })
        const RED_TIME = 10 * 1000; // 2 minutes in milliseconds

        let intervalId = null;
        let greenTime = {};
        const now = new Date();
        const button = await Enquiry.findByIdAndUpdate(req.body.id, { color: '#fff', lastClicked: now }, { new: true, upsert: true });
        greenTime = now;

        const startInterval = () => {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(async () => {
                const button = await Enquiry.findById(req.body.id);
                if (button?.lastClicked && new Date() - button.lastClicked > RED_TIME) {
                    if (button != null) {
                        button.color = '#fa4e576e';
                        button.lastClicked = '';
                        greenTime = null;
                        await button.save();
                    }
                } else if (greenTime && new Date() - greenTime > RED_TIME) {
                    if (button != null) {
                        button.color = '#fa4e576e';
                        button.lastClicked = '';
                        greenTime = null;
                        await button.save();
                    }
                }
            }, 10 * 1000);
        };
        startInterval();
        res.redirect('/manager')
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.Active = async (req, res) => {

    try {
        var data = await Enquiry.findByIdAndUpdate(req.params.id, {
            status: true
        });
        if (data) {
            return res.redirect('back');
        }
        else {
            console.log("Something Wrong.");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

module.exports.deActive = async (req, res) => {

    try {
        var data = await Enquiry.findByIdAndUpdate(req.params.id, {
            status: false
        });
        if (data) {
            return res.redirect('back');
        }
        else {
            console.log("Something Wrong.");
            return res.redirect('back');
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }

}

module.exports.update_enquiry_demo = async (req, res) => {
    try {

        var update_data = await Enquiry.findByIdAndUpdate(req.body.id, {
            time: req.body.time,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        })
        if (update_data) {
            console.log('demo data updated successfully');
            res.redirect('/manager')
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }

}

exports.update_enquiry_data = async (req, res) => {

    try {

        var data = await Enquiry.findByIdAndUpdate(req.body.id, { resoan: req.body.resoan });
        if (data) {
            console.log('updated successfully');
            return res.redirect('/manager')
        }

    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.add_student_data = async (req, res) => {

    try {
        console.log(req.body);
        console.log(req.file.path);
        const uploadedProfileImageDetails = await cloudinary.uploader.upload(req.file.path, { folder: "userProfile" });

        var paid_fees = req.body.paid_fees;
        if (paid_fees) {
            var fees = req.body.fees;
            var pending_fees = fees - paid_fees;
            req.body.pending_fees = pending_fees;
            req.body.password = await bcrypt.hash(req.body.phone, 12);
        }
        req.body.image = uploadedProfileImageDetails.secure_url
        console.log(uploadedProfileImageDetails);
        req.body.cloudinary_id = uploadedProfileImageDetails.public_id
        data = await Student.create(req.body);
        if (data) {
            console.log('addmission added successfully');
            req.flash('success', 'student added successfully');
            return res.redirect('/manager/view_student');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }

}


exports.view_addmission_profile = async (req, res) => {

    try {

        var fees_data = await payFees.aggregate([{ $match: { student_id: req.params.id } }])
        var last_fees = fees_data.splice(-1)
        var profile = await Student.findById(req.params.id)



        const calendar = new Calendar();

        // Student attendance data
        var ss = await Student.findById(req.params.id);

        const studentAttendance = ss.presents

        console.log(ss);
        //     if(studentAttendance?.length != 0){
        //     // Create calendar for multiple months
        //     const startYear = 2023;
        //     const endYear = 2024;
        //     const numMonths = 12;
        //     let calendarHtml = '';

        //     for (let y = startYear; y <= endYear; y++) {
        //       for (let m = 0; m < numMonths; m++) {
        //         const month = m;
        //         const monthCalendar = calendar.monthDays(y, month);

        //         // Generate calendar HTML
        //         let monthHtml = `<div><h2>${new Date(
        //           y,
        //           month
        //         ).toLocaleString('default', { month: 'long' })} ${y}</h2>`;

        //         monthHtml += '<table>';
        //         for (let week of monthCalendar) {
        //           monthHtml += '<tr>';
        //           for (let day of week) {
        //             const formattedDate = new Date(`${y}-${month + 1}-${day}`);
        //             const attendance = studentAttendance.find(
        //               a =>
        //                 new Date(a.date).toDateString() === formattedDate.toDateString()
        //             );
        //             const className = attendance && attendance.present ? 'present' : '';
        //             monthHtml += `<td class="${className}">${day ? day : ''}</td>`;
        //           }
        //           monthHtml += '</tr>';
        //         }
        //         monthHtml += '</table></div>';
        //         calendarHtml += monthHtml;
        //       }
        //     }

        //     // console.log(calendarHtml);

        //     res.render('view_addmission_profile', {
        //         profile,
        //         last_fees,
        //         calendarHtml,
        //     })
        // }
        res.render('view_addmission_profile', {
            profile,
            last_fees,
            calendarHtml: ""
        })
    } catch (err) {

        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500

        })
    }

}


exports.update_student_page = async (req, res) => {

    try {
        var data = await Student.findById(req.params.id)
        return res.render('update_addmission_page', {
            data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
}

exports.update_student_data = async (req, res) => {

    if (req.file) {
        const uploadedProfileImageDetails = await cloudinary.uploader.upload(req.file.path, { folder: "userProfile" });
        // console.log(uploadedProfileImageDetails);

        const data = await Student.findById(req.body.id)
        const cloudinary_id = req.body.cloudinary_id;

        cloudinary.uploader.destroy(cloudinary_id, function (error, result) {

            if (error) {
                console.log(err);
            }
            console.log(result);
        });

        req.body.image = uploadedProfileImageDetails.secure_url
        req.body.cloudinary_id = uploadedProfileImageDetails.public_id
        const updatedata = await Student.findByIdAndUpdate(req.body.id, req.body);
        if (updatedata) {

            res.redirect('/manager/view_addmission_profile/' + req.body.id);

        } else {
            return false;
        }
    }
    else {
        const updatedata = await Student.findByIdAndUpdate(req.body.id, req.body);
        if (updatedata) {

            res.redirect('/manager/view_addmission_profile/' + req.body.id);

        } else {
            return false;
        }
    }
}

exports.pay_fees = async (req, res) => {

    // console.log(req.body);
    try {

        data = await payFees.create(req.body);
        var admission = Student.findById(req.body.student_id, async (err, data) => {
            if (err) {
                console.log(err);
                return false;
            }
            var paid_fees = data.paid_fees;
            var paid_amount = req.body.amount;
            var paid_ans = parseInt(paid_fees) + parseInt(paid_amount);
            var fees = data.fees;
            var pending_ans = parseInt(fees) - paid_ans
            var student_id = req.body.student_id;
            var payment_id = req.body.payment_id

            var fees_update = Student.findByIdAndUpdate(req.body.student_id, { paid_fees: paid_ans, pending_fees: pending_ans, payment_id: payment_id }, async (req, res) => {
                if (err) {
                    console.log(err);
                    return false;
                }
                if (fees_update) {
                    var dd = await payFees.aggregate([{ $match: { student_id: student_id } }], (err, datasss) => {
                        console.log(err);
                        var ss = datasss.splice(-1);
                        var date = ss[0]['date'];
                        var pay_type = ss[0]['pay_type'];
                        var amount = ss[0]['amount'];

                        var transport = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: "darshansavaliya41@gmail.com",
                                pass: "dtsycixptxrqaexh"
                            }
                        });
                        let info = transport.sendMail({
                            from: 'darshansavaliya41@gmail.com',
                            to: data.email,
                            subject: 'testing darshan',
                            text: 'morsymultimedia',
                            html: `<b>total paid fees:${paid_ans}</b><br><b>date of paying fees:${date}</b><br><b>type of paying fees:${pay_type}</b><br><b>total paid fees amount:${amount}</b>`
                        });
                    })
                }
            })
            if (data) {

                const RED_TIME = 30 * 24 * 60 * 60 * 1000; // 2 minutes in milliseconds
                let intervalId = null;
                let greenTime = {};
                const now = new Date();
                const button = await Student.findByIdAndUpdate(req.body.student_id, { color: '#add483', lastClicked: now }, { new: true, upsert: true });
                greenTime = now;

                const startInterval = () => {
                    if (intervalId) clearInterval(intervalId);
                    intervalId = setInterval(async () => {
                        const button = await Student.findById(req.body.student_id);
                        if (button?.lastClicked && new Date() - button.lastClicked > RED_TIME) {
                            button.color = '#fa4e576e';
                            button.lastClicked = '';
                            greenTime = null;
                            await button.save();
                        } else if (greenTime && new Date() - greenTime > RED_TIME) {
                            button.color = '#fa4e576e';
                            button.lastClicked = '';
                            greenTime = null;
                            await button.save();
                        } else if (pending_ans <= 0) {
                            button.color = '#b9b9ff';
                            button.lastClicked = '';
                            greenTime = null;
                            await button.save();
                        }
                    }, 5 * 1000);
                };
                startInterval();
                return res.redirect('back')
            }
        })

    } catch (err) {

        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })

    }
}

exports.student_color_number = async (req, res) => {

    try {

        var student_color_number = await Student.findByIdAndUpdate(req.body.id, { student_color_number: 1 })
        const RED_TIME = 30 * 24 * 60 * 60 * 1000; // 2 minutes in milliseconds

        let intervalId = null;
        let greenTime = {};
        const now = new Date();
        const button = await Student.findByIdAndUpdate(req.body.id, { color: '#fff', lastClicked: now }, { new: true, upsert: true });
        greenTime = now;

        const startInterval = () => {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(async () => {
                const button = await Student.findById(req.body.id);
                if (button?.lastClicked && new Date() - button.lastClicked > RED_TIME) {
                    button.color = '#fa4e576e';
                    button.lastClicked = '';
                    greenTime = null;
                    await button.save();
                } else if (greenTime && new Date() - greenTime > RED_TIME) {
                    button.color = '#fa4e576e';
                    button.lastClicked = '';
                    greenTime = null;
                    await button.save();
                }
            }, 5 * 1000);
        };
        startInterval();
        res.redirect('back')
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }

}

// exports.dd=async(req,res)=>{

//     const html = fs.readFileSync('index.html', 'utf-8');
//     // Create a new workbook and worksheet
//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.aoa_to_sheet([]);

//     // Parse the HTML table using the SheetJS library
//     const table = XLSX.utils.table_to_sheet(html);

//     // Copy the table data to the worksheet
//     XLSX.utils.sheet_add_aoa(worksheet, XLSX.utils.sheet_to_json(table, { header: 1 }));

//     // Add the worksheet to the workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     // Write the workbook to an Excel file
//     XLSX.writeFile(workbook, 'my-excel-file.xlsx');
//     res.redirect('/manager')

// }

var attendance_data = [];

exports.attendance = async (req, res) => {

    var dd = attendance_data.flat();
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    //   console.log(filteredData);
    const filteredData = dd.filter(item => {
        const presents = item.presents;
        if (presents && presents.length > 0) {
            const dates = presents.map(obj => obj.date);
            return !dates.includes(currentDate);
        }
        return true; // Include items without any presents
    });
    console.log(filteredData, filteredData.length, "(((");

    var data = filteredData
    res.render('attendance', { data });
};

exports.batch_attendance = async (req, res) => {
    console.log(req.body);
    var today = new Date();

    // var data = await Student.find({batch_time: req.body.batch});
    // const today = new Date();

    const data = await Student.find({
        batch_time: req.body.batch,
        presents: {
            $not: {
                $elemMatch: { date: today }
            }
        }
    });

    attendance_data = data
    // res.json({redirectTo:'/manager/attendance'})
    // console.log(data, 'OOOOOOOOOOO');
    res.redirect('/manager/attendance');
};

exports.presents = async (req, res) => {

    console.log(req.params)
    var today = new Date();
    var data = await Student.findByIdAndUpdate(req.params.id, {
        $push: {
            presents: {
                date: today.toISOString().split('T')[0],
                present: true
            }
        }
    },
        { new: true })
    if (data) {
        // console.log(data, "OOOO");

        res.redirect('/manager/attendance')
    }

}

exports.absent = async (req, res) => {

    console.log(req.params)
    var today = new Date();
    var data = await Student.findByIdAndUpdate(req.params.id, {
        $push: {
            presents: {
                date: today.toISOString().split('T')[0],
                present: false
            }
        }
    },
        { new: true })
    if (data) {
        // console.log(data, "OOOO");
        res.redirect('/manager/attendance')
    }

}