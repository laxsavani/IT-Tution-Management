var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    name: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    studyin: {
        type: String,
    },
    institute_name: {
        type: String,
    },
    father_name: {
        type: String,
    },
    edu_qualification_father: {
        type: String,
    },
    father_phone: {
        type: String,
    },
    cource: {
        type: String,
    },
    fees: {
        type: String,
    },
    image: {
        type: String,
    },
    password: {
        type: String
    },
    paid_fees: {
        type: String,
    }
    , pending_fees: {
        type: String
    },
    grid: {
        type: String
    },
    color: {
        type: String,
        enum: ['#fa4e576e', '#add483', '#b9b9ff']
    },
    lastClicked: {
        type: Date,
        default: null
    },
    student_color_number: {
        type: Number,
        default: 0,
    },
    payment_id:{
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
    batch_time:{
        type: String,
    },
    presents:{
        type:Object
    }
    
});


module.exports = mongoose.model('student', studentSchema);